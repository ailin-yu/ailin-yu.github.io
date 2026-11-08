import { useEffect, useRef, useState, type ImgHTMLAttributes } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { imageAsset, imageSrcSet, mobileImage } from '@/lib/media-images'

type Props = ImgHTMLAttributes<HTMLImageElement> & { src: string; eager?: boolean; fullResolution?: boolean }

/** An inline tiny preview remains visible while the real image is in flight. */
export function ProgressiveImage({ src, eager = false, fullResolution = false, style, onLoad, onError, ...props }: Props) {
  const ref = useRef<HTMLImageElement>(null)
  const mobile = useMediaQuery('(max-width: 767px)')
  const [nearby, setNearby] = useState(eager)
  const [loaded, setLoaded] = useState('')
  const [fallback, setFallback] = useState(false)
  const asset = imageAsset(src)
  const target = mobile && !fullResolution && !fallback ? mobileImage(src) : src
  const key = `${src}:${target}`
  useEffect(() => {
    if (eager || !ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearby(true); observer.disconnect() }
    }, { rootMargin: '640px 0px' })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [eager, src])
  const requested = eager || nearby || !asset
  return <img {...props} ref={ref} src={requested ? target : asset.preview}
    srcSet={requested && mobile && !fullResolution && !fallback ? imageSrcSet(src) : undefined}
    sizes={mobile && !fullResolution ? '(max-width: 767px) calc(100vw - 48px), 100vw' : undefined}
    width={props.width || asset?.width} height={props.height || asset?.height}
    loading={asset || eager ? 'eager' : 'lazy'} decoding="async" fetchPriority={eager ? 'high' : 'auto'}
    data-media-state={loaded === key ? 'ready' : requested ? 'loading' : 'preview'}
    style={{ ...style, ...(asset && loaded !== key ? { backgroundImage: `url("${asset.preview}")`, backgroundSize: '100% 100%', backgroundRepeat: 'no-repeat' } : {}) }}
    onLoad={event => {
      if (requested && !event.currentTarget.currentSrc.startsWith('data:')) { setLoaded(key); onLoad?.(event) }
    }} onError={event => { if (!fallback && target !== src) setFallback(true); onError?.(event) }} />
}
