import { useEffect, useRef, type RefObject } from 'react'

/** Work anchor alignment and horizontal gallery browsing. */
export function useGalleryMotion(rail: RefObject<HTMLDivElement | null>) {
  const stopRef = useRef<() => void>(() => {})
  useEffect(() => {
    const element = rail.current
    if (!element) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0, last = 0, target = 0, visible = true
    const section = element.closest<HTMLElement>('.figma-work')!
    let snapping = false, snapFrame = 0, snapStarted = 0
    let touchStartScroll = 0, touchPending = false, touchTimer = 0
    const anchorTop = () => section.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(section).scrollMarginTop) || 24)
    const cancelSnap = () => {
      if (snapping) window.scrollTo({ top: scrollY, behavior: 'instant' })
      snapping = false; cancelAnimationFrame(snapFrame); snapFrame = 0
      section.dataset.anchorState = 'idle'
    }
    const finishSnap = () => {
      // Stop the native smooth-scroll tail before wheel input changes axes.
      window.scrollTo({ top: anchorTop(), behavior: 'instant' })
      snapping = false; cancelAnimationFrame(snapFrame); snapFrame = 0
      section.dataset.anchorState = 'aligned'
    }
    const startSnap = () => {
      stop()
      snapping = true; snapStarted = performance.now()
      section.dataset.anchorState = 'aligning'
      window.scrollTo({ top: anchorTop(), behavior: reduced.matches ? 'instant' : 'smooth' })
      const settle = (now: number) => {
        // Once the captions are visible, continued wheel input can immediately
        // browse the rail without waiting for the reader to stop or move the mouse.
        if (Math.abs(scrollY - anchorTop()) < 2) {
          finishSnap(); return
        }
        if (now - snapStarted > 2200) { cancelSnap(); return }
        snapFrame = requestAnimationFrame(settle)
      }
      snapFrame = requestAnimationFrame(settle)
    }
    const enterWork = (event: WheelEvent) => {
      if (event.defaultPrevented || document.querySelector('[role="dialog"], .project-entry-layer')) return
      if (!event.cancelable || event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) {
        cancelSnap(); stop(); return
      }
      if (snapping) {
        if (event.deltaY < 0) { cancelSnap(); return }
        if (Math.abs(scrollY - anchorTop()) >= 2) { event.preventDefault(); return }
        finishSnap()
      }
      if (event.deltaY > 0 && scrollY < anchorTop() - 2) { event.preventDefault(); startSnap(); return }
      // Browsers can latch a wheel gesture to the original hero element even
      // after the Work rail moves under a stationary pointer. Hit-test the new
      // viewport geometry instead of depending on pointerenter/event.target.
      const bounds = element.getBoundingClientRect()
      if (event.clientX >= bounds.left && event.clientX < bounds.right && event.clientY >= bounds.top && event.clientY < bounds.bottom) wheel(event)
    }
    const cancelForInput = () => { cancelSnap(); touchPending = false; clearTimeout(touchTimer) }
    const key = (event: KeyboardEvent) => {
      if (event.defaultPrevented || document.querySelector('.project-entry-layer')) return
      if (event.target instanceof Element && event.target.closest('button,a,input,textarea,select,[contenteditable],[role="dialog"]')) return
      if ((event.key === 'PageDown' || (event.code === 'Space' && !event.shiftKey)) && scrollY < anchorTop() - 2) { event.preventDefault(); if (!snapping) startSnap() }
      else cancelForInput()
    }
    const touchStart = () => { cancelForInput(); if (!document.querySelector('.project-entry-layer')) touchStartScroll = scrollY }
    const finishTouch = () => {
      clearTimeout(touchTimer)
      touchTimer = window.setTimeout(() => {
        if (touchPending && scrollY > touchStartScroll + 10 && scrollY < anchorTop() - 2) startSnap()
        touchPending = false
      }, 180)
    }
    const touchEnd = () => {
      if (document.querySelector('.project-entry-layer')) { cancelForInput(); return }
      touchPending = touchStartScroll < anchorTop() - 2
      if (touchPending) finishTouch()
    }
    const pageScroll = () => { if (touchPending) finishTouch() }
    element.scrollLeft = Number(sessionStorage.getItem('portfolio-figma-gallery') || 0)
    target = element.scrollLeft
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; target = element.scrollLeft; element.dataset.moving = 'false' }
    stopRef.current = stop
    const tick = (now: number) => {
      frame = 0
      if (document.hidden || !visible) { stop(); return }
      const dt = last ? Math.min((now - last) / 16.667, 2) : 1
      last = now
      const distance = target - element.scrollLeft
      if (Math.abs(distance) < .8) { element.scrollLeft = target; stop(); return }
      const previous = element.scrollLeft
      element.scrollLeft += distance * (1 - Math.pow(.77, dt))
      if (element.scrollLeft === previous && Math.abs(distance) < 4) { element.scrollLeft = target; stop(); return }
      frame = requestAnimationFrame(tick)
    }
    const wheel = (event: WheelEvent) => {
      if (event.defaultPrevented || snapping) return
      if (!event.cancelable || event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) { stop(); return }
      const bounds = element.getBoundingClientRect()
      // Never capture the page wheel while the title/captions are still below
      // the viewport. Small viewports retain normal vertical scrolling.
      if (section.getBoundingClientRect().top > 32 || bounds.top < 16 || bounds.bottom > innerHeight - 16) { stop(); return }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1)
      const max = element.scrollWidth - element.clientWidth
      if (max <= 0 || (delta < 0 && element.scrollLeft <= 0) || (delta > 0 && element.scrollLeft >= max - 1)) { stop(); return }
      event.preventDefault()
      if (!event.defaultPrevented) { stop(); return }
      target = Math.max(0, Math.min(max, (frame ? target : element.scrollLeft) + delta))
      if (reduced.matches) element.scrollLeft = target
      else if (!frame) { element.dataset.moving = 'true'; frame = requestAnimationFrame(tick) }
    }
    const update = () => { sessionStorage.setItem('portfolio-figma-gallery', String(element.scrollLeft)); if (!frame) target = element.scrollLeft }
    const hide = () => { if (document.hidden) stop() }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) stop() })
    observer.observe(element)
    element.addEventListener('wheel', wheel, { passive: false }); element.addEventListener('scroll', update, { passive: true })
    element.addEventListener('pointerdown', stop, { passive: true }); element.addEventListener('focusin', stop)
    document.addEventListener('visibilitychange', hide); reduced.addEventListener('change', stop)
    window.addEventListener('wheel', enterWork, { passive: false, capture: true })
    window.addEventListener('pointerdown', cancelForInput, { passive: true })
    window.addEventListener('keydown', key)
    window.addEventListener('touchstart', touchStart, { passive: true })
    window.addEventListener('touchend', touchEnd, { passive: true })
    window.addEventListener('scroll', pageScroll, { passive: true })
    return () => {
      stop(); observer.disconnect()
      element.removeEventListener('wheel', wheel); element.removeEventListener('scroll', update); element.removeEventListener('pointerdown', stop); element.removeEventListener('focusin', stop)
      document.removeEventListener('visibilitychange', hide); reduced.removeEventListener('change', stop)
      cancelSnap(); clearTimeout(touchTimer)
      window.removeEventListener('wheel', enterWork, true); window.removeEventListener('pointerdown', cancelForInput); window.removeEventListener('keydown', key)
      window.removeEventListener('touchstart', touchStart); window.removeEventListener('touchend', touchEnd); window.removeEventListener('scroll', pageScroll)
    }
  }, [rail])
  return stopRef
}
