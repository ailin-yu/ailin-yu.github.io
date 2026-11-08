import { useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useTheme } from '@/components/portfolio/ThemeProvider'
import { observePlantScroll } from './observePlantScroll'

type DrawScene = (context: CanvasRenderingContext2D, progress: number, time: number) => void
const clamp = (x: number) => Math.max(0, Math.min(1, x))
const ease = (x: number) => 1 - Math.pow(1 - clamp(x), 3)

/** The small glyphs are decorative samples; the accessible label remains real text. */
function useAscii(draw: DrawScene, width: number, height: number, animate: boolean, loop: boolean, scrollStage?: number) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const reduced = useReducedMotion()
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    const source = document.createElement('canvas')
    source.width = width; source.height = height
    const mask = source.getContext('2d', { willReadFrequently: true })
    if (!context || !mask) return
    const dpr = Math.min(devicePixelRatio || 1, 2)
    canvas.width = width * dpr; canvas.height = height * dpr
    context.scale(dpr, dpr)
    const palette = getComputedStyle(canvas)
    const brand = palette.getPropertyValue('--brand').trim() || '#636AE7'
    const shadow = palette.getPropertyValue('--plant-shadow').trim() || brand
    const deepShadow = palette.getPropertyValue('--plant-deep-shadow').trim() || shadow
    let frame = 0, visible = false, start = 0, last = 0, completed = false
    const step = loop ? 1.8 : 2.35
    const render = (progress: number, time: number) => {
      mask.clearRect(0, 0, width, height)
      draw(mask, progress, time)
      const pixels = mask.getImageData(0, 0, width, height).data
      context.clearRect(0, 0, width, height)
      context.fillStyle = brand
      context.font = `500 ${step + .65}px "Menlo", "Consolas", monospace`
      context.textBaseline = 'middle'; context.textAlign = 'center'
      const glyphs = '.:;itLCG08@'
      for (let y = step / 2; y < height; y += step) {
        for (let x = step / 2; x < width; x += step) {
          const offset = (Math.floor(y) * width + Math.floor(x)) * 4
          const alpha = pixels[offset + 3] / 255
          if (alpha < .07) continue
          const value = pixels[offset] / 255
          const noise = (Math.sin(x * 13.3 + y * 3.1) + 1) * .5
          context.fillStyle = loop ? (value > .74 ? deepShadow : shadow) : value > .74 ? shadow : brand
          context.globalAlpha = alpha * (loop ? .52 + value * .48 : .32 + value * .68)
          context.fillText(glyphs[Math.min(glyphs.length - 1, Math.floor(value * 9 + noise * .6))], x, y)
        }
      }
      context.globalAlpha = 1
    }
    if (!loop && scrollStage !== undefined) {
      return observePlantScroll(canvas, progress => render(progress, 0), scrollStage, !!reduced)
    }
    const tick = (now: number) => {
      frame = 0
      if (!visible || document.hidden) return
      if (!start) start = now
      if (now - last > (loop ? 65 : 75)) {
        const progress = reduced || !animate || completed ? 1 : ease((now - start) / 2100)
        render(progress, reduced || !animate ? 0 : now / 1000)
        last = now
        if (progress >= 1 && !loop) completed = true
      }
      if ((loop && animate && !reduced) || (!completed && animate && !reduced)) frame = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!visible || document.hidden) return
      if (!animate || reduced || completed) render(1, 0)
      else if (!frame) frame = requestAnimationFrame(tick)
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) wake()
      else { cancelAnimationFrame(frame); frame = 0 }
    }, { rootMargin: '40px', threshold: .05 })
    observer.observe(canvas)
    const onVisibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0 }
      else wake()
    }
    document.addEventListener('visibilitychange', onVisibility)
    render(reduced || !animate ? 1 : 0, 0)
    return () => { observer.disconnect(); cancelAnimationFrame(frame); document.removeEventListener('visibilitychange', onVisibility) }
  }, [draw, width, height, animate, loop, reduced, scrollStage, theme])
  return ref
}

