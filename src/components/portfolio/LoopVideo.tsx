import { useEffect, useRef } from 'react'

/** GIF replacement: fetch only when visible, pause offscreen and in background tabs. */
export function LoopVideo({ src, alt, width, height, className, onSize }: {
  src: string; alt: string; width?: number; height?: number; className?: string
  onSize?: (width: number, height: number) => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    let visible = false
    const sync = () => {
      if (!visible || document.hidden) { video.pause(); return }
      if (!video.getAttribute('src')) {
        video.poster = src.replace(/\.mp4$/, '-poster.webp')
        video.src = src
      }
      void video.play().catch(() => {})
    }
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync() })
    observer.observe(video)
    document.addEventListener('visibilitychange', sync)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); video.pause(); video.removeAttribute('src'); video.load() }
  }, [src])
  return <video ref={ref} className={className} width={width} height={height} aria-label={alt} muted loop playsInline preload="none" disablePictureInPicture onLoadedMetadata={event => onSize?.(event.currentTarget.videoWidth, event.currentTarget.videoHeight)} />
}
