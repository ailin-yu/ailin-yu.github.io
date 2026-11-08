import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'

// The native growth render is divided into five short intervals of the same plant.
const boundaries = [0, 25 / 12, 58 / 12, 75 / 12, 95 / 12, 9.96]

export function GrowthStage({ index, fallback }: { index: number; fallback: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const video = useRef<HTMLVideoElement>(null)
  const reduced = useReducedMotion()
  const [desktop, setDesktop] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [imageFailed, setImageFailed] = useState(false)
  useEffect(() => {
    const media = matchMedia('(min-width: 651px) and (pointer: fine)')
    const update = () => setDesktop(media.matches)
    update(); media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])
  const enabled = desktop && !reduced
  useEffect(() => {
    const element = video.current, wrapper = ref.current
    if (!enabled || !element || !wrapper) { setPlaying(false); return }
    let started = false, timer = 0, disposed = false, visible = false
    const stop = () => {
      if (element.currentTime >= boundaries[index + 1] || disposed) {
        element.pause()
        if (!disposed && element.currentTime > boundaries[index + 1]) element.currentTime = boundaries[index + 1]
      }
    }
    const run = () => {
      if (disposed || !visible) return
      element.currentTime = boundaries[index]
      element.playbackRate = 1.25
      element.play().then(() => { if (!disposed) setPlaying(true) }).catch(() => { if (!disposed) setPlaying(false) })
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (entry.isIntersecting && !started) {
        started = true
        timer = window.setTimeout(() => { if (element.readyState >= 1) run(); else { element.addEventListener('loadedmetadata', run, { once: true }); element.load() } }, index * 320)
      } else if (!entry.isIntersecting && started) { clearTimeout(timer); element.pause(); setPlaying(false) }
    }, { threshold: .35 })
    observer.observe(wrapper)
    element.addEventListener('timeupdate', stop)
    const hidden = () => { if (document.hidden) element.pause() }
    document.addEventListener('visibilitychange', hidden)
    return () => { disposed = true; clearTimeout(timer); observer.disconnect(); element.pause(); element.removeEventListener('loadedmetadata', run); element.removeEventListener('timeupdate', stop); document.removeEventListener('visibilitychange', hidden) }
  }, [enabled, index])
  return <div ref={ref} className={`growth-image ${playing && enabled ? 'growth-video-active' : ''}`} aria-hidden="true"><img src={imageFailed ? `/flowers/${fallback}.png` : `/flowers/stage-${index}.png`} onError={() => setImageFailed(true)} alt="" loading="lazy" width="400" height="500" />{enabled && <video ref={video} src="/flowers/growth.mp4" muted playsInline preload="none" tabIndex={-1} />}</div>
}
