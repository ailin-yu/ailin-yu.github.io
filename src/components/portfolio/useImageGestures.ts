import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject } from 'react'
import { ImageGestures, type ImageBounds } from '@/lib/image-gestures'
import { bindImageTouchEvents } from '@/lib/image-touch-events'

export function useImageGestures(bounds: ImageBounds, root: RefObject<HTMLDivElement | null>) {
  const [controller] = useState(() => new ImageGestures(bounds))
  const [transform, setTransform] = useState(controller.state)
  const [dragging, setDragging] = useState(false)
  const frame = useRef(0)
  const suppressClickUntil = useRef(0)
  const reset = useCallback(() => {
    cancelAnimationFrame(frame.current); frame.current = 0
    controller.cancel(); controller.zoomTo(1)
    setTransform({ ...controller.state }); setDragging(false)
  }, [controller])
  const update = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(() => {
      frame.current = 0; setTransform({ ...controller.state })
    })
  }, [controller])
  useEffect(() => {
    if (!root.current) return
    return bindImageTouchEvents(root.current, controller, {
      update, dragging: setDragging,
      suppressClick: () => { suppressClickUntil.current = performance.now() + 350 },
      allowMarginTap: () => { suppressClickUntil.current = 0 },
    })
  }, [controller, root, update])
  useEffect(() => () => { cancelAnimationFrame(frame.current); controller.cancel() }, [controller])
  const finish = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'touch') return
    if (!controller.pointers.has(event.pointerId)) return
    if (controller.moved) suppressClickUntil.current = performance.now() + 350
    controller.end(event.pointerId)
    setDragging(controller.pointers.size > 0)
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }
  return {
    transform,
    dragging,
    reset,
    handlers: {
      onPointerDown(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'touch') return
        if (event.pointerType === 'mouse' && event.button !== 0) return
        const target = event.target as Element
        if (!controller.pointers.size && !target.closest('.case-image-zoom-content')) {
          suppressClickUntil.current = 0
          return
        }
        // Let native video playback/seek controls receive their own input.
        const video = target.closest('video[controls]')
        if (!controller.pointers.size && video) {
          const box = video.getBoundingClientRect()
          if (event.clientY > box.bottom - Math.min(56 * controller.state.scale, box.height / 4)) return
        }
        if (!controller.start(event.pointerId, { x: event.clientX, y: event.clientY })) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        setDragging(true)
      },
      onPointerMove(event: PointerEvent<HTMLDivElement>) {
        if (event.pointerType === 'touch') return
        if (controller.move(event.pointerId, { x: event.clientX, y: event.clientY })) { event.preventDefault(); update() }
      },
      onPointerUp: finish,
      onPointerCancel: finish,
      onLostPointerCapture(event: PointerEvent<HTMLDivElement>) {
        if (event.target === event.currentTarget) finish(event)
      },
      onClickCapture(event: MouseEvent<HTMLDivElement>) {
        if (performance.now() < suppressClickUntil.current) { event.preventDefault(); event.stopPropagation() }
      },
      onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if ((event.target as Element).closest('video')) return
        if (!['+', '=', '-', '0'].includes(event.key)) return
        event.preventDefault()
        controller.zoomTo(event.key === '0' ? 1 : controller.state.scale + (event.key === '-' ? -.5 : .5))
        update()
      },
    },
  }
}
