import { useEffect, useRef, useState, type RefObject } from 'react'
import { useTheme } from '@/components/portfolio/ThemeProvider'
import { homeDesignPlants } from '@/content/home-design'

type Particle = { bx: number; by: number; x: number; y: number; vx: number; vy: number; radius: number; alpha: number; shade: number; red: number; green: number; blue: number; mix: number; seed: number; spine: number; birth: number }
type Props = { variant: 'background' | 'flower'; stage?: number; eventTarget?: RefObject<HTMLElement | null>; flowerTone?: 'gray' | 'cool-violet' }
const asciiGlyphs = '.:+*ox'
const clamp = (value: number) => Math.max(0, Math.min(1, value))
// Reuse the unchanged source geometry and last static render across case visits.
// Raster keys include theme, DPR and growth position; keep this cache bounded.
const particleCache = new Map<string, Particle[]>()
const rasterCache = new Map<string, { canvas: HTMLCanvasElement; flowTime: number; data: Record<string, string> }>()

/** Samples the original Figma raster into individual particles. The source image
 * is only a shape/density mask: every visible mark is drawn by this Canvas.
 * The background pose stays fixed while its ASCII glyphs change.
 */
export function AsciiParticles({ variant, stage = 0, eventTarget, flowerTone = 'cool-violet' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = useState(false)
  const { theme } = useTheme()
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas) return
    if (!ctx) { canvas.dataset.failed = 'true'; return }
    const flower = variant === 'flower'
    const cacheKey = `${variant}:${stage}`
    const cachedParticles = particleCache.get(cacheKey)
    const shape = homeDesignPlants[stage]
    const width = flower ? shape.width : 1440, height = flower ? 300 : 714
    const mask = document.createElement('canvas')
    mask.width = width; mask.height = height
    const m = mask.getContext('2d', { willReadFrequently: true })
    if (!m) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = Math.ceil(width * dpr); canvas.height = height * dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'
    const reduced = matchMedia('(prefers-reduced-motion: reduce)')
    const fine = matchMedia('(pointer: fine)')
    const compact = matchMedia('(max-width: 767px)')
    const animateBackground = () => !reduced.matches
    const frameInterval = () => !flower && (compact.matches || !fine.matches) ? 1000 / 12 : 0
    const pointer = { x: 0, y: 0, active: false }
    let particles: Particle[] = [], frame = 0, timer = 0, last = 0, visible = false, disposed = false
    let imageLoaded = false, sampled = false, sourceRequested = false
    const image = new Image()
    const loadSource = () => {
      if (sourceRequested || cachedParticles || disposed) return
      sourceRequested = true
      image.decoding = 'async'
      image.src = `/home/figma/${flower ? 'flower-source' : 'hero-dot-source'}.webp`
    }
    let initialize = () => {}
    const transitioning = () => document.documentElement.hasAttribute('data-project-entry')
    let flowTime = 0, flowLast = 0
    const dark = theme === 'dark'
    // The optional color study reuses the canonical cool-violet plant token.
    const tintHex = getComputedStyle(canvas).getPropertyValue('--plant-shadow').trim()
    const tint = [1, 3, 5].map(offset => parseInt(tintHex.slice(offset, offset + 2), 16))
    const flowerColors = Array.from({ length: 256 }, (_, value) => {
      const channels = flowerTone === 'gray' ? [value, value, value] : tint.map(channel => Math.round(dark ? channel * value / 255 : channel + (255 - channel) * value / 255))
      return `rgb(${channels.join(',')})`
    })
    const growthProgress = () => {
      if (!flower || reduced.matches) return 1
      const scene = canvas.closest('.figma-experience-scene')
      if (!scene) return 1
      const box = scene.getBoundingClientRect()
      const ground = box.top + box.height * 370 / 714
      const base = clamp((innerHeight * .95 - ground) / (innerHeight * .45))
      return clamp((base - stage * .035) / .86)
    }
    const rasterKey = (progress: string) => `${cacheKey}:${theme}:${flowerTone}:${tintHex}:${dpr}:${reduced.matches}:${animateBackground()}:${progress}`
    const rememberRaster = () => {
      if (!sampled || canvas.dataset.ready !== 'true' || pointer.active || particles.some(p => p.mix > .001 || Math.abs(p.x) + Math.abs(p.y) > .01)) return
      const copy = document.createElement('canvas')
      copy.width = canvas.width; copy.height = canvas.height
      const drawing = copy.getContext('2d')
      if (!drawing) return
      drawing.drawImage(canvas, 0, 0)
      const data: Record<string, string> = {}
      for (const key of ['particles', 'symbols', 'visibleParticles', 'growthProgress', 'flowTime', 'flowState', 'renderMode']) {
        if (canvas.dataset[key] !== undefined) data[key] = canvas.dataset[key]!
      }
      const key = rasterKey(flower ? canvas.dataset.growthProgress || '' : '')
      rasterCache.delete(key)
      rasterCache.set(key, { canvas: copy, flowTime, data })
      if (rasterCache.size > 12) rasterCache.delete(rasterCache.keys().next().value!)
    }
    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height)
      let moving = false, hovered = 0, shown = 0
      const dt = last ? Math.min((now - last) / 16.667, 2) : 1
      last = now
      // Only the background's glyph clock advances; its source coordinates stay fixed.
      if (!flower && animateBackground()) flowTime += flowLast ? Math.max(0, Math.min((now - flowLast) / 1000, .15)) : 0
      flowLast = now
      const growth = growthProgress()
      const occupied = new Set<string>()
      const radius = flower ? 58 : 105
      for (const p of particles) {
        const age = flower ? clamp((growth - p.birth) / .195) : 1
        if (age <= 0) continue
        shown++
        const unfold = 1 - Math.pow(1 - age, 3)
        const bx = flower ? p.spine + (p.bx - p.spine) * unfold : p.bx
        const by = flower ? p.by + 11 * (1 - unfold) : p.by
        const dx = bx - pointer.x, dy = by - pointer.y, distance = Math.hypot(dx, dy)
        const influence = flower && pointer.active && !reduced.matches ? Math.max(0, 1 - distance / radius) : 0
        const targetMix = Math.min(1, influence * 2.5)
        p.mix += (targetMix - p.mix) * (1 - Math.pow(.75, dt))
        if (p.mix < .001) p.mix = 0
        const force = flower ? influence * influence * 4 : 0
        const tx = distance > .01 ? dx / distance * force : 0
        const ty = distance > .01 ? dy / distance * force : 0
        p.vx = (p.vx + (tx - p.x) * .115 * dt) * Math.pow(.73, dt)
        p.vy = (p.vy + (ty - p.y) * .115 * dt) * Math.pow(.73, dt)
        p.x += p.vx * dt; p.y += p.vy * dt
        if (Math.abs(p.x) + Math.abs(p.y) + Math.abs(p.vx) + Math.abs(p.vy) + Math.abs(p.mix - targetMix) > .012) moving = true
        const x = flower ? bx + p.x : bx, y = flower ? by + p.y : by
        // Fine glyphs cover less area than an opaque raster. Compensate their
        // coverage so the original model's shaded petals and stems stay legible.
        const value = dark ? 205 - p.shade * .18 : flower ? Math.max(0, 255 - (255 - p.shade) * 1.6) : p.shade
        ctx.fillStyle = flower ? flowerColors[Math.round(value)] : !dark ? `rgb(${p.red},${p.green},${p.blue})` : `rgb(${value},${value},${Math.min(255, value + 9)})`
        if (flower) {
          ctx.globalAlpha = p.alpha * unfold * (1 - p.mix * .55)
          ctx.font = '3.4px Menlo, Consolas, monospace'
          ctx.fillText(':+*#@'[Math.min(4, Math.floor((255 - p.shade) / 38))], x, y)
        } else {
          // Retain the reference's density while making the marks visibly textual.
          // A travelling band changes glyph weight inside the fixed hand silhouette.
          const wave = (Math.sin(p.bx * .018 + p.by * .012 - flowTime * 2.2) + 1) / 2
          const density = clamp(p.radius / 3.5)
          const glyph = Math.min(5, Math.floor(density * 2.6 + wave * 2.4))
          ctx.globalAlpha = Math.min(.62, p.alpha * (1.35 + wave * .65))
          ctx.font = `${12 + density * 2}px Menlo, Consolas, monospace`
          ctx.fillText(asciiGlyphs[glyph], x, y)
        }
        if (flower && p.mix > .001) {
          // Keep the hover texture close to the original fine grayscale relief.
          const cell = `${Math.floor(x / 4)}:${Math.floor(y / 5)}`
          if (!occupied.has(cell)) {
            occupied.add(cell); hovered++
            ctx.globalAlpha = p.alpha * unfold * .85 * p.mix
            ctx.font = '4.2px Menlo, Consolas, monospace'
            ctx.fillText(asciiGlyphs[(p.seed + Math.floor(now / 140)) % asciiGlyphs.length], x, y)
          }
        }
      }
      ctx.globalAlpha = 1
      canvas.dataset.particles = String(particles.length)
      canvas.dataset.symbols = String(hovered)
      canvas.dataset.visibleParticles = String(shown)
      if (flower) canvas.dataset.growthProgress = growth.toFixed(4)
      else { canvas.dataset.flowTime = flowTime.toFixed(4); canvas.dataset.flowState = animateBackground() ? 'running' : 'static'; canvas.dataset.frameRate = frameInterval() ? '12' : 'display'; canvas.dataset.drawCount = String(Number(canvas.dataset.drawCount || 0) + 1); canvas.dataset.renderMode = 'ascii-fixed' }
      return moving || (!reduced.matches && (flower ? pointer.active : animateBackground()))
    }
    const pause = () => {
      cancelAnimationFrame(frame); clearTimeout(timer); frame = 0; timer = 0; last = 0; flowLast = 0
      if (!flower && sampled) canvas.dataset.flowState = animateBackground() ? 'paused' : 'static'
    }
    const schedule = () => {
      const delay = frameInterval()
      if (delay) timer = window.setTimeout(() => { timer = 0; frame = requestAnimationFrame(tick) }, Math.max(0, delay - (performance.now() - last)))
      else frame = requestAnimationFrame(tick)
    }
    const tick = (now: number) => {
      frame = 0
      if (disposed || !visible || !sampled || document.hidden || transitioning()) { pause(); return }
      const active = draw(now)
      if (active) schedule()
      else last = 0
    }
    const wake = () => { if (!frame && !timer && !disposed && sampled && visible && !document.hidden && !transitioning()) { flowLast = 0; frame = requestAnimationFrame(tick) } }
    const reset = () => { pointer.active = false; wake() }
    const move = (e: PointerEvent) => {
      if (e.pointerType === 'touch' || !fine.matches || reduced.matches) return
      const bounds = canvas.getBoundingClientRect()
      if (!bounds.width || !bounds.height) return
      pointer.x = (e.clientX - bounds.left) * width / bounds.width
      pointer.y = (e.clientY - bounds.top) * height / bounds.height
      pointer.active = pointer.x >= 0 && pointer.x <= width && pointer.y >= 0 && pointer.y <= height
      wake()
    }
    const target = eventTarget?.current || canvas
    if (flower) {
      target.addEventListener('pointermove', move, { passive: true })
      target.addEventListener('pointerleave', reset)
    }
    window.addEventListener('blur', reset)
    const hide = () => {
      pointer.active = false
      if (document.hidden) pause()
      else wake()
    }
    document.addEventListener('visibilitychange', hide)
    document.addEventListener('portfolio:project-transition-end', wake)
    reduced.addEventListener('change', reset)
    fine.addEventListener('change', reset)
    compact.addEventListener('change', reset)
    if (flower) { window.addEventListener('scroll', wake, { passive: true }); window.addEventListener('resize', wake) }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) { loadSource(); if (imageLoaded) initialize(); wake() }
      else { pointer.active = false; pause() }
    }, { rootMargin: flower ? '20px' : '0px' })
    observer.observe(flower ? canvas : canvas.closest('.figma-hero') || canvas)
    initialize = () => {
      if (disposed || !visible || !imageLoaded || sampled) return
      sampled = true
      if (cachedParticles) particles = cachedParticles.map(p => ({ ...p }))
      else {
        m.clearRect(0, 0, width, height)
        if (flower) m.drawImage(image, shape.offsetX * width, 0, image.width * shape.scaleX * width, image.height * .0011274 * height)
        else m.drawImage(image, -24, 13, 1488, 595)
        const pixels = m.getImageData(0, 0, width, height).data
        const add = (x: number, y: number, alpha: number, shade: number, radius: number, red = shade, green = shade, blue = shade) => {
          particles.push({ bx: x, by: y, x: 0, y: 0, vx: 0, vy: 0, radius, alpha, shade, red, green, blue, mix: 0, seed: Math.abs(Math.floor(x * 31 + y * 17)) % 4, spine: x, birth: 0 })
        }
        if (flower) {
          for (let y = .8; y < height; y += 1.5) for (let x = .8; x < width; x += 1.5) {
            const i = (Math.floor(y) * width + Math.floor(x)) * 4
            const alpha = pixels[i + 3] / 255
            if (alpha < .08) continue
            const shade = pixels[i] * .2126 + pixels[i + 1] * .7152 + pixels[i + 2] * .0722
            add(x, y, Math.min(1, alpha * 1.4), shade, .55)
          }
          // Trace the reference's stem from the root upward. Leaves and petals
          // unfurl from this local backbone after the growing stem reaches them.
          const bottom = Math.max(...particles.map(p => p.by))
          const top = Math.min(...particles.map(p => p.by))
          const roots = particles.filter(p => p.by > bottom - 7)
          let spineX = roots.reduce((sum, p) => sum + p.bx, 0) / Math.max(1, roots.length)
          const spine = new Float32Array(height)
          for (let y = height - 1; y >= 0; y--) {
            let nearest = spineX, nearestDistance = Infinity
            for (let x = 0; x < width; x++) {
              const i = (y * width + x) * 4
              if (pixels[i + 3] < 50 || pixels[i] > 237) continue
              const distance = Math.abs(x - spineX)
              if (distance < nearestDistance) { nearest = x; nearestDistance = distance }
            }
            if (nearestDistance < 8) spineX += (nearest - spineX) * .7
            spine[y] = spineX
          }
          for (const p of particles) {
            p.spine = spine[Math.floor(p.by)]
            const heightFraction = clamp((bottom - p.by) / Math.max(1, bottom - top))
            const branch = clamp(Math.abs(p.bx - p.spine) / Math.max(12, width * .25))
            p.birth = .035 + heightFraction * .64 + branch * .13
          }
        } else {
          // Connected components preserve the exact dot positions and changing
          // radii in the supplied background, rather than approximating its wave.
          const visited = new Uint8Array(width * height)
          for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
            const index = y * width + x
            if (visited[index] || pixels[index * 4 + 3] < 28) continue
            const queue = [index]
            visited[index] = 1
            let total = 0, cx = 0, cy = 0, opacity = 0, red = 0, green = 0, blue = 0
            for (let head = 0; head < queue.length; head++) {
              const n = queue[head], alpha = pixels[n * 4 + 3] / 255
              const px = n % width, py = Math.floor(n / width)
              total += alpha; cx += px * alpha; cy += py * alpha
              opacity = Math.max(opacity, alpha); red += pixels[n * 4] * alpha; green += pixels[n * 4 + 1] * alpha; blue += pixels[n * 4 + 2] * alpha
              for (const next of [px > 0 ? n - 1 : -1, px < width - 1 ? n + 1 : -1, py > 0 ? n - width : -1, py < height - 1 ? n + width : -1]) {
                if (next >= 0 && !visited[next] && pixels[next * 4 + 3] >= 28) { visited[next] = 1; queue.push(next) }
              }
            }
            if (total > .15) add(cx / total + .5, cy / total + .5, opacity * .4, red / total, Math.max(.38, Math.sqrt(total / Math.PI)), red / total, green / total, blue / total)
          }
        }
        particleCache.set(cacheKey, particles.map(p => ({ ...p })))
      }
      const raster = rasterCache.get(rasterKey(flower ? growthProgress().toFixed(4) : ''))
      if (raster) {
        ctx.drawImage(raster.canvas, 0, 0, width, height)
        flowTime = raster.flowTime
        Object.assign(canvas.dataset, raster.data)
      } else draw(performance.now())
      canvas.dataset.ready = 'true'
      if (!raster) rememberRaster()
      flowLast = 0; setReady(true); wake()
    }
    // Offscreen hero/flowers need no pixel sampling or first draw on a return.
    // Visible canvases prepare one static frame; their RAF loop waits until the
    // page transition ends so it cannot consume the opacity animation's budget.
    image.onload = () => { imageLoaded = true; initialize() }
    image.onerror = () => { if (!disposed) { canvas.dataset.ready = 'false'; canvas.dataset.failed = 'true'; setReady(false) } }
    if (cachedParticles) { imageLoaded = true; initialize() }
    return () => {
      rememberRaster()
      disposed = true; image.onload = null; image.onerror = null
      pause(); observer.disconnect()
      target.removeEventListener('pointermove', move); target.removeEventListener('pointerleave', reset)
      window.removeEventListener('blur', reset); document.removeEventListener('visibilitychange', hide); reduced.removeEventListener('change', reset)
      fine.removeEventListener('change', reset); compact.removeEventListener('change', reset)
      document.removeEventListener('portfolio:project-transition-end', wake)
      window.removeEventListener('scroll', wake); window.removeEventListener('resize', wake)
    }
  }, [variant, stage, eventTarget, theme, flowerTone])
  return <canvas ref={canvasRef} className={`figma-particles figma-particles-${variant}`} aria-hidden="true" data-ready={ready} data-flower-tone={variant === 'flower' ? flowerTone : undefined} />
}
