const clamp = (value: number) => Math.max(0, Math.min(1, value))

/** Scroll is the clock: no elapsed-time playback or easing toward a future frame. */
export function observePlantScroll(
  canvas: HTMLCanvasElement,
  render: (progress: number) => void,
  stage: number,
  reducedMotion: boolean,
) {
  const item = canvas.closest('.home-timeline-item') ?? canvas
  const timeline = canvas.closest('.home-timeline') ?? item
  const narrow = window.matchMedia('(max-width: 760px)')
  let frame = 0, visible = false, lastPaint = -Infinity, previous = NaN

  const progress = () => {
    const viewport = window.innerHeight
    if (narrow.matches) {
      // Each mobile experience opens while moving from the lower to upper viewport.
      return clamp((viewport * .92 - item.getBoundingClientRect().top) / (viewport * .68))
    }
    // Finish while the whole row is still visible; later chapters start a little later.
    const row = (viewport * .88 - timeline.getBoundingClientRect().top) / (viewport * .62)
    return clamp((row - stage * .035) / .86)
  }
  const paint = () => {
    const value = reducedMotion ? 1 : progress()
    if (Math.abs(value - previous) < .002) return
    render(value)
    previous = value
    // Exposes the actual painted state for inspection without an extra visible label.
    canvas.dataset.growthProgress = value.toFixed(4)
  }

  // Draw the current scroll state on mount, including restored-scroll and texture loads.
  paint()
  if (reducedMotion) return () => { /* Full static plant; no scroll subscription. */ }

  const tick = (now: number) => {
    frame = 0
    if (!visible || document.hidden) return
    // Coalesce wheel/touch/keyboard scrolling and cap expensive glyph sampling at 30fps.
    if (now - lastPaint < 1000 / 30) {
      frame = requestAnimationFrame(tick)
      return
    }
    paint()
    lastPaint = now
  }
  const requestPaint = () => {
    if (visible && !document.hidden && !frame) frame = requestAnimationFrame(tick)
  }
  const stop = () => { cancelAnimationFrame(frame); frame = 0 }
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (visible) { previous = NaN; requestPaint() }
    else stop()
  })
  const resize = new ResizeObserver(requestPaint)
  intersection.observe(canvas)
  resize.observe(timeline)
  if (item !== timeline) resize.observe(item)

  const onVisibility = () => { if (document.hidden) stop(); else { previous = NaN; requestPaint() } }
  window.addEventListener('scroll', requestPaint, { passive: true })
  window.addEventListener('resize', requestPaint)
  narrow.addEventListener('change', requestPaint)
  document.addEventListener('visibilitychange', onVisibility)
  return () => {
    stop()
    intersection.disconnect()
    resize.disconnect()
    window.removeEventListener('scroll', requestPaint)
    window.removeEventListener('resize', requestPaint)
    narrow.removeEventListener('change', requestPaint)
    document.removeEventListener('visibilitychange', onVisibility)
  }
}
