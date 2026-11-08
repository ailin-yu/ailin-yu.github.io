import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react'
import '@/styles/case-navigation.css'
import { getProjectCase, getProjectOutline } from '@/content/cases'
import { studentOutlines } from '@/content/student-projects'
import { developerOutlines } from '@/content/developer-projects'

type Item = { id: string; label: string; english?: string; children?: Item[] }
const outlines: Record<string, Item[]> = {
  ...studentOutlines,
  ...Object.fromEntries(Object.entries(developerOutlines).map(([key, items]) => [key, [{ id: 'main-content', label: '项目概览' }, ...items]])),
}

export function CaseFrame({ slug, children }: { slug: string; children: ReactNode }) {
  const shared = !!getProjectCase(slug)
  const items = getProjectOutline(slug) || outlines[slug] || [{ id: 'main-content', label: '项目概览' }]
  const sections = useMemo(() => items.flatMap(item => [item, ...item.children || []]), [items])
  const [active, setActive] = useState(items[0].id)
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(!shared)
  const outline = useRef<HTMLElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const panelId = useId()
  const cancelClose = () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current)
    closeTimer.current = null
  }
  const closeOutline = () => { cancelClose(); setOpen(false) }
  useEffect(() => cancelClose, [])
  useEffect(() => {
    closeOutline()
    const dismiss = (event: PointerEvent) => { if (event.target instanceof Node && !outline.current?.contains(event.target)) closeOutline() }
    document.addEventListener('pointerdown', dismiss)
    return () => document.removeEventListener('pointerdown', dismiss)
  }, [slug])
  useEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const lead = document.querySelector('.da-hero-video') || document.querySelector('.da-publication-header') || document.querySelector('.da-project-header')
      const show = !shared || !!lead && lead.getBoundingClientRect().bottom <= 64
      setVisible(show)
      if (!show) closeOutline()
      let current = items[0].id
      for (const item of sections) {
        const element = document.getElementById(item.id)
        if (element && element.getBoundingClientRect().top <= (shared ? 96 : 200)) current = item.id
      }
      setActive(current)
    }
    const queue = () => { if (!frame) frame = requestAnimationFrame(update) }
    update(); window.addEventListener('scroll', queue, { passive: true }); window.addEventListener('resize', queue)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', queue); window.removeEventListener('resize', queue) }
  }, [items, sections, slug, shared])
  const navigate = (id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    closeOutline()
    const heading = target.querySelector<HTMLElement>('h1,h2,h3') || target
    heading.setAttribute('tabindex', '-1')
    heading.focus({ preventScroll: true })
    const offset = shared ? 88 : matchMedia('(max-width:760px)').matches ? 86 : 108
    window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset), behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
  }
  const sectionLink = (item: Item) => <a href={`#${item.id}`} key={item.id} aria-current={active === item.id ? 'location' : undefined} data-child-active={item.children?.some(child => child.id === active) || undefined} onClick={event => { event.preventDefault(); navigate(item.id) }}><span>{item.label}</span>{item.english && <span className="case-outline-english" lang="en">{item.english}</span>}</a>
  return <div className={`case-layout${shared ? ' case-layout-figma' : ''}`}>
    {items.length > 1 && visible && <aside className="case-outline" ref={outline} data-open={open} onPointerEnter={event => { if (event.pointerType === 'mouse') { cancelClose(); setOpen(true) } }} onPointerLeave={event => {
      if (event.pointerType !== 'mouse') return
      cancelClose()
      closeTimer.current = setTimeout(() => { closeTimer.current = null; setOpen(false) }, 150)
    }} onFocusCapture={() => { cancelClose(); setOpen(true) }} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) closeOutline() }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); trigger.current?.focus(); closeOutline() } }}>
      <button ref={trigger} className="case-outline-trigger" aria-label={`项目目录，当前：${sections.find(item => item.id === active)?.label}`} aria-expanded={open} aria-controls={panelId} onClick={() => { cancelClose(); setOpen(true) }}>
        <span className="case-outline-ticks" aria-hidden="true">{items.map((item, index) => <span className="case-outline-mark" data-active={active === item.id || item.children?.some(child => child.id === active)} key={item.id}><i />{!shared && index < items.length - 1 && <><i /><i /></>}</span>)}</span>
      </button>
      <div id={panelId} className="case-outline-panel" aria-hidden={!open} inert={!open}><div className="case-outline-scroll">{!shared && <p>本页目录</p>}<nav aria-label="案例章节">{items.map(item => item.children ? <div className="case-outline-group" key={item.id}>{sectionLink(item)}<ul aria-label={`${item.label} 子章节`}>{item.children.map(child => <li key={child.id}>{sectionLink(child)}</li>)}</ul></div> : sectionLink(item))}</nav></div></div>
    </aside>}
    <div className="case-content">{children}</div>
  </div>
}
