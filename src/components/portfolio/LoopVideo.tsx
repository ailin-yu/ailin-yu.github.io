import { useEffect, useRef, useState, type RefObject } from 'react'
import { ProgressiveImage } from './ProgressiveImage'
import { imageAsset } from '@/lib/media-images'

/** Prepare the still before arrival; only visible clips request video bytes. */
export function LoopVideo({ src, alt, width, height, className, onSize, controls = false, videoRef }: {
  src: string; alt: string; width?: number; height?: number; className?: string; controls?: boolean
  onSize?: (width: number, height: number) => void
  videoRef?: RefObject<HTMLVideoElement | null>
}) {
  const internalRef = useRef<HTMLVideoElement>(null)
  const ref = videoRef || internalRef
  const [playingSrc, setPlayingSrc] = useState('')
  const poster = src.replace(/\.mp4$/, '-poster.webp')
  const [loadedPoster, setLoadedPoster] = useState<{ source: string; url: string } | null>(null)
  const visiblePoster = loadedPoster && loadedPoster.source === poster ? loadedPoster.url : imageAsset(poster)?.preview
  useEffect(() => {
    const video = ref.current
    if (!video) return
    let visible = false
    const sync = () => {
      if (!visible || document.hidden) { video.pause(); return }
      if (!video.getAttribute('src')) video.src = src
      // Low Power Mode can reject autoplay. The real still stays visible.
      void video.play().catch(() => {})
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(video)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause(); video.removeAttribute('src'); video.load() }
  }, [src, ref])
  return <span className={`loop-video ${className || ''}`} style={{ aspectRatio: `${width || 16} / ${height || 9}` }} data-video-ready={playingSrc === src}>
    <ProgressiveImage src={poster} alt={alt} width={width} height={height} eager={controls} onLoad={event => setLoadedPoster({ source: poster, url: event.currentTarget.currentSrc })} />
    <video ref={ref} width={width} height={height} poster={visiblePoster} aria-label={alt} controls={controls} muted loop playsInline preload="none" disablePictureInPicture
      onPlaying={() => setPlayingSrc(src)} onError={() => setPlayingSrc('')}
      onLoadedMetadata={event => onSize?.(event.currentTarget.videoWidth, event.currentTarget.videoHeight)} />
  </span>
}