function leaf(context: CanvasRenderingContext2D, x: number, y: number, direction: number, size: number) {
  context.save(); context.translate(x, y); context.rotate(direction < 0 ? -.3 : .15)
  const endX = direction * size
  const shade = context.createLinearGradient(0, 0, endX, -size * .6)
  shade.addColorStop(0, '#f8f8f8'); shade.addColorStop(.5, '#8a8a8a'); shade.addColorStop(1, '#e0e0e0')
  context.fillStyle = shade; context.beginPath(); context.moveTo(0, 0)
  context.bezierCurveTo(endX * .2, -size * .7, endX * .7, -size * .6, endX, -size * .65)
  context.bezierCurveTo(endX * .9, -size * .05, endX * .4, size * .2, 0, 0)
  context.fill(); context.restore()
}
// The texture is the approved v10 front clay render, converted to ink density.
// Canvas deformation opens it; this does not claim a real-time 3D turn.
function blossom(context: CanvasRenderingContext2D, x: number, y: number, radius: number, opening: number, angle = 0, texture: HTMLImageElement | null = null) {
  context.save(); context.translate(x, y); context.rotate(angle)
  context.scale(.45 + opening * .55, .65 + opening * .35)
  if (texture) {
    context.drawImage(texture, -radius, -radius, radius * 2, radius * 2.1)
  } else {
    // A flower outline remains available if the local texture cannot load.
    context.fillStyle = '#999'; context.beginPath()
    for (let point = 0; point <= 120; point++) {
      const theta = point / 120 * Math.PI * 2 - Math.PI / 2
      const r = radius * (.8 + .2 * Math.cos(5 * (theta + Math.PI / 2)))
      const px = Math.cos(theta) * r, py = Math.sin(theta) * r
      if (!point) context.moveTo(px, py); else context.lineTo(px, py)
    }
    context.closePath(); context.fill()
  }
  context.restore()
}
function useFlowerRelief() {
  const [texture, setTexture] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    let active = true
    const image = new Image()
    image.onload = () => { if (active) setTexture(image) }
    image.src = '/home/ascii/platycodon-relief.png'
    return () => { active = false; image.onload = null }
  }, [])
  return texture
}
const plantScene = (stage: number, texture: HTMLImageElement | null): DrawScene => (context, progress) => {
  const growth = clamp(progress)
  const height = 48 + ([63, 112, 153, 185, 198][stage] - 48) * growth
  const base = 252, tipX = 106 + (stage > 1 ? 11 * growth : 0)
  context.save()
  context.lineCap = 'round'; context.strokeStyle = '#e8e8e8'; context.lineWidth = 3.1
  context.beginPath(); context.moveTo(109, base); context.bezierCurveTo(100, base - height * .4, 125, base - height * .68, tipX, base - height); context.stroke()
  leaf(context, 109, base - height * .32, -1, (stage === 0 ? 26 : 37) * (.72 + .28 * growth))
  leaf(context, 113, base - height * .51, 1, (stage === 0 ? 23 : 32) * (.72 + .28 * growth))
  if (stage > 1 && growth > .4) leaf(context, 115, base - height * .75, -1, 26 * ease((growth - .4) / .6))
  const opening = ease((progress - .55) / .45)
  if (stage === 1 && growth > .35) {
    const bud = ease((growth - .35) / .65)
    const budShade = context.createLinearGradient(tipX - 10, 0, tipX + 10, 0)
    budShade.addColorStop(0, '#555'); budShade.addColorStop(.5, '#999'); budShade.addColorStop(1, '#eee')
    context.fillStyle = budShade; context.beginPath(); context.ellipse(tipX, base - height - 5 * bud, 10 * bud, 17 * bud, -.08, 0, Math.PI * 2); context.fill()
    leaf(context, tipX, base - height + 7, -1, 10 * bud); leaf(context, tipX, base - height + 7, 1, 9 * bud)
  }
  if (stage > 1 && opening > .01) blossom(context, tipX, base - height, (stage === 2 ? 34 : 50) * opening, opening, .15, texture)
  if (stage === 4 && growth > .48) {
    const branch = ease((growth - .48) / .52)
    context.strokeStyle = '#c8c8c8'; context.lineWidth = 2.6
    context.beginPath(); context.moveTo(108, base - 70); context.bezierCurveTo(108 - 28 * branch, base - 70 - 28 * branch, 108 - 47 * branch, base - 70 - 61 * branch, 108 - 41 * branch, base - 70 - 83 * branch); context.stroke()
    leaf(context, 108 - 26 * branch, base - 70 - 44 * branch, -1, 25 * branch)
    if (opening > .01) blossom(context, 108 - 41 * branch, base - 70 - 83 * branch, 38 * opening, opening, -.3, texture)
    context.beginPath(); context.moveTo(111, base - 103); context.bezierCurveTo(111 + 44 * branch, base - 103 - 9 * branch, 111 + 52 * branch, base - 103 - 43 * branch, 111 + 53 * branch, base - 103 - 69 * branch); context.stroke()
    leaf(context, 111 + 42 * branch, base - 103 - 36 * branch, 1, 27 * branch)
    if (opening > .01) blossom(context, 111 + 53 * branch, base - 103 - 69 * branch, 35 * opening, opening, .35, texture)
  }
  context.restore()
}
export function AsciiPlant({ stage }: { stage: number }) {
  const texture = useFlowerRelief()
  const draw = useMemo(() => plantScene(stage, texture), [stage, texture])
  const ref = useAscii(draw, 220, 275, true, false, stage)
  return <canvas ref={ref} className="home-ascii-plant" role="img" aria-label={['字符小苗', '字符花苞', '初开的字符桔梗', '舒展的字符桔梗', '生长成丛的字符桔梗'][stage]} />
}

