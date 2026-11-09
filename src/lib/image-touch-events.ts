import { ImageGestures } from './image-gestures'

/** Bind non-passive touch input on the expanded media itself. Safari/WKWebView
 * must not hand a pinch to page zoom or depend on pointer-capture transfers. */
export function bindImageTouchEvents(root: HTMLElement, controller: ImageGestures, callbacks: {
  update: () => void
  dragging: (value: boolean) => void
  suppressClick: () => void
  allowMarginTap: () => void
}) {
  const points = (event: TouchEvent) => Array.from(event.touches).filter(touch => !(touch.target as Element | null)?.closest?.('[data-media-controls]')).slice(0, 2)
  const reconcile = (touches: Touch[]) => {
    const active = new Set(touches.map(touch => touch.identifier))
    for (const id of controller.pointers.keys()) { if (!active.has(id)) controller.end(id) }
    for (const touch of touches) {
      if (!controller.pointers.has(touch.identifier)) controller.start(touch.identifier, { x: touch.clientX, y: touch.clientY })
    }
  }
  const start = (event: TouchEvent) => {
    const target = event.target as Element
    if (target.closest('[data-media-controls]')) { callbacks.allowMarginTap(); return }
    const touches = points(event)
    const content = !!target.closest('.case-image-zoom-content')
    if (touches.length === 1 && !content) callbacks.allowMarginTap()
    reconcile(touches)
    if (content || touches.length > 1) {
      if (event.cancelable) event.preventDefault()
      callbacks.dragging(true)
    }
    // A single untouched margin tap must still generate the close-button click.
  }
  const move = (event: TouchEvent) => {
    if ((event.target as Element).closest('[data-media-controls]')) return
    const touches = points(event)
    // WebViews can cancel or omit the final event of a native pinch. The actual
    // live TouchList is authoritative, so a remaining finger always becomes pan.
    reconcile(touches)
    let handled = false
    for (const touch of touches) {
      handled = controller.move(touch.identifier, { x: touch.clientX, y: touch.clientY }) || handled
    }
    if (handled) {
      if (event.cancelable) event.preventDefault()
      if (controller.moved) callbacks.suppressClick()
      callbacks.update()
    }
  }
  const finish = (event: TouchEvent) => {
    if ((event.target as Element).closest('[data-media-controls]')) return
    if (!controller.pointers.size) return
    if (controller.moved) {
      if (event.cancelable) event.preventDefault()
      callbacks.suppressClick()
    }
    reconcile(points(event))
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
