import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { warmCase } from '@/lib/case-modules'
import { portfolioItems, caseHref } from '@/content/portfolio-catalog'
import { homeDesignProjects } from '@/content/home-design'

export function WorkMenu({ currentSlug, variant = 'default' }: { currentSlug?: string; variant?: 'default' | 'breadcrumb' }) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reduced = useReducedMotion()
  const panelId = useId()
  const compact = variant === 'breadcrumb'
  const currentTitle = homeDesignProjects.find(item => item.slug === currentSlug)?.title
  const cancelClose = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  useEffect(() => cancelClose, [])
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [])
  useEffect(() => { setOpen(false) }, [currentSlug])
  if (!currentSlug) return <a href="#works" onClick={() => sessionStorage.removeItem('portfolio-home-return')}>作品</a>
  return <div className={`work-menu${compact ? ' work-menu-breadcrumb' : ''}`} data-open={open} ref={root} onPointerEnter={event => { if (event.pointerType === 'mouse') { cancelClose(); setOpen(true) } }} onPointerLeave={event => {
    if (event.pointerType !== 'mouse') return
    cancelClose()
    closeTimer.current = setTimeout(() => { closeTimer.current = null; setOpen(false) }, 150)
  }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }} onKeyDown={event => {
      if (event.key === 'Escape') { event.preventDefault(); setOpen(false); trigger.current?.focus() }
      if (event.key === 'ArrowDown' && event.target === trigger.current) { event.preventDefault(); setOpen(true); requestAnimationFrame(() => root.current?.querySelector<HTMLAnchorElement>('a')?.focus()) }
    }}>
    <button className="work-menu-trigger" ref={trigger} aria-label={compact ? `切换 Work 项目，当前 ${currentTitle}` : undefined} aria-expanded={open} aria-controls={panelId} onClick={event => {
      if (event.detail > 0 && matchMedia('(hover: hover)').matches) setOpen(true)
      else setOpen(value => !value)
    }}>{compact ? currentTitle : '作品'}{!compact && <ChevronDown size={13} aria-hidden="true" />}</button>
    <AnimatePresence>{open && <motion.div id={panelId} className="work-menu-panel" initial={reduced ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }} transition={{ duration: reduced ? 0 : .16 }}>
      <nav aria-label="切换作品">{compact ? homeDesignProjects.map((item, index) => <a key={item.slug} href={caseHref(item.slug)} onPointerDown={() => item.kind && warmCase(item.kind, item.slug)} onFocus={() => { if (item.kind) warmCase(item.kind, item.slug) }} onPointerEnter={event => { if (event.pointerType === 'mouse' && item.kind) warmCase(item.kind, item.slug) }} aria-current={currentSlug === item.slug ? 'page' : undefined} onClick={() => setOpen(false)}><span className="work-menu-number" data-number={index + 1} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span><span className="work-menu-copy"><span className="work-menu-title"><strong>{item.title}</strong>{currentSlug !== item.slug && <ArrowUpRight className="work-menu-project-link" size={14} aria-hidden="true" />}</span><small>{item.menuDescription}</small></span></a>) : [{ id: 'work', title: '工作项目' }, { id: 'research', title: '研究' }, { id: 'student', title: '学生作品' }].map(group => <div key={group.id}>{portfolioItems.some(item => item.group === group.id) && <p>{group.title}</p>}{portfolioItems.filter(item => item.group === group.id).map(item => <a key={item.slug} href={caseHref(item.slug)} onPointerDown={() => item.kind && warmCase(item.kind, item.slug)} onFocus={() => warmCase(item.kind, item.slug)} onPointerEnter={event => { if (event.pointerType === 'mouse') warmCase(item.kind, item.slug) }} aria-current={currentSlug === item.slug ? 'page' : undefined} onClick={() => setOpen(false)}><span><strong>{item.title}</strong><small>{item.category}{!item.role.includes('待') && ` · ${item.role}`}</small></span>{currentSlug === item.slug ? <span className="work-menu-current">当前</span> : <ArrowUpRight size={16} aria-hidden="true" />}</a>)}</div>)}</nav>
      <a className="work-menu-all" href="#works" onClick={() => { setOpen(false); sessionStorage.removeItem('portfolio-home-return') }}><span>全部作品</span><ArrowUpRight size={15} aria-hidden="true" /></a>
    </motion.div>}</AnimatePresence>
  </div>
}
