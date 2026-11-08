import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { rememberWorkPosition } from './WorkFolder'
import { warmCase } from '@/lib/case-modules'
import { caseHref, type PortfolioItem } from '@/content/portfolio-catalog'

export function ProductPreview({ project, poster, clip }: { project: PortfolioItem; poster?: string; clip?: string }) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(false), [requested, setRequested] = useState(false), [ready, setReady] = useState(false)
  const area = useRef<HTMLAnchorElement>(null), video = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const element = video.current
    if (!element) return
    if (active && !reduced) element.play().catch(() => setReady(false))
    else element.pause()
    return () => element.pause()
  }, [active, requested, reduced])
  useEffect(() => {
    if (!area.current) return
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) { video.current?.pause(); setActive(false) } })
    observer.observe(area.current)
    const hide = () => { if (document.hidden) { video.current?.pause(); setActive(false) } }
    document.addEventListener('visibilitychange', hide)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', hide) }
  }, [])
  const preview = () => { warmCase(project.kind); if (clip && !reduced) { setRequested(true); setActive(true) } }
  return <motion.article initial={reduced ? false : { opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .05 }} transition={{ duration: reduced ? 0 : .55, ease: [.16,1,.3,1] }} className={`home-product home-product-${project.slug}`}>
    <a className="home-product-preview" ref={area} href={caseHref(project.slug)} onClick={rememberWorkPosition} aria-label={`阅读${project.title}案例`} onPointerEnter={event => { if (event.pointerType === 'mouse') preview() }} onPointerLeave={() => setActive(false)} onFocus={preview} onBlur={() => setActive(false)}>
      {poster ? <img src={poster} alt={project.alt} style={{ objectFit: project.coverFit }} loading="lazy" width="1600" height="1000" /> : <div className="home-project-material-note"><span>{project.category}</span><strong>{project.title}</strong><small>项目资料整理中</small></div>}
      {requested && clip && <video ref={video} src={clip} poster={poster} muted playsInline loop preload="metadata" onLoadedData={() => setReady(true)} onPlaying={() => setReady(true)} className={ready && active ? 'is-playing' : ''} aria-hidden="true" />}
    </a>
    <div className="home-product-heading"><h3 lang={/[一-鿿]/.test(project.title) ? undefined : 'en'}><a href={caseHref(project.slug)} onClick={rememberWorkPosition} onFocus={() => warmCase(project.kind)} onPointerEnter={event => { if (event.pointerType === 'mouse') warmCase(project.kind) }}>{project.title}</a></h3><span>{project.category}{!project.role.includes('待') && ` · ${project.role}`}</span></div>
  </motion.article>
}
