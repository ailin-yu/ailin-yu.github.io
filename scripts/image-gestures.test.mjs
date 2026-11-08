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
