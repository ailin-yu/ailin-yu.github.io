import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Expand, Minus, Plus, X, ZoomIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import '@/styles/case-image-viewer.css'
import { LoopVideo } from './LoopVideo'
import { ProgressiveImage } from './ProgressiveImage'

type ImageProps = { src: string; alt: string; width?: number; height?: number; eager?: boolean; imageClassName?: string; fullResolution?: boolean }

function ImageViewer({ src, alt, width, height }: ImageProps) {
  const viewport = useRef<HTMLDivElement>(null)
  const drag = useRef<{ x: number; y: number; left: number; top: number } | null>(null)
  const [zoom, setZoom] = useState(1)
  const [fit, setFit] = useState({ width: 0, height: 0 })
  const [dragging, setDragging] = useState(false)
  const [intrinsic, setIntrinsic] = useState({ width: width || 1, height: height || 1 })

  useEffect(() => {
    const element = viewport.current
    if (!element) return
    const observer = new ResizeObserver(() => {
      const scale = Math.min(element.clientWidth / intrinsic.width, element.clientHeight / intrinsic.height, 1)
      setFit({ width: intrinsic.width * scale, height: intrinsic.height * scale })
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [intrinsic])

  // Zoom controls keep the current view's center; opening starts with the whole board.
  const previousSize = useRef({ width: 0, height: 0 })
  useLayoutEffect(() => {
    const element = viewport.current
    if (!element) return
    const old = previousSize.current
    const next = { width: fit.width * zoom, height: fit.height * zoom }
    const x = old.width ? (element.scrollLeft + element.clientWidth / 2 - Math.max(0, (element.clientWidth - old.width) / 2)) / old.width : .5
    const y = old.height ? (element.scrollTop + element.clientHeight / 2 - Math.max(0, (element.clientHeight - old.height) / 2)) / old.height : .5
    element.scrollLeft = x * next.width - element.clientWidth / 2
    element.scrollTop = y * next.height - element.clientHeight / 2
    previousSize.current = next
  }, [zoom, fit])

  const changeZoom = (delta: number) => setZoom(value => Math.max(1, Math.min(4, value + delta)))
  return <>
    <div className="case-image-toolbar">
      <DialogTitle className="case-image-title">{alt}</DialogTitle>
      <div className="case-image-controls" aria-label="图片缩放控制">
        <Button variant="ghost" size="icon" aria-label="缩小图片" disabled={zoom <= 1} onClick={() => changeZoom(-.5)}><Minus aria-hidden="true" /></Button>
        <output aria-live="polite" aria-label="缩放比例">{Math.round(zoom * 100)}%</output>
        <Button variant="ghost" size="icon" aria-label="放大图片" disabled={zoom >= 4} onClick={() => changeZoom(.5)}><Plus aria-hidden="true" /></Button>
        <Button variant="ghost" size="icon" aria-label="适应窗口" title="适应窗口" onClick={() => setZoom(1)}><Expand aria-hidden="true" /></Button>
        <DialogClose asChild><Button variant="ghost" size="icon" aria-label="关闭图片预览"><X aria-hidden="true" /></Button></DialogClose>
      </div>
    </div>
    <DialogDescription className="sr-only">使用加减按钮缩放，放大后拖动或滚动查看细节。按 Escape 关闭。</DialogDescription>
    <div ref={viewport} className="case-image-viewport" data-zoomed={zoom > 1} data-dragging={dragging} tabIndex={0} role="region" aria-label="图片细节，可滚动查看"
      onKeyDown={event => {
        if (event.key === '+' || event.key === '=') { event.preventDefault(); changeZoom(.5) }
        if (event.key === '-') { event.preventDefault(); changeZoom(-.5) }
        if (event.key === '0') { event.preventDefault(); setZoom(1) }
      }}
      onDoubleClick={() => setZoom(value => value === 1 ? 2 : 1)}
      onPointerDown={event => {
        if (zoom <= 1 || event.pointerType !== 'mouse' || event.button !== 0) return
        event.preventDefault()
        event.currentTarget.setPointerCapture(event.pointerId)
        drag.current = { x: event.clientX, y: event.clientY, left: event.currentTarget.scrollLeft, top: event.currentTarget.scrollTop }
        setDragging(true)
      }}
      onPointerMove={event => {
        if (!drag.current) return
        event.currentTarget.scrollLeft = drag.current.left + drag.current.x - event.clientX
        event.currentTarget.scrollTop = drag.current.top + drag.current.y - event.clientY
      }}
      onPointerUp={() => { drag.current = null; setDragging(false) }}
      onLostPointerCapture={() => { drag.current = null; setDragging(false) }}
      onPointerCancel={() => { drag.current = null; setDragging(false) }}>
      <div className="case-image-canvas" style={{ width: fit.width * zoom, height: fit.height * zoom }}>
        {src.endsWith('.mp4') ? <LoopVideo src={src} alt={alt} width={width} height={height} controls onSize={(w, h) => setIntrinsic(current => current.width === w && current.height === h ? current : { width: w, height: h })} /> : <ProgressiveImage src={src} alt={alt} width={width} height={height} eager fullResolution draggable={false} onLoad={event => {
          const { naturalWidth, naturalHeight } = event.currentTarget
          if (naturalWidth && naturalHeight) setIntrinsic(current => current.width === naturalWidth && current.height === naturalHeight ? current : { width: naturalWidth, height: naturalHeight })
        }} />}
      </div>
    </div>
  </>
}

export function ZoomableCaseImage(props: ImageProps) {
  return <Dialog>
    <DialogTrigger asChild><button type="button" className="case-image-trigger" aria-label={`放大查看：${props.alt}`}>
      {props.src.endsWith('.mp4') ? <LoopVideo {...props} className={props.imageClassName} /> : <ProgressiveImage src={props.src} alt={props.alt} width={props.width} height={props.height} className={props.imageClassName} eager={props.eager} fullResolution={props.fullResolution} />}
      <span className="case-image-hint" aria-hidden="true"><ZoomIn size={20} /></span>
    </button></DialogTrigger>
    <DialogContent className="case-image-dialog" overlayClassName="case-image-overlay" showCloseButton={false}><ImageViewer {...props} /></DialogContent>
  </Dialog>
}
