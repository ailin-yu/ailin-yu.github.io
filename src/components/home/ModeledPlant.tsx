import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { modeledGrowthStages } from '@/content/modeled-growth'
import { observePlantScroll } from './observePlantScroll'
import '@/styles/modeled-plant.css'

// Only nearby scroll frames are decoded; the complete sequence is never preloaded.
const frameCache = new Map<string, Promise<HTMLImageElement>>()
const cacheLimit = 36
let mountedPlants = 0
function frameUrl(stage: number, frame: number) {
  return `/flowers/modeled-growth/phase-${stage}/f-${String(frame).padStart(4, '0')}.webp`
}
function loadFrame(url: string) {
  const cached = frameCache.get(url)
  if (cached) {
    frameCache.delete(url); frameCache.set(url, cached)
    return cached
  }
  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image()
    image.decoding = 'async'
    image.onload = () => resolve(image)
    image.onerror = () => { frameCache.delete(url); reject(new Error('Plant frame unavailable')) }
    image.src = url
  })
  frameCache.set(url, promise)
  while (frameCache.size > cacheLimit) frameCache.delete(frameCache.keys().next().value!)
  return promise
}

/** Exact native model poses: scroll selects rendered geometry, never a scaled flower cutout. */
export function ModeledPlant({ stage }: { stage: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduced = useReducedMotion()
  const phase = modeledGrowthStages[stage]
  useEffect(() => {
    mountedPlants++
    return () => { if (--mountedPlants === 0) frameCache.clear() }
  }, [])
  useEffect(() => {
    const canvas = ref.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return
    const wrapper = canvas.parentElement
    canvas.dataset.ready = 'false'
    wrapper?.removeAttribute('data-ready')
    if (reduced) {
      context.clearRect(0, 0, 480, 600)
      delete canvas.dataset.modelFrame
      canvas.dataset.targetFrame = String(phase.last)
      return observePlantScroll(canvas, () => {}, stage, true)
    }
    let disposed = false, request = 0, painted = -1
    const render = (progress: number) => {
      const bounds = canvas.getBoundingClientRect()
      if (bounds.top > window.innerHeight + 160 || bounds.bottom < -160 || document.hidden) return
      const frame = Math.round(phase.first + (phase.last - phase.first) * progress)
      const ticket = ++request
      canvas.dataset.targetFrame = String(frame)
      if (frame === painted) return
      loadFrame(frameUrl(stage, frame)).then(image => {
        if (disposed || ticket !== request || document.hidden) return
        context.clearRect(0, 0, 480, 600)
        context.drawImage(image, 0, 0, 480, 600)
        painted = frame
        canvas.dataset.modelFrame = String(frame)
        canvas.dataset.ready = 'true'
        wrapper?.setAttribute('data-ready', 'true')
      }).catch(() => { /* The real model poster remains visible on a load failure. */ })
      if (!reduced) {
        for (const nearby of [frame - 1, frame + 1]) {
          if (nearby >= phase.first && nearby <= phase.last) void loadFrame(frameUrl(stage, nearby)).catch(() => {})
        }
      }
    }
    const stop = observePlantScroll(canvas, render, stage, !!reduced)
    return () => { disposed = true; request++; stop(); canvas.dataset.ready = 'false'; wrapper?.removeAttribute('data-ready') }
  }, [stage, reduced, phase])
  return <div className="home-modeled-plant" role="img" aria-label={`桔梗${phase.label}`} data-stage={stage} data-reduced={!!reduced}>
    <img src={frameUrl(stage, reduced ? phase.last : phase.first)} width={480} height={600} alt="" aria-hidden="true" loading="lazy" decoding="async" />
    <canvas ref={ref} width={480} height={600} aria-hidden="true" data-stage={stage} />
  </div>
}