// Xuegao's actual portrait supplies his round face, large eyes and tabby markings.
// The body is a short-legged walking drawing; this remains a stylized 2D animation.
function useXuegaoPhoto() {
  const [photo, setPhoto] = useState<HTMLImageElement | null>(null)
  useEffect(() => {
    let active = true
    const image = new Image()
    image.onload = () => { if (active) setPhoto(image) }
    image.src = '/home/photos/xuegao.webp'
    return () => { active = false; image.onload = null }
  }, [])
  return photo
}
const catScene = (photo: HTMLImageElement | null): DrawScene => (context, _progress, time) => {
  const stride = time * 4.6, bob = Math.sin(stride * 2) * .5
  context.save(); context.translate(0, bob); context.lineCap = 'round'
  const leg = (hipX: number, far: boolean, phase: number) => {
    const swing = Math.sin(phase), lift = Math.max(0, Math.cos(phase))
    const footX = hipX + swing * 9, footY = 135 - lift * 4
    context.strokeStyle = far ? '#757575' : '#a2a2a2'; context.lineWidth = far ? 10 : 12
    context.beginPath(); context.moveTo(hipX, 102)
    context.quadraticCurveTo(hipX + swing * 4, 120 - lift * 2, footX, footY - 5)
    context.lineTo(footX + 6, footY - 4); context.stroke()
    context.strokeStyle = far ? '#a5a5a5' : '#e4e4e4'; context.lineWidth = 3
    context.beginPath(); context.moveTo(hipX - 4, 116); context.lineTo(hipX + 4, 117); context.stroke()
  }
  leg(89, true, stride + Math.PI); leg(174, true, stride + Math.PI * 1.5)
  // Broad, ringed tail rather than the thin generic-cat hook.
  const tail = new Path2D()
  tail.moveTo(72, 87); tail.bezierCurveTo(40, 84, 29, 48, 25, 30)
  context.strokeStyle = '#939393'; context.lineWidth = 12; context.stroke(tail)
  context.save(); context.lineWidth = 6
  for (const [x, y] of [[28, 42], [34, 57], [44, 72]]) {
    context.strokeStyle = '#e8e8e8'; context.beginPath(); context.moveTo(x - 4, y + 2); context.lineTo(x + 4, y - 2); context.stroke()
  }
  context.restore()
  const body = new Path2D()
  body.moveTo(62, 83); body.bezierCurveTo(62, 52, 92, 50, 126, 58)
  body.bezierCurveTo(154, 57, 179, 55, 187, 78)
  body.bezierCurveTo(194, 100, 177, 117, 145, 117)
  body.bezierCurveTo(120, 118, 82, 118, 70, 104); body.closePath()
  context.fillStyle = '#8d8d8d'; context.fill(body)
  context.save(); context.clip(body)
  if (photo) {
    context.filter = 'grayscale(1) invert(1) contrast(1.2)'
    context.drawImage(photo, 353, 447, 255, 287, 59, 50, 132, 77)
    context.filter = 'none'
  }
  context.strokeStyle = '#d9d9d9'; context.lineWidth = 5
  for (let i = 0; i < 5; i++) {
    context.beginPath(); context.moveTo(77 + i * 19, 58)
    context.quadraticCurveTo(91 + i * 18, 75, 76 + i * 19, 85); context.stroke()
  }
  context.restore()
  leg(87, false, stride); leg(173, false, stride + Math.PI * .5)
  // Low ears and wide cheeks frame the unaltered face sampled from the photo.
  context.fillStyle = '#b8b8b8'; context.beginPath()
  context.moveTo(163, 49); context.quadraticCurveTo(155, 30, 159, 22)
  context.quadraticCurveTo(171, 23, 178, 35)
  context.quadraticCurveTo(194, 29, 207, 35)
  context.quadraticCurveTo(217, 23, 226, 24)
  context.quadraticCurveTo(230, 34, 224, 49)
  context.bezierCurveTo(235, 66, 221, 89, 194, 91)
  context.bezierCurveTo(166, 93, 153, 73, 163, 49); context.fill()
  if (photo) {
    context.save(); context.beginPath(); context.ellipse(193, 59, 33, 29, 0, 0, Math.PI * 2); context.clip()
    context.filter = 'grayscale(1) invert(1) contrast(1.3)'
    context.drawImage(photo, 354, 273, 251, 190, 159, 30, 68, 58)
    context.restore()
  } else {
    // Photo-load fallback keeps the distinctive broad, round face and big eyes.
    context.fillStyle = '#ececec'
    for (const x of [179, 206]) { context.beginPath(); context.ellipse(x, 57, 7, 8, 0, 0, Math.PI * 2); context.fill() }
    context.fillStyle = '#676767'
    for (const x of [180, 207]) { context.beginPath(); context.arc(x, 56, 2, 0, Math.PI * 2); context.fill() }
    context.fillStyle = '#ddd'; context.beginPath(); context.moveTo(190, 68); context.lineTo(198, 68); context.lineTo(194, 73); context.fill()
  }
  context.strokeStyle = '#b1b1b1'; context.lineWidth = .9
  for (let i = 0; i < 3; i++) {
    context.beginPath(); context.moveTo(170, 72 + i * 3); context.lineTo(153, 67 + i * 7)
    context.moveTo(217, 72 + i * 3); context.lineTo(234, 67 + i * 7); context.stroke()
  }
  context.restore()
}
export function AsciiCat({ walking }: { walking: boolean }) {
  const photo = useXuegaoPhoto()
  const draw = useMemo(() => catScene(photo), [photo])
  const ref = useAscii(draw, 242, 145, walking, true)
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const area = ref.current?.parentElement?.parentElement
    if (!area) return
    let onScreen = false
    const update = () => setVisible(onScreen && !document.hidden)
    const observer = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; update() })
    observer.observe(area)
    document.addEventListener('visibilitychange', update)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', update) }
  }, [ref])
  return <div className={`home-ascii-cat ${!reduced ? 'is-walking' : ''}`} style={{ animationPlayState: walking && visible ? 'running' : 'paused' }}><canvas ref={ref} role="img" aria-label="圆脸虎斑猫雪糕的字符散步动画，脸部取自原照" /></div>
}
