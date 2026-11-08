import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react'
import { AnimatePresence, motion, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { CodeXml, PenTool, PencilSparkles, Wrench } from 'lucide-react'

const toolIcons = [CodeXml, Wrench, PenTool, PencilSparkles]
const toolNames = ['code-xml', 'wrench', 'pen-tool', 'pencil-sparkles']

// Original Figma 95:740 / Group 2147203581 outline, from the native SVG export.
const toolBubblePath = 'M327.071 341C335.316 341 342 347.716 342 356C342 364.284 335.316 371 327.071 371C324.386 371 321.866 370.287 319.689 369.04C318.603 368.418 318.06 368.107 317.621 368.069C317.181 368.031 316.703 368.205 315.746 368.552L314.372 369.051C312.137 369.862 311.019 370.267 310.571 369.718C310.122 369.168 310.743 368.154 311.985 366.126L312.69 364.974C313.233 364.088 313.504 363.645 313.552 363.198C313.601 362.752 313.391 362.148 312.972 360.941C312.435 359.394 312.143 357.731 312.143 356C312.143 347.716 318.827 341 327.071 341Z'

function ToolBubble() {
  const id = useId()
  const shape = `${id}-shape`, clip = `${id}-clip`, shadow = `${id}-shadow`
  return <svg className="figma-tool-orb" viewBox="309 341 33 30" aria-hidden="true">
    <defs>
      <path id={shape} d={toolBubblePath} />
      <clipPath id={clip}><use href={`#${shape}`} /></clipPath>
      <filter id={shadow} x="309" y="341" width="33" height="30" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
        <feOffset in="SourceAlpha" dy="3.333333" />
        <feGaussianBlur stdDeviation="1.666667" />
        <feComposite in="SourceAlpha" operator="out" result="inner" />
        <feFlood floodColor="var(--home-tool-inset)" />
        <feComposite in2="inner" operator="in" />
        <feComposite in2="SourceGraphic" operator="over" />
      </filter>
    </defs>
    <g filter={`url(#${shadow})`}>
      <use href={`#${shape}`} fill="var(--home-tool-surface)" />
      <use href={`#${shape}`} fill="none" stroke="var(--home-tool-inset)" strokeWidth="1.666667" clipPath={`url(#${clip})`} />
    </g>
  </svg>
}

export function RotatingTool({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null)
  const visible = useInView(ref)
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  useEffect(() => {
    if (reduced || !visible) return
    let timer = 0
    const update = () => {
      clearInterval(timer)
      if (!document.hidden) timer = window.setInterval(() => setIndex(value => (value + 1) % toolIcons.length), 2300)
    }
    update(); document.addEventListener('visibilitychange', update)
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', update) }
  }, [reduced, visible])
  const current = reduced ? 0 : index
  const Icon = toolIcons[current]
  return <span ref={ref} className={`figma-tool ${className}`} style={style} aria-hidden="true" data-tool={toolNames[current]}>
    <ToolBubble />
    <AnimatePresence initial={false}><motion.span key={current} className="figma-tool-glyph" initial={reduced ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0 : .36, ease: [.22, 1, .36, 1] }}><Icon strokeWidth={1.55} /></motion.span></AnimatePresence>
  </span>
}

