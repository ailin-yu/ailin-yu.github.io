import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'motion/react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { imageAsset } from '@/lib/media-images'
import { ProgressiveImage } from './ProgressiveImage'

// Shared media primitives; Data Agent keeps the supplied Figma placeholder geometry.
export function MediaSlot({ name, className = '' }: { name: string; className?: string }) {
  return <div className={`da-media-slot ${className}`} role="img" aria-label={`${name}，配图待补充`} data-media-slot={name} />
}

export function SectionTitle({ children }: { children: string }) {
  return <h2 className="da-section-title" lang="en">{children}<span aria-hidden="true">*</span></h2>
}

export function DesignTitle({ number, children }: { number: string; children: string }) {
  return <h3 className="da-design-title"><span lang="en">{number}</span>{children}</h3>
}

export function BulletTitle({ children }: { children: string }) {
  return <h4 className="da-bullet-title">{children}</h4>
}

export function ProjectVideo({ src, poster, label }: { src: string; poster?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const automaticPause = useRef(false)
  const reduced = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px), (pointer: coarse)')
  const autoplay = !reduced && !mobile
  const [loadedPoster, setLoadedPoster] = useState<{ source: string; url: string } | null>(null)
  const [failed, setFailed] = useState(false)
  const preview = poster ? imageAsset(poster)?.preview : undefined
  const visiblePoster = loadedPoster && loadedPoster.source === poster ? loadedPoster.url : preview || poster
  useEffect(() => {
    const video = ref.current
    if (!video) return
    let inView = false
    const sync = () => {
      if (!inView || document.hidden) {
        if (!video.paused) { automaticPause.current = true; video.pause() }
      } else if (autoplay && !video.ended && video.dataset.userPaused !== 'true') void video.play().catch(() => {})
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting && entry.intersectionRatio >= .15
      sync()
    }, { threshold: [0, .15] })
    observer.observe(video)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); automaticPause.current = true; video.pause() }
  }, [autoplay])
  return <div className="da-hero-video project-video-with-preview" data-video-failed={failed} data-project-entry-target><video ref={ref} src={src} poster={visiblePoster} aria-label={label} controls autoPlay={autoplay} muted playsInline preload={mobile || reduced ? 'none' : 'metadata'} onError={() => setFailed(true)} onPlaying={() => setFailed(false)} onPause={event => {
    const video = event.currentTarget
    if (automaticPause.current) automaticPause.current = false
    else if (!video.ended) video.dataset.userPaused = 'true'
  }} onPlay={event => { automaticPause.current = false; delete event.currentTarget.dataset.userPaused }} />
    {poster && <ProgressiveImage src={poster} alt="" aria-hidden="true" className="project-video-poster" eager onLoad={event => setLoadedPoster({ source: poster, url: event.currentTarget.currentSrc })} />}
    {failed && <button type="button" className="project-video-retry" onClick={() => {
      const video = ref.current
      if (!video) return
      setFailed(false); video.load(); void video.play().catch(() => setFailed(true))
    }}>播放视频</button>}
  </div>
}

