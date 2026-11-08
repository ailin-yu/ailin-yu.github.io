import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import { createPortal } from 'react-dom'
import { LoopVideo } from './LoopVideo'
import { ProgressiveImage } from './ProgressiveImage'
import { imageAsset } from '@/lib/media-images'
import '@/styles/case-image-viewer.css'

type ImageProps = { src: string; alt: string; width?: number; height?: number; eager?: boolean; imageClassName?: string; fullResolution?: boolean }
type ZoomOrigin = { x: number; y: number; width: number; height: number; preview?: string }

/** The media itself expands, with no dialog surface, toolbar or corner icon. */
function ExpandedImage({ src, alt, width, height, origin, trigger, onClose }: ImageProps & { origin: ZoomOrigin; trigger: HTMLButtonElement; onClose: () => void }) {
  const root = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [closing, setClosing] = useState(false)
  const gap = innerWidth < 768 ? 16 : 40
  const ratio = Math.min((innerWidth - gap * 2) / (width || 1600), (innerHeight - gap * 2) / (height || 900), 1)
  const target = { width: (width || 1600) * ratio, height: (height || 900) * ratio }
  const left = (innerWidth - target.width) / 2, top = (innerHeight - target.height) / 2
  const transform = `translate(${origin.x + origin.width / 2 - innerWidth / 2}px,${origin.y + origin.height / 2 - innerHeight / 2}px) scale(${origin.width / target.width})`
  const style: CSSProperties = { left, top, ...target, transform: visible ? 'translate(0,0) scale(1)' : transform }
  const dismiss = useCallback(() => setClosing(true), [])

  useLayoutEffect(() => {
    const page = document.getElementById('root')
    const previousInert = page?.inert || false
    const overflow = document.documentElement.style.overflow
    const padding = document.body.style.paddingRight
    const visibility = trigger.style.visibility
    const readingPosition = { left: scrollX, top: scrollY }
    const openingHash = location.hash
    // Stop an unfinished chapter smooth-scroll before expanding its media.
    window.scrollTo({ ...readingPosition, behavior: 'instant' })
    const scrollbar = innerWidth - document.documentElement.clientWidth
    const video = trigger.querySelector('video')
    const wasPlaying = video && !video.paused
    if (video) video.pause()
    if (page) page.inert = true
    document.documentElement.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    trigger.style.visibility = 'hidden'
    root.current?.focus({ preventScroll: true })
    const frame = requestAnimationFrame(() => setVisible(true))
    const key = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); dismiss() } }
    document.addEventListener('keydown', key)
    window.addEventListener('resize', onClose)
    window.addEventListener('hashchange', onClose)
    return () => {
      cancelAnimationFrame(frame)
      document.removeEventListener('keydown', key)
      window.removeEventListener('resize', onClose)
      window.removeEventListener('hashchange', onClose)
      document.documentElement.style.overflow = overflow
      document.body.style.paddingRight = padding
      if (page) page.inert = previousInert
      trigger.style.visibility = visibility
      if (trigger.isConnected) {
        if (location.hash === openingHash) window.scrollTo({ ...readingPosition, behavior: 'instant' })
        trigger.focus({ preventScroll: true })
        if (wasPlaying && video && !document.hidden) void video.play().catch(() => {})
      }
    }
  }, [dismiss, onClose, trigger])

  useEffect(() => {
    if (!closing) return
    setVisible(false)
    const timer = window.setTimeout(onClose, matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240)
    return () => clearTimeout(timer)
  }, [closing, onClose])

  return createPortal(<div className="case-image-zoom" ref={root} role="region" aria-label={alt} tabIndex={-1} data-visible={visible}>
    <button type="button" className="case-image-zoom-dismiss" aria-label="缩小图片" onClick={dismiss} />
    <div className="case-image-zoom-media" style={style}>
      {src.endsWith('.mp4') ? <LoopVideo src={src} alt={alt} width={width} height={height} controls /> : <ProgressiveImage src={src} alt={alt} width={width} height={height} eager fullResolution previewSrc={origin.preview} draggable={false} />}
    </div>
  </div>, document.body)
}

export function ZoomableCaseImage(props: ImageProps) {
  const trigger = useRef<HTMLButtonElement>(null)
  const [origin, setOrigin] = useState<ZoomOrigin | null>(null)
  const close = useCallback(() => setOrigin(null), [])
  const asset = imageAsset(props.src)
  return <>
    <button ref={trigger} type="button" className="case-image-trigger" aria-label={`放大查看：${props.alt}`} aria-expanded={!!origin} onClick={() => {
      const element = trigger.current
      if (!element) return
      const box = element.getBoundingClientRect()
      const image = element.querySelector('img')
      setOrigin({ x: box.left, y: box.top, width: box.width, height: box.height, preview: image?.currentSrc })
    }}>
      {props.src.endsWith('.mp4') ? <LoopVideo {...props} className={props.imageClassName} /> : <ProgressiveImage src={props.src} alt={props.alt} width={props.width} height={props.height} className={props.imageClassName} eager={props.eager} fullResolution={props.fullResolution} />}
    </button>
    {origin && trigger.current && <ExpandedImage {...props} width={props.width || asset?.width} height={props.height || asset?.height} origin={origin} trigger={trigger.current} onClose={close} />}
  </>
}
