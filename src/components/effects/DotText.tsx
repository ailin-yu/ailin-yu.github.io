import { useEffect, useRef, useState } from 'react'
import { useTheme } from '@/components/portfolio/ThemeProvider'

type Particle = { bx: number; by: number; x: number; y: number; vx: number; vy: number; angle: number }

export function DotText({ text }: { text: string }) {
  const { theme } = useTheme()
  const ref = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas?.getContext('2d')
    const mask = document.createElement('canvas')
    const m = mask.getContext('2d', { willReadFrequently: true })
    if (!canvas || !ctx || !m) return
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(pointer: fine)')
    let width = 0, height = 0, radius = 90, dot = .7, particles: Particle[] = [], raf = 0, last = 0, visible = false, disposed = false
    const pointer = { x: 0, y: 0, active: false }
    const color = getComputedStyle(document.documentElement).getPropertyValue('--brand').trim()
    const family = getComputedStyle(document.documentElement).getPropertyValue('--font-heading-zh').trim()
    function draw() {
      ctx!.clearRect(0, 0, width, height); ctx!.fillStyle = color; ctx!.beginPath()
      for (const p of particles) { ctx!.moveTo(p.x + dot, p.y); ctx!.arc(p.x, p.y, dot, 0, Math.PI * 2) }
      ctx!.fill()
    }
    function frame(now: number) {
      raf = 0
      if (document.hidden || !visible) return
      const dt = last ? Math.min((now - last) / 16.667, 2) : 1; last = now
      let energy = 0
      for (const p of particles) {
        let tx = p.bx, ty = p.by
        if (pointer.active && !reduced.matches) {
          const dx = p.bx - pointer.x, dy = p.by - pointer.y, distance = Math.hypot(dx, dy)
          if (distance < radius) { const falloff = 1 - distance / radius, force = radius * 1.12 * falloff * falloff, angle = distance > .01 ? Math.atan2(dy, dx) : p.angle; tx += Math.cos(angle) * force; ty += Math.sin(angle) * force }
        }
        p.vx = (p.vx + (tx - p.x) * .115 * dt) * Math.pow(.73, dt); p.vy = (p.vy + (ty - p.y) * .115 * dt) * Math.pow(.73, dt)
        p.x += p.vx * dt; p.y += p.vy * dt
        energy = Math.max(energy, Math.abs(p.x - p.bx) + Math.abs(p.y - p.by) + Math.abs(p.vx) + Math.abs(p.vy))
      }
      draw()
      if ((pointer.active && !reduced.matches) || energy > .025) raf = requestAnimationFrame(frame)
      else { last = 0; for (const p of particles) { p.x = p.bx; p.y = p.by; p.vx = p.vy = 0 }; draw() }
    }
    function wake() { if (!raf && !document.hidden && visible) { last = 0; raf = requestAnimationFrame(frame) } }
    function reset() { pointer.active = false; wake() }
    function resize() {
      if (disposed) return
      cancelAnimationFrame(raf); raf = 0; last = 0; pointer.active = false
      const nextWidth = canvas!.clientWidth, nextHeight = canvas!.clientHeight
      // Suspense can temporarily hide the previous route. ResizeObserver then
      // reports zero dimensions; wait for its next visible measurement.
      if (nextWidth <= 0 || nextHeight <= 0) {
        particles = []
        setReady(false)
        return
      }
      width = nextWidth; height = nextHeight
      const dpr = Math.min(devicePixelRatio || 1, 2)
      canvas!.width = Math.round(width * dpr); canvas!.height = Math.round(height * dpr); ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      let size = Math.min(width / (text.length + .55), height * .68)
      m!.font = `400 ${size}px ${family}`
      if (m!.measureText(text).width > width - 30) size *= (width - 30) / m!.measureText(text).width
      mask.width = Math.ceil(width); mask.height = Math.ceil(height)
      m!.font = `400 ${size}px ${family}`; m!.fillStyle = '#000'; m!.textAlign = 'left'; m!.textBaseline = 'alphabetic'
      const metrics = m!.measureText(text), ascent = metrics.actualBoundingBoxAscent || size * .75, descent = metrics.actualBoundingBoxDescent || size * .2
      m!.fillText(text, 24, (height + ascent - descent) / 2)
      const pixels = m!.getImageData(0, 0, mask.width, mask.height).data, step = Math.max(1.35, Math.min(2.15, size / 45))
      dot = step * .31; radius = Math.max(45, Math.min(100, size * 1.05)); particles = []
      for (let y = 0; y < height; y += step) for (let x = 0; x < width; x += step) if (pixels[(Math.floor(y) * mask.width + Math.floor(x)) * 4 + 3] > 105) particles.push({ bx: x, by: y, x, y, vx: 0, vy: 0, angle: Math.sin(x * 12.9 + y * 7.3) * Math.PI })
      draw()
      setReady(true)
    }
    const move = (e: PointerEvent) => { if (e.pointerType === 'touch' || !fine.matches || reduced.matches) return; const box = canvas.getBoundingClientRect(); pointer.x = e.clientX - box.left; pointer.y = e.clientY - box.top; pointer.active = true; wake() }
    const visibility = () => { pointer.active = false; if (document.hidden) { cancelAnimationFrame(raf); raf = 0; last = 0 } else wake() }
    const observer = new ResizeObserver(resize); observer.observe(canvas)
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (!visible) { cancelAnimationFrame(raf); raf = 0; reset() } else wake() }); intersection.observe(canvas)
    canvas.addEventListener('pointermove', move, { passive: true }); canvas.addEventListener('pointerleave', reset); window.addEventListener('blur', reset); document.addEventListener('visibilitychange', visibility); reduced.addEventListener('change', reset)
    document.fonts.ready.then(resize); resize()
    return () => { disposed = true; cancelAnimationFrame(raf); observer.disconnect(); intersection.disconnect(); canvas.removeEventListener('pointermove', move); canvas.removeEventListener('pointerleave', reset); window.removeEventListener('blur', reset); document.removeEventListener('visibilitychange', visibility); reduced.removeEventListener('change', reset) }
  }, [text, theme])
  return <div className="dot-title"><h2 className={ready ? 'sr-only' : 'dot-text-fallback'}>{text}</h2><canvas ref={ref} aria-hidden="true" style={{ opacity: ready ? 1 : 0 }} /></div>
}
