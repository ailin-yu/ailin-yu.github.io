import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import assert from 'node:assert/strict'
import test from 'node:test'

const source = stripTypeScriptTypes(readFileSync(new URL('../src/lib/image-gestures.ts', import.meta.url), 'utf8'))
  .replace('export class ImageGestures', 'class ImageGestures')
const Controller = runInNewContext(`${source}\nImageGestures`)
const create = (height = 700) => new Controller({ viewportWidth: 400, viewportHeight: 800, width: 360, height, gap: 20 })
const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < .0001, `${actual} should equal ${expected}`)

test('two fingers pinch around the midpoint and can translate together', () => {
  const c = create()
  c.start(1, { x: 150, y: 350 }); c.start(2, { x: 250, y: 450 })
  c.move(1, { x: 130, y: 330 }); c.move(2, { x: 330, y: 530 })
  near(c.state.scale, 2); near(c.state.x, 30); near(c.state.y, 30)
  assert.equal(c.moved, true)
})

test('zooming keeps the image point beneath an off-centre focal point', () => {
  const c = create()
  c.zoomTo(2, { x: 260, y: 450 })
  near(200 + c.state.x + 60 * c.state.scale, 260)
  near(400 + c.state.y + 50 * c.state.scale, 450)
})

test('one finger cannot move the fitted image, but pans after enlargement', () => {
  const c = create()
  c.start(1, { x: 200, y: 400 }); c.move(1, { x: 240, y: 450 })
  near(c.state.x, 0); near(c.state.y, 0)
  c.end(1); c.zoomTo(2)
  c.start(1, { x: 200, y: 400 }); c.move(1, { x: 240, y: 450 })
  near(c.state.x, 40); near(c.state.y, 50)
})

test('lifting one finger rebases panning without jumping', () => {
  const c = create()
  c.start(1, { x: 150, y: 350 }); c.start(2, { x: 250, y: 450 })
  c.move(1, { x: 100, y: 300 }); c.move(2, { x: 300, y: 500 })
  c.end(2)
  const before = { ...c.state }
  c.move(1, { x: 115, y: 320 })
  near(c.state.scale, before.scale); near(c.state.x, before.x + 15); near(c.state.y, before.y + 20)
})

test('pan bounds allow the image edges to be reached without losing the image', () => {
  const c = create()
  c.zoomTo(2); c.start(1, { x: 200, y: 400 }); c.move(1, { x: 10000, y: -10000 })
  near(c.state.x, 180); near(c.state.y, -320)
  near(200 + c.state.x - 360 * 2 / 2, 20)
})

test('an axis that already fits remains centred at any zoom', () => {
  const c = create(200)
  c.zoomTo(2); c.start(1, { x: 200, y: 400 }); c.move(1, { x: 240, y: 700 })
  near(c.state.x, 40); near(c.state.y, 0)
})

test('zoom clamps to 1–5 and returning to 1 recentres both axes', () => {
  const c = create()
  c.zoomTo(10); near(c.state.scale, 5)
  c.start(1, { x: 200, y: 400 }); c.move(1, { x: 300, y: 500 }); c.end(1)
  c.zoomTo(.1); near(c.state.scale, 1); near(c.state.x, 0); near(c.state.y, 0)
})

test('cancellation and stray pointers cannot keep dragging or corrupt the state', () => {
  const c = create()
  c.start(1, { x: 200, y: 400 }); c.start(2, { x: 200, y: 400 })
  assert.equal(c.start(3, { x: 0, y: 0 }), false)
  c.move(1, { x: 210, y: 400 })
  assert.ok(Number.isFinite(c.state.scale))
  c.cancel(); assert.equal(c.pointers.size, 0)
  const before = { ...c.state }
  assert.equal(c.move(1, { x: 900, y: 900 }), false)
  assert.deepEqual({ ...c.state }, before)
})

const touchSource = stripTypeScriptTypes(readFileSync(new URL('../src/lib/image-touch-events.ts', import.meta.url), 'utf8'))
  .replace(/^import .*$/gm, '').replace('export function bindImageTouchEvents', 'function bindImageTouchEvents')
