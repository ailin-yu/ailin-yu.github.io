import { readFileSync } from 'node:fs'
import { stripTypeScriptTypes } from 'node:module'
import { runInNewContext } from 'node:vm'
import assert from 'node:assert/strict'
import test from 'node:test'

// Exercise the production hook's wheel listeners, including a browser gesture
// whose event target remains the hero after the rail moves under the pointer.
const source = stripTypeScriptTypes(readFileSync(new URL('../src/components/home/useGalleryMotion.ts', import.meta.url), 'utf8'))
  .replace(/^import .* from 'react'\n/m, '')
  .replace('export function useGalleryMotion', 'function useGalleryMotion')

function setup({ height = 804 } = {}) {
  const state = { y: 0, pendingY: null, clock: 0, transition: false }
  const frames = new Map()
  let serial = 0, cleanup
  const events = object => Object.assign(object, {
    listeners: new Map(),
    addEventListener(name, handler) { this.listeners.set(name, [...(this.listeners.get(name) || []), handler]) },
    removeEventListener(name, handler) { this.listeners.set(name, (this.listeners.get(name) || []).filter(item => item !== handler)) },
  })
  const rect = (top, h) => ({ top, bottom: top + h, left: 0, right: 579, width: 579, height: h })
  const section = { dataset: {}, getBoundingClientRect: () => rect(604 - state.y, 553.5) }
  const rail = events({
    scrollLeft: 0, clientWidth: 579, scrollWidth: 2800, dataset: {},
    closest: () => section, querySelectorAll: () => [],
    getBoundingClientRect: () => rect(704 - state.y, 393.5),
  })
  const page = events({ scrollTo({ top, behavior }) { if (behavior === 'smooth') state.pendingY = top; else { state.y = top; state.pendingY = null } } })
  const doc = events({ hidden: false, querySelector: selector => state.transition && selector.includes('.project-entry-layer') ? {} : null })
  const noopObserver = class { observe() {} disconnect() {} }
  const scope = {
    rail,
    useRef: current => ({ current }), useEffect: callback => { cleanup = callback() },
    window: page, document: doc, innerHeight: height, Element: class {},
    performance: { now: () => state.clock },
    matchMedia: () => events({ matches: false }),
    getComputedStyle: () => ({ scrollMarginTop: '24px' }),
    sessionStorage: { getItem: () => null, setItem() {} },
    requestAnimationFrame: callback => { frames.set(++serial, callback); return serial },
    cancelAnimationFrame: id => frames.delete(id),
    ResizeObserver: noopObserver, IntersectionObserver: noopObserver,
    setTimeout, clearTimeout,
  }
  Object.defineProperty(scope, 'scrollY', { get: () => state.y })
  runInNewContext(`${source}\nuseGalleryMotion({ current: rail })`, scope)
  const wheel = (options = {}) => {
    const event = {
      deltaX: 0, deltaY: 120, deltaMode: 0, clientX: 300, clientY: 250,
      ctrlKey: false, cancelable: true, defaultPrevented: false, target: {}, ...options,
      preventDefault() { if (this.cancelable) this.defaultPrevented = true },
    }
    for (const handler of page.listeners.get('wheel') || []) handler(event)
    if (event.target === rail) for (const handler of rail.listeners.get('wheel') || []) handler(event)
    return event
  }
  const flush = () => {
    for (let i = 0; frames.size && i < 200; i++) {
      state.clock += 16.667
      const batch = [...frames.values()]; frames.clear()
      for (const callback of batch) callback(state.clock)
    }
    assert.equal(frames.size, 0, 'animation should settle')
  }
  const arrive = () => { assert.equal(state.pendingY, 580); state.y = state.pendingY; state.pendingY = null }
  return { rail, state, wheel, arrive, flush, cleanup: () => cleanup() }
}

test('keeps the entering gesture vertical until Work finishes aligning', t => {
  const app = setup(); t.after(app.cleanup)
  assert.equal(app.wheel().defaultPrevented, true)
  assert.equal(app.wheel().defaultPrevented, true)
  assert.equal(app.rail.scrollLeft, 0)
  assert.equal(app.state.y, 0)
  assert.equal(app.state.pendingY, 580)
})

