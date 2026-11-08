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
  </div>
}