const bindTouches = runInNewContext(`${touchSource}\nbindImageTouchEvents`)
const touch = (identifier, clientX, clientY) => ({ identifier, clientX, clientY })
function touchFixture() {
  const root = new EventTarget(), controller = create()
  const media = { closest: selector => selector === '.case-image-zoom-content' ? media : null }
  const margin = { closest: () => null }
  const video = { closest: selector => selector === '.case-image-zoom-content' ? media : video, getBoundingClientRect: () => ({ bottom: 750, height: 700 }) }
  const result = { updates: 0, dragging: false, suppressed: false }
  const cleanup = bindTouches(root, controller, {
    update: () => result.updates++, dragging: value => { result.dragging = value },
    suppressClick: () => { result.suppressed = true }, allowMarginTap: () => { result.suppressed = false },
  })
  const send = (type, touches, changedTouches = touches, target = media) => {
    const event = new Event(type, { cancelable: true })
    Object.defineProperties(event, { touches: { value: touches }, changedTouches: { value: changedTouches }, target: { value: target } })
    root.dispatchEvent(event)
    return event
  }
  return { controller, media, margin, video, result, send, cleanup }
}

test('native touch events pinch, then keep the remaining finger dragging horizontally', () => {
  const f = touchFixture()
  assert.equal(f.send('touchstart', [touch(10, 150, 400)]).defaultPrevented, true)
  f.send('touchstart', [touch(10, 150, 400), touch(20, 250, 400)], [touch(20, 250, 400)])
  assert.equal(f.send('touchmove', [touch(10, 100, 400), touch(20, 300, 400)]).defaultPrevented, true)
  near(f.controller.state.scale, 2)
  f.send('touchend', [touch(10, 100, 400)], [touch(20, 300, 400)])
  f.send('touchmove', [touch(10, 160, 400)])
  near(f.controller.state.scale, 2); near(f.controller.state.x, 60)
  assert.equal(f.result.suppressed, true)
  f.send('touchend', [], [touch(10, 160, 400)])
  assert.equal(f.controller.pointers.size, 0); assert.equal(f.result.dragging, false)
  assert.ok(f.result.updates > 0)
  f.cleanup()
})

test('a pinch beginning in the margin is owned, while a fresh blank tap still closes', () => {
  const f = touchFixture()
  assert.equal(f.send('touchstart', [touch(1, 20, 400)], undefined, f.margin).defaultPrevented, false)
  assert.equal(f.send('touchstart', [touch(1, 20, 400), touch(2, 200, 400)], [touch(2, 200, 400)]).defaultPrevented, true)
  f.send('touchmove', [touch(1, 20, 400), touch(2, 380, 400)])
  near(f.controller.state.scale, 2)
  assert.equal(f.send('touchend', [], [touch(1, 20, 400), touch(2, 380, 400)]).defaultPrevented, true)
  const tap = touch(3, 20, 200)
  assert.equal(f.send('touchstart', [tap], undefined, f.margin).defaultPrevented, false)
  assert.equal(f.result.suppressed, false)
  assert.equal(f.send('touchend', [], [tap], f.margin).defaultPrevented, false)
  f.cleanup()
})

test('native video controls receive taps and seek gestures without interference', () => {
  const f = touchFixture(), finger = touch(1, 200, 730)
  assert.equal(f.send('touchstart', [finger], undefined, f.video).defaultPrevented, false)
  assert.equal(f.controller.pointers.size, 0)
  assert.equal(f.send('touchmove', [touch(1, 260, 730)], undefined, f.video).defaultPrevented, false)
  assert.equal(f.send('touchend', [], [finger], f.video).defaultPrevented, false)
  f.cleanup()
})

test('native touch cancellation and unmount remove active touches and listeners', () => {
  const f = touchFixture(), finger = touch(1, 150, 400)
  f.send('touchstart', [finger])
  f.send('touchcancel', [], [finger])
  assert.equal(f.controller.pointers.size, 0); assert.equal(f.result.dragging, false)
  f.send('touchstart', [finger]); f.cleanup()
  assert.equal(f.controller.pointers.size, 0)
  assert.equal(f.send('touchstart', [finger]).defaultPrevented, false)
  assert.equal(f.controller.pointers.size, 0)
})

test('WebKit gesture events cannot start native video zoom in parallel', () => {
  const f = touchFixture()
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) {
    assert.equal(f.send(type, []).defaultPrevented, true)
  }
  f.cleanup()
  assert.equal(f.send('gesturestart', []).defaultPrevented, false)
})
