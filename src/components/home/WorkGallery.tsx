import { useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { useReducedMotion } from 'motion/react'
import { portfolioItems, caseHref } from '@/content/portfolio-catalog'
import { warmCase } from '@/lib/case-modules'
import { rememberWorkPosition } from './WorkFolder'
import { ProductPreview } from './ProductPreview'
import { beginProjectEntry } from '@/lib/project-entry-transition'

type Filter = 'all' | 'work' | 'research' | 'student'

export function WorkGallery() {
  const [filter, setFilter] = useState<Filter>(() => {
    const saved = sessionStorage.getItem('portfolio-work-filter')
    return saved === 'all' || saved === 'research' || saved === 'student' ? saved : 'work'
  })
  const selected = portfolioItems.filter(item => filter === 'all' || item.group === filter)
  const visible = selected.filter(item => item.cover)
  const pending = selected.filter(item => !item.cover)
  const filters = [{ id: 'all', label: '全部', count: portfolioItems.filter(item => item.cover).length }, { id: 'work', label: '工作', count: portfolioItems.filter(item => item.group === 'work' && item.cover).length }, { id: 'research', label: '研究', count: portfolioItems.filter(item => item.group === 'research' && item.cover).length }, { id: 'student', label: '学生作品', count: portfolioItems.filter(item => item.group === 'student' && item.cover).length }]
  const reduced = useReducedMotion()
  const rail = useRef<HTMLDivElement>(null)
  const stopRail = useRef<(() => void) | null>(null)
  const [edges, setEdges] = useState({ start: true, end: false })
  useEffect(() => {
    const element = rail.current
    if (!element) return
    let frame = 0, last = 0
    let target = 0
    const stop = () => { cancelAnimationFrame(frame); frame = 0; last = 0; target = element.scrollLeft; element.dataset.moving = 'false' }
    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 16.667, 2) : 1
      last = now
      const distance = target - element.scrollLeft
      if (Math.abs(distance) <= 1) { element.scrollLeft = target; stop(); return }
      const previous = element.scrollLeft
      element.scrollLeft += distance * (1 - Math.pow(.78, dt))
      // Native scrolling can quantize subpixel assignments; never spin at rest.
      if (element.scrollLeft === previous && Math.abs(distance) < 4) { element.scrollLeft = target; stop(); return }
      frame = requestAnimationFrame(tick)
    }
    stopRail.current = stop
    const key = `portfolio-gallery-${filter}`
    element.scrollLeft = Number(sessionStorage.getItem(key) || 0)
    target = element.scrollLeft
    element.dataset.moving = 'false'
    const update = () => {
      if (!frame) target = element.scrollLeft
      setEdges({ start: element.scrollLeft <= 2, end: element.scrollLeft >= element.scrollWidth - element.clientWidth - 2 })
      sessionStorage.setItem(key, String(element.scrollLeft))
    }
    const wheel = (event: WheelEvent) => {
      if (event.ctrlKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) { stop(); return }
      const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? element.clientWidth : 1)
      const maximum = element.scrollWidth - element.clientWidth
      if ((delta > 0 && element.scrollLeft >= maximum - 1) || (delta < 0 && element.scrollLeft <= 1) || maximum <= 1) return
      event.preventDefault()
      target = Math.max(0, Math.min(maximum, (frame ? target : element.scrollLeft) + delta))
      if (reduced) element.scrollLeft = target
      else if (!frame) { element.dataset.moving = 'true'; frame = requestAnimationFrame(tick) }
    }
    const hide = () => { if (document.hidden) stop() }
    document.addEventListener('visibilitychange', hide)
    const offscreen = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop() })
    offscreen.observe(element)
    const observer = new ResizeObserver(update)
    observer.observe(element)
    element.addEventListener('scroll', update, { passive: true })
    element.addEventListener('wheel', wheel, { passive: false })
    update()
    return () => { stop(); stopRail.current = null; offscreen.disconnect(); observer.disconnect(); document.removeEventListener('visibilitychange', hide); element.removeEventListener('scroll', update); element.removeEventListener('wheel', wheel) }
  }, [filter, reduced])
  const move = (direction: number) => {
    stopRail.current?.()
    const element = rail.current
    const card = element?.querySelector<HTMLElement>('.home-product')
    if (element && card) element.scrollBy({ left: direction * (card.offsetWidth + (parseFloat(getComputedStyle(element).columnGap) || 0)), behavior: reduced ? 'instant' : 'smooth' })
  }
  const choose = (value: Filter) => { setFilter(value); sessionStorage.setItem('portfolio-work-filter', value) }
  return <section className="home-work" aria-labelledby="home-work-title" onClickCapture={event => {
    if (reduced || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const target = event.target instanceof Element ? event.target : null
    const link = target?.closest<HTMLAnchorElement>('a[href^="#/projects/"]')
    const preview = link?.closest('.home-product')?.querySelector<HTMLElement>('.home-product-preview')
    if (!link || !preview || link.target === '_blank' || link.hasAttribute('download')) return
    stopRail.current?.()
    if (!beginProjectEntry(preview, link.hash)) return
    event.preventDefault()
    rememberWorkPosition()
    window.location.hash = link.hash
  }}>
    <div className="home-gallery-toolbar home-shell" id="works"><h2 id="home-work-title">近期工作</h2>
      <div className="home-work-filters" role="group" aria-label="作品类型">{filters.filter(item => item.count > 0).map(item => <button key={item.id} aria-pressed={filter === item.id} onClick={() => choose(item.id as Filter)}><span>{item.label}</span><span className="home-filter-count">{item.count}</span></button>)}</div>
      <div className="home-gallery-controls"><button type="button" aria-label="向前浏览作品" disabled={edges.start} onClick={() => move(-1)}><ArrowLeft size={20} aria-hidden="true" /></button><button type="button" aria-label="向后浏览作品" disabled={edges.end} onClick={() => move(1)}><ArrowRight size={20} aria-hidden="true" /></button></div>
    </div>
    <p className="professional-work-intro home-shell">从真实任务中的问题，到产品形态、协作方式与实现规则。</p>
    <div className="home-product-list" ref={rail} role="region" aria-label="横向作品画廊" tabIndex={0} onPointerDown={() => stopRail.current?.()} onFocusCapture={() => stopRail.current?.()} onKeyDown={event => {
      if (event.target !== event.currentTarget) return
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); stopRail.current?.(); rail.current?.scrollTo({ left: event.key === 'Home' ? 0 : rail.current.scrollWidth, behavior: reduced ? 'instant' : 'smooth' }) }
    }}>
      {visible.map(project => <ProductPreview key={project.slug} project={project} poster={project.cover} clip={project.preview} />)}
    </div>
    {!!pending.length && <div className="home-pending-links home-shell" role="group" aria-label="待补资料的项目"><span>资料待补</span>{pending.map(project => <a key={project.slug} href={caseHref(project.slug)} onClick={rememberWorkPosition} onFocus={() => warmCase(project.kind)} onPointerEnter={event => { if (event.pointerType === 'mouse') warmCase(project.kind) }}>{project.title}<ArrowUpRight size={14} aria-hidden="true" /></a>)}</div>}
    <p className="home-work-result sr-only" role="status">显示 {visible.length} 项{filter === 'work' ? '工作项目' : filter === 'research' ? '研究' : filter === 'student' ? '学生作品' : '作品'}{pending.length ? `，另有 ${pending.length} 项资料状态入口` : ''}</p>
  </section>
}
