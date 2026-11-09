import { ImageGestures } from './image-gestures'

/** Bind non-passive touch input on the expanded media itself. Safari/WKWebView
 * must not hand a pinch to page zoom or depend on pointer-capture transfers. */
export function bindImageTouchEvents(root: HTMLElement, controller: ImageGestures, callbacks: {
  update: () => void
  dragging: (value: boolean) => void
  suppressClick: () => void
  allowMarginTap: () => void
}) {
  const start = (event: TouchEvent) => {
    const touches = Array.from(event.touches)
    const target = event.target as Element
    const content = !!target.closest('.case-image-zoom-content')
    if (touches.length === 1 && !content) callbacks.allowMarginTap()
    const video = target.closest('video[controls]')
    if (touches.length === 1 && video) {
      const box = video.getBoundingClientRect()
      // Keep taps and scrubbing in the native playback controls available.
      if (touches[0].clientY > box.bottom - Math.min(56 * controller.state.scale, box.height / 4)) return
    }
    for (const touch of touches.slice(0, 2)) {
      if (!controller.pointers.has(touch.identifier)) controller.start(touch.identifier, { x: touch.clientX, y: touch.clientY })
    }
    if (content || touches.length > 1) {
      if (event.cancelable) event.preventDefault()
      callbacks.dragging(true)
    }
    // A single untouched margin tap must still generate the close-button click.
  }
  const move = (event: TouchEvent) => {
    let handled = false
    for (const touch of Array.from(event.touches)) {
      handled = controller.move(touch.identifier, { x: touch.clientX, y: touch.clientY }) || handled
    }
    if (handled) {
      if (event.cancelable) event.preventDefault()
      if (controller.moved) callbacks.suppressClick()
      callbacks.update()
    }
  }
  const finish = (event: TouchEvent) => {
    const tracked = Array.from(event.changedTouches).some(touch => controller.pointers.has(touch.identifier))
    if (!tracked) return
    if (controller.moved) {
      if (event.cancelable) event.preventDefault()
      callbacks.suppressClick()
    }
    for (const touch of Array.from(event.changedTouches)) controller.end(touch.identifier)
    callbacks.dragging(controller.pointers.size > 0)
    callbacks.update()
  }
  // WebKit dispatches proprietary gestures alongside touches. Do not allow its
  // native video/page zoom to run in parallel with our image-local transform.
  const preventNativeGesture = (event: Event) => { if (event.cancelable) event.preventDefault() }
  root.addEventListener('touchstart', start, { passive: false })
  root.addEventListener('touchmove', move, { passive: false })
  root.addEventListener('touchend', finish, { passive: false })
  root.addEventListener('touchcancel', finish, { passive: false })
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) root.addEventListener(type, preventNativeGesture, { passive: false, capture: true })
  return () => {
    root.removeEventListener('touchstart', start)
    root.removeEventListener('touchmove', move)
    root.removeEventListener('touchend', finish)
    root.removeEventListener('touchcancel', finish)
    for (const type of ['gesturestart', 'gesturechange', 'gestureend']) root.removeEventListener(type, preventNativeGesture, { capture: true })
    controller.cancel()
  }
}