test('continues horizontally after alignment with no mouse movement or gesture pause', t => {
  const app = setup(); t.after(app.cleanup)
  const hero = {}
  app.wheel({ target: hero }); app.arrive()
  assert.equal(app.wheel({ target: hero }).defaultPrevented, true)
  app.flush()
  assert.equal(app.rail.scrollLeft, 120)
  assert.equal(app.state.y, 580)
})

test('a later gesture still works when the browser keeps the old hero target', t => {
  const app = setup(); t.after(app.cleanup)
  const hero = {}
  app.wheel({ target: hero }); app.arrive(); app.flush()
  assert.equal(app.wheel({ target: hero }).defaultPrevented, true)
  app.flush()
  assert.equal(app.rail.scrollLeft, 120)
})

test('capture and rail listeners consume each wheel event only once', t => {
  const app = setup(); t.after(app.cleanup)
  app.wheel(); app.arrive(); app.flush()
  app.wheel({ target: app.rail }); app.flush()
  assert.equal(app.rail.scrollLeft, 120)
})

test('releases page scrolling outside the rail and at either horizontal edge', t => {
  const app = setup(); t.after(app.cleanup)
  app.wheel(); app.arrive(); app.flush()
  assert.equal(app.wheel({ clientY: 650 }).defaultPrevented, false)
  assert.equal(app.wheel({ deltaY: -120 }).defaultPrevented, false)
  app.rail.scrollLeft = app.rail.scrollWidth - app.rail.clientWidth
  assert.equal(app.wheel().defaultPrevented, false)
})

test('does not take over before captions fit, and leaves browser zoom untouched', t => {
  const app = setup({ height: 400 }); t.after(app.cleanup)
  app.wheel(); app.arrive(); app.flush()
  assert.equal(app.wheel().defaultPrevented, false)
  assert.equal(app.wheel({ ctrlKey: true }).defaultPrevented, false)
  assert.equal(app.rail.scrollLeft, 0)
})

test('finishes native vertical motion before handing wheel input to the rail', t => {
  const app = setup(); t.after(app.cleanup)
  app.wheel()
  app.state.y = 579 // Native smooth scroll is within tolerance but still running.
  assert.equal(app.state.pendingY, 580)
  assert.equal(app.wheel().defaultPrevented, true)
  assert.equal(app.state.pendingY, null, 'native vertical animation must be stopped')
  assert.equal(app.state.y, 580)
  app.flush()
  assert.equal(app.rail.scrollLeft, 120)
})

test('cancels queued horizontal motion when reversing out at the first card', t => {
  const app = setup(); t.after(app.cleanup)
  app.wheel(); app.arrive(); app.flush()
  app.wheel() // Another wheel event can arrive before the first animation frame.
  assert.equal(app.wheel({ deltaY: -120 }).defaultPrevented, false)
  app.flush()
  assert.equal(app.rail.scrollLeft, 0, 'page scroll must not leave the rail moving the other way')
})

test('does not start alignment from a wheel event the browser cannot cancel', t => {
  const app = setup(); t.after(app.cleanup)
  assert.equal(app.wheel({ cancelable: false }).defaultPrevented, false)
  assert.equal(app.state.pendingY, null)
})

test('hands non-cancelable wheel input back without converting or duplicating it', t => {
  const app = setup(); t.after(app.cleanup)
  app.wheel(); app.arrive(); app.flush()
  app.wheel()
  assert.equal(app.wheel({ cancelable: false, target: app.rail }).defaultPrevented, false)
  app.flush()
  assert.equal(app.rail.scrollLeft, 0)
})

test('cancels native alignment when the user switches to horizontal scrolling', t => {
  const app = setup(); t.after(app.cleanup)
  app.wheel()
  assert.equal(app.wheel({ deltaX: 80, deltaY: 20 }).defaultPrevented, false)
  assert.equal(app.state.pendingY, null)
  app.flush()
})

test('keeps Work still while a project cover moves between the card and hero', t => {
  const app = setup(); t.after(app.cleanup)
  app.state.transition = true
  app.wheel(); app.flush()
  assert.equal(app.state.pendingY, null)
  assert.equal(app.state.y, 0)
  app.state.transition = false
  app.wheel(); app.arrive(); app.flush()
  app.state.transition = true
  app.wheel(); app.flush()
  assert.equal(app.rail.scrollLeft, 0)
  assert.equal(app.state.y, 580)
})
