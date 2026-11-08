import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { preloadProjectPoster } from '@/lib/project-entry-transition'
import { useMediaQuery } from '@/hooks/useMediaQuery'

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
  useEffect(() => {
    const video = ref.current
    if (!video) return
    preloadProjectPoster(video)
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
  return <div className="da-hero-video" data-project-entry-target><video ref={ref} src={src} poster={poster} aria-label={label} controls autoPlay={autoplay} muted playsInline preload={mobile || reduced ? 'none' : 'metadata'} onPause={event => {
    const video = event.currentTarget
    if (automaticPause.current) automaticPause.current = false
    else if (!video.ended) video.dataset.userPaused = 'true'
  }} onPlay={event => { automaticPause.current = false; delete event.currentTarget.dataset.userPaused }} /></div>
}

