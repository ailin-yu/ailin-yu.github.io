import { useEffect, useRef, useState } from 'react'
import type { HomeWorkCover } from '@/content/home-design'

export function WorkCover({ cover, title }: { cover: HomeWorkCover | null; title: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [nearby, setNearby] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '200px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return <div ref={ref} className="figma-card-cover" data-work-layered={!!cover?.background}>
    {cover?.background && <img className="figma-work-background" data-work-layer="background" src={nearby ? `/home/work/${cover.background.src}` : undefined} width={cover.background.width} height={cover.background.height} alt="" aria-hidden="true" loading="lazy" decoding="async" />}
    {cover?.src && <img className={cover.background ? 'figma-work-foreground' : 'figma-work-flat'} data-work-layer="foreground" data-work-foreground={cover.background ? '' : undefined} src={nearby ? `/home/work/${cover.src}` : undefined} width={cover.width} height={cover.height} style={cover.position ? { objectPosition: cover.position } : undefined} alt={`${title}，项目配图`} loading="lazy" decoding="async" />}
    {/* Figma 117:1563 / 227:6162, positioned within the 372 × 400 cover. */}
    {cover?.overlay && <img className="figma-work-overlay" data-work-layer="overlay" src={nearby ? `/home/work/${cover.overlay.src}` : undefined} width={cover.overlay.width} height={cover.overlay.height} style={{ left: `${cover.overlay.placement.x / 372 * 100}%`, top: `${cover.overlay.placement.y / 400 * 100}%`, width: `${cover.overlay.placement.width / 372 * 100}%` }} alt="" aria-hidden="true" draggable={false} loading="lazy" decoding="async" />}
  </div>
}
