import { useEffect, useRef, useState, type PointerEvent, type FocusEvent, type ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { ArrowUpRight, ChevronDown } from 'lucide-react'

export type FolderSheet = { id: string; label: string; alt: string; content: ReactNode }
type Props = {
  title: string; tab: string; caption?: string; className?: string; sheets: FolderSheet[]
  href?: string; onNavigate?: () => void
  onSelect?: (id: string, trigger: HTMLButtonElement) => void
}

/** Shared folder motion. Link mode opens a case; collection mode opens its individual items. */
export function FolderStack({ title, tab, caption, className = '', sheets, href, onNavigate, onSelect }: Props) {
  const reduced = useReducedMotion()
  const [hovered, setHovered] = useState(false), [focused, setFocused] = useState(false), [latched, setLatched] = useState(false)
  const [sheet, setSheet] = useState<number | null>(null)
  const root = useRef<HTMLDivElement>(null), cover = useRef<HTMLButtonElement>(null)
  const tiltX = useMotionValue(0), tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 220, damping: 26 }), rotateY = useSpring(tiltY, { stiffness: 220, damping: 26 })
  const open = hovered || focused || latched
  useEffect(() => {
    if (href) return
    const outside = (event: globalThis.PointerEvent) => { if (!root.current?.contains(event.target as Node)) { setLatched(false); setFocused(false) } }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [href])
  const spring = reduced ? { duration: 0 } : { type: 'spring' as const, stiffness: 250, damping: 24, mass: .85 }
  const point = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    tiltX.set(-((event.clientY - bounds.top) / bounds.height - .5) * 5)
    tiltY.set(((event.clientX - bounds.left) / bounds.width - .5) * 7)
  }
  const interactions = {
    onPointerEnter: (event: PointerEvent<HTMLElement>) => { if (event.pointerType === 'mouse') setHovered(true) },
    onPointerLeave: () => { setHovered(false); setSheet(null); tiltX.set(0); tiltY.set(0) }, onPointerMove: point,
    onFocus: () => setFocused(true),
    onBlur: (event: FocusEvent<HTMLElement>) => { if (!event.currentTarget.contains(event.relatedTarget)) { setFocused(false); setLatched(false) } },
    style: { rotateX, rotateY, transformPerspective: 1000 },
  }
  const contents = <><span className="home-folder-back" aria-hidden="true"><span /></span>{sheets.map((item, i) => {
    const position = { x: open ? (href ? [-31, 0, 31] : [-18, 0, 18])[i] : [-6, 0, 6][i], y: (open ? (href ? [-31, -53, -30] : [-10, -24, -8])[i] : [0, 8, 15][i]) - (open && sheet === i ? 12 : 0), rotate: open ? (href ? [-13, -1, 12] : [-9, -1, 9])[i] : [-5, 0, 5][i] }
    const content = <><span className="home-work-sheet-caption">{item.label}</span>{item.content}</>
    const props = { className: `home-work-sheet home-work-sheet-${i}`, onPointerEnter: () => setSheet(i), onPointerLeave: () => setSheet(null), animate: position, transition: spring }
    return href ? <motion.span {...props} key={item.id}>{content}</motion.span> : <motion.button {...props} type="button" key={item.id} aria-label={`查看照片：${item.alt}`} onClick={event => onSelect?.(item.id, event.currentTarget)}>{content}</motion.button>
  })}{href ? <motion.span className="home-work-pocket" animate={{ rotateX: open ? -24 : 0 }} transition={spring}><span className="home-work-tab" lang="en">{tab}</span><span className="home-work-pocket-label"><span>{title}</span><ArrowUpRight size={22} aria-hidden="true" /></span>{caption && <span className="home-work-pocket-caption">{caption}</span>}</motion.span> : <motion.button type="button" ref={cover} className="home-work-pocket" animate={{ rotateX: open ? -24 : 0 }} transition={spring} aria-expanded={open} aria-label="展开生活照片" onClick={() => { setLatched(value => !value); setFocused(false) }}><span className="home-work-tab" lang="en">{tab}</span><span className="home-work-pocket-label"><span lang="en">{title}</span><ChevronDown size={22} aria-hidden="true" /></span>{caption && <span className="home-work-pocket-caption">{caption}</span>}</motion.button>}</>
  return href ? <motion.a {...interactions} className={`home-work-folder ${open ? 'is-open' : ''} ${className}`} href={href} aria-label={`阅读${title}案例`} onClick={onNavigate} whileTap={reduced ? undefined : { scale: .985 }}>{contents}</motion.a> : <motion.div {...interactions} ref={root} role="group" aria-label="生活照片收藏夹" className={`home-work-folder ${open ? 'is-open' : ''} ${className}`} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setHovered(false); setLatched(false); cover.current?.focus(); setFocused(false) } }}>{contents}</motion.div>
}