/** The anchor keeps its original inline footprint. Only the photograph expands. */
export function HoverPortrait({ className = '', style }: { className?: string; style?: CSSProperties }) {
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [tapped, setTapped] = useState(false)
  const reduced = useReducedMotion()
  const x = useMotionValue(0), y = useMotionValue(0)
  const rotateX = useSpring(x, { stiffness: 220, damping: 23 })
  const rotateY = useSpring(y, { stiffness: 220, damping: 23 })
  const active = hovered || focused || tapped
  return <button type="button" className={`figma-portrait ${className}`} style={style} aria-label="放大艾琳的照片" aria-pressed={active} data-expanded={active}
    onPointerEnter={event => { if (event.pointerType !== 'touch') setHovered(true) }}
    onPointerMove={event => {
      if (reduced || event.pointerType === 'touch') return
      const box = event.currentTarget.getBoundingClientRect()
      const px = Math.max(-1, Math.min(1, (event.clientX - box.left) / box.width * 2 - 1))
      const py = Math.max(-1, Math.min(1, (event.clientY - box.top) / box.height * 2 - 1))
      x.set(-py * 7); y.set(px * 9)
    }}
    onPointerLeave={() => { setHovered(false); x.set(0); y.set(0) }}
    onFocus={event => setFocused(event.currentTarget.matches(':focus-visible'))} onBlur={() => { setFocused(false); setTapped(false) }}
    onClick={event => { if (event.detail > 0 && matchMedia('(pointer: coarse)').matches) { setFocused(false); setTapped(value => !value) } }}>
    <motion.span className="figma-portrait-tilt" style={{ rotateX, rotateY, transformPerspective: 600 }}>
      <motion.img src="/home/figma/portrait-detail.webp" alt="艾琳" width="48" height="48" draggable={false} animate={{ scale: active ? 4 : 1, rotate: active && !reduced ? -3 : 0 }} transition={reduced ? { duration: 0 } : { type: 'spring', stiffness: 285, damping: 23, mass: .7 }} />
    </motion.span>
  </button>
}

const decryptAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#%&<>_'

/** React Bits / Spark-style scrambling: reserve the original word's width.
 * The original label stays accessible and the temporary glyphs are visual only.
 */
function useDecryptedText(text: string) {
  const [display, setDisplay] = useState(text)
  const frame = useRef(0)
  const reduced = useReducedMotion()
  const start = useCallback(() => {
    if (reduced) return
    cancelAnimationFrame(frame.current)
    const startTime = performance.now()
    let last = -Infinity
    const tick = (now: number) => {
      const elapsed = now - startTime
      if (elapsed >= (text.length + 3) * 38) { setDisplay(text); frame.current = 0; return }
      if (now - last >= 34) {
        const revealed = Math.max(0, Math.floor(elapsed / 38) - 2)
        setDisplay([...text].map((letter, i) => letter === ' ' || i < revealed ? letter : decryptAlphabet[Math.floor(Math.random() * decryptAlphabet.length)]).join(''))
        last = now
      }
      frame.current = requestAnimationFrame(tick)
    }
    frame.current = requestAnimationFrame(tick)
  }, [reduced, text])
  useEffect(() => () => cancelAnimationFrame(frame.current), [])
  useEffect(() => { if (reduced) { cancelAnimationFrame(frame.current); setDisplay(text) } }, [reduced, text])
  return { display, start }
}

/** A navigation label uses the exact same decoder without changing link semantics. */
export function DecryptedLabel({ text }: { text: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const { display, start } = useDecryptedText(text)
  useEffect(() => {
    const control = ref.current?.parentElement
    if (!control) return
    const enter = (event: PointerEvent) => { if (event.pointerType !== 'touch') start() }
    control.addEventListener('pointerenter', enter)
    control.addEventListener('focus', start)
    return () => { control.removeEventListener('pointerenter', enter); control.removeEventListener('focus', start) }
  }, [start])
  return <span ref={ref} className="figma-decrypted-label" data-decoding={display !== text}><span className="sr-only">{text}</span><span className="figma-nav-reserve" aria-hidden="true">{text}</span><span className="figma-nav-display" aria-hidden="true">{display}</span></span>
}

export function DecryptedChip({ text, vector = false, className = '', style }: { text: string; vector?: boolean; className?: string; style?: CSSProperties }) {
  const { display, start } = useDecryptedText(text)
  const width = text === 'Agent' ? 92 : 138
  return <button type="button" className={`figma-decrypted ${vector ? 'figma-decrypted-vector' : 'figma-inline-chip hero-latin'} ${className}`} style={style} onPointerEnter={event => { if (event.pointerType !== 'touch') start() }} onFocus={start} onClick={start} aria-label={text} data-decoding={display !== text}>
    {vector ? <svg viewBox={`0 0 ${width} 43`} aria-hidden="true"><text className="hero-latin" x="8" y="29.769" xmlSpace="preserve">{display}</text></svg> : <><span className="figma-decrypt-reserve" aria-hidden="true">{text}</span><span className="figma-decrypt-display" aria-hidden="true">{display}</span></>}
  </button>
}
