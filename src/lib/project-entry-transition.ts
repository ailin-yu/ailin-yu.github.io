import '@/styles/project-entry-transition.css'

type Entry = {
  hash: string
  direction: 'enter'
  layer: HTMLDivElement
  frame: HTMLDivElement
  root: HTMLElement | null
  wasInert: boolean
  arrived: boolean
  destinationStarted: boolean
  ready: boolean
  revealing: boolean
  animations: Animation[]
  video: HTMLVideoElement | null
  imageTimer: number
  safetyTimer: number
  layoutFrame: number
  stopWaitingForMedia: () => void
  removeListeners: () => void
  focusTarget: HTMLElement | null
}

let entry: Entry | null = null
type Origin = { scrollY: number; railLeft: number; homeHash: string }
type HomeReturn = { hash: string; slug: string; origin?: Origin }
const origins = new Map<string, Origin>()
let homeReturn: HomeReturn | null = null
let restoredHomeHash: string | null = null
type ReturnFade = {
  hash: string
  layer: HTMLDivElement
  surface: HTMLElement
  opacity: string
  root: HTMLElement | null
  wasInert: boolean
  focusTarget: HTMLElement | null
  animations: Animation[]
  resolveOut: () => void
  layoutFrame: number
  safetyTimer: number
  removeListeners: () => void
}
let returnFade: ReturnFade | null = null
const posters = new Map<string, HTMLImageElement>()
const moveEasing = 'cubic-bezier(.4,0,.2,1)'
const slugFromHash = (hash: string) => hash.slice('#/projects/'.length).replace(/^ai-database$/, 'aidbs')

/** Keep the visible poster capturable even when a video is still buffering. */
export function preloadProjectPoster(video: HTMLVideoElement): HTMLImageElement | undefined {
  if (!video.poster) return
  let poster = posters.get(video.poster)
  if (!poster) {
    poster = new Image()
    poster.src = video.poster
    posters.set(video.poster, poster)
  }
  return poster
}

/** A route change runs in parallel with the cover; it never waits for an animation timer. */
export function cancelProjectEntry() {
  cancelReturnFade()
  const current = entry
  if (!current) return
  entry = null
  clearTimeout(current.imageTimer)
  clearTimeout(current.safetyTimer)
  cancelAnimationFrame(current.layoutFrame)
  current.stopWaitingForMedia()
  current.removeListeners()
  current.animations.forEach(animation => animation.cancel())
  current.video?.pause()
  current.video?.removeAttribute('src')
  current.layer.remove()
  if (current.root) current.root.inert = current.wasInert
  document.documentElement.removeAttribute('data-project-entry')
  document.dispatchEvent(new Event('portfolio:project-transition-end'))
  if (window.location.hash === current.hash) (current.focusTarget || document.getElementById('main-content'))?.focus({ preventScroll: true })
}

function reveal(current: Entry) {
  if (entry !== current || !current.arrived || !current.ready || current.revealing) return
  current.revealing = true
  current.layer.dataset.phase = 'revealing'
  document.documentElement.dataset.projectEntry = 'revealing'
  const fade = current.layer.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 260, easing: 'ease-out', fill: 'forwards' })
  current.animations.push(fade)
  void fade.finished.then(() => { if (entry === current) cancelProjectEntry() }).catch(() => {})
}

function moveToTarget(current: Entry, targetElement: HTMLElement) {
  const target = targetElement.getBoundingClientRect()
  const source = current.frame.getBoundingClientRect()
  const duration = 850
  current.layer.dataset.phase = 'moving'
  document.documentElement.dataset.projectEntry = 'moving'
  const move = current.frame.animate([
    { top: `${source.top}px`, left: `${source.left}px`, width: `${source.width}px`, height: `${source.height}px`, borderRadius: current.frame.style.borderRadius },
    { top: `${target.top}px`, left: `${target.left}px`, width: `${target.width}px`, height: `${target.height}px`, borderRadius: getComputedStyle(targetElement).borderRadius },
  ], { duration, easing: moveEasing, fill: 'forwards' })
  current.animations.push(move)
  const backdrop = current.layer.querySelector<HTMLElement>('.project-entry-backdrop')!
  current.animations.push(backdrop.animate([{ opacity: getComputedStyle(backdrop).opacity }, { opacity: 0 }], { duration: 420, easing: 'ease-out', fill: 'forwards' }))
  for (const visual of current.frame.querySelectorAll<HTMLElement>('.project-entry-media')) {
    current.animations.push(visual.animate([{ transform: getComputedStyle(visual).transform }, { transform: 'none' }], { duration, easing: moveEasing, fill: 'forwards' }))
  }
  void move.finished.then(() => {
    if (entry !== current) return
    current.arrived = true
    current.layer.dataset.phase = 'waiting'
    document.documentElement.dataset.projectEntry = 'waiting'
    reveal(current)
  }).catch(() => {})
}

/** Called only by the committed case, including a cold React.lazy/Suspense arrival. */
export function finishProjectEntry(hash: string) {
  const current = entry
  if (!current || current.direction !== 'enter' || current.hash !== hash || current.destinationStarted) return
  current.destinationStarted = true
  // The committed destination, its responsive CSS and route scroll must all be
  // present before measuring. Never guess a viewport-sized expansion target.
  current.layoutFrame = requestAnimationFrame(() => {
    if (entry !== current) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    const container = document.querySelector<HTMLElement>('.case-content [data-project-entry-target]')
    const media = container?.querySelector<HTMLImageElement | HTMLVideoElement>('img,video')
    const target = media?.getBoundingClientRect()
    if (!media || !target?.width || !target.height) {
      // Text-led cases have no hero media. Do not borrow a figure from the body.
      current.arrived = current.ready = true
      reveal(current)
      return
    }

    moveToTarget(current, media)

    const ready = () => {
      if (entry !== current || current.ready) return
      clearTimeout(current.imageTimer)
      current.stopWaitingForMedia()
      current.ready = true
      reveal(current)
    }
    current.imageTimer = window.setTimeout(ready, 1500)
    if (media instanceof HTMLImageElement) {
      if (media.complete) ready()
      else void media.decode().then(ready).catch(ready)
    } else if (media.readyState >= 2 || media.error) ready()
    else {
      media.addEventListener('loadeddata', ready, { once: true })
      media.addEventListener('error', ready, { once: true })
      current.stopWaitingForMedia = () => {
        media.removeEventListener('loadeddata', ready)
        media.removeEventListener('error', ready)
      }
      // A decoded poster is also a valid destination while the video buffers.
      if (media.poster) {
        const poster = preloadProjectPoster(media)!
        void poster.decode().then(ready).catch(() => {})
      }
    }
  })
}

/** Freeze an interrupted entry so it can fade away without any reverse geometry. */
function freezeActiveEntry() {
  const previous = entry
  if (!previous || !previous.layer.isConnected) { cancelProjectEntry(); return null }
  const bounds = previous.frame.getBoundingClientRect()
  const frameStyle = getComputedStyle(previous.frame)
  const radius = frameStyle.borderRadius
  const frameOpacity = frameStyle.opacity
  const layerOpacity = getComputedStyle(previous.layer).opacity
  const backdrop = previous.layer.querySelector<HTMLElement>('.project-entry-backdrop')!
  const backdropOpacity = getComputedStyle(backdrop).opacity
  const visuals = [...previous.frame.querySelectorAll<HTMLElement>('.project-entry-media')].map(element => ({ element, transform: getComputedStyle(element).transform, opacity: getComputedStyle(element).opacity }))
  clearTimeout(previous.imageTimer)
  clearTimeout(previous.safetyTimer)
  cancelAnimationFrame(previous.layoutFrame)
  previous.stopWaitingForMedia()
  previous.removeListeners()
  previous.animations.forEach(animation => animation.cancel())
  Object.assign(previous.frame.style, { top: `${bounds.top}px`, left: `${bounds.left}px`, width: `${bounds.width}px`, height: `${bounds.height}px`, borderRadius: radius, opacity: frameOpacity })
  previous.layer.style.opacity = layerOpacity
  backdrop.style.opacity = backdropOpacity
  for (const visual of visuals) Object.assign(visual.element.style, { transform: visual.transform, opacity: visual.opacity })
  entry = null // Invalidate pending decode and arrival callbacks.
  return previous
}

function cancelReturnFade() {
  const current = returnFade
  if (!current) return
  returnFade = null
  cancelAnimationFrame(current.layoutFrame)
  clearTimeout(current.safetyTimer)
  current.removeListeners()
  current.animations.forEach(animation => animation.cancel())
  current.surface.style.opacity = current.opacity
  current.layer.remove()
  if (current.root) current.root.inert = current.wasInert
  document.documentElement.removeAttribute('data-project-entry')
  document.dispatchEvent(new Event('portfolio:project-transition-end'))
  current.resolveOut()
  if (location.hash === current.hash) current.focusTarget?.focus({ preventScroll: true })
}

function queueHomeReturn(hash: string) {
  const frame = requestAnimationFrame(() => {
    if (location.hash === hash && document.querySelector('.figma-home')) finishProjectReturn(hash)
  })
  if (returnFade) returnFade.layoutFrame = frame
}

/** Keep the current reading position visible while it fades out before routing. */
export function beginProjectReturn(fromHash: string, hash: string): Promise<void> {
  homeReturn = null
  restoredHomeHash = null
  if (returnFade) cancelReturnFade()
  if (!fromHash.startsWith('#/projects/')) return Promise.resolve()
  const slug = slugFromHash(fromHash)
  const origin = origins.get(slug)
  if (!['', '#', '#works'].includes(hash) && hash !== origin?.homeHash) return Promise.resolve()
  homeReturn = { hash, slug, origin }
  const surface = document.querySelector<HTMLElement>('.route-surface')
  if (!surface || matchMedia('(prefers-reduced-motion: reduce)').matches || typeof surface.animate !== 'function') {
    cancelProjectEntry()
    queueHomeReturn(hash)
    return Promise.resolve()
  }
  const interrupted = freezeActiveEntry()
  const root = document.getElementById('root')
  const layer = interrupted?.layer || document.createElement('div')
  layer.className = 'project-entry-layer'
  layer.setAttribute('aria-hidden', 'true')
  layer.dataset.direction = 'return'
  layer.dataset.phase = 'fading-out'
  if (!layer.isConnected) document.body.append(layer)
  let resolveOut = () => {}
  const finished = new Promise<void>(resolve => { resolveOut = resolve })
  const current: ReturnFade = { hash, layer, surface, opacity: surface.style.opacity, root, wasInert: interrupted?.wasInert ?? root?.inert ?? false, focusTarget: null, animations: [], resolveOut, layoutFrame: 0, safetyTimer: 0, removeListeners: () => {} }
  returnFade = current
  if (root) root.inert = true
  document.documentElement.dataset.projectEntry = 'fading-out'
  const out = surface.animate([{ opacity: getComputedStyle(surface).opacity }, { opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.37,0,.63,1)', fill: 'forwards' })
  current.animations.push(out)
  if (interrupted) current.animations.push(layer.animate([{ opacity: getComputedStyle(layer).opacity }, { opacity: 0 }], { duration: 320, easing: 'cubic-bezier(.37,0,.63,1)', fill: 'forwards' }))
  const route = () => { if (location.hash !== hash) cancelReturnFade() }
  const cancel = () => cancelReturnFade()
  const visibility = () => { if (document.hidden) cancelReturnFade() }
  const key = (event: KeyboardEvent) => {
    if (event.key === 'Escape') cancelReturnFade()
    else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) event.preventDefault()
  }
  const scroll = (event: Event) => { if (event.cancelable && !(event instanceof WheelEvent && event.ctrlKey)) event.preventDefault() }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const reduce = () => { if (reduced.matches) cancelReturnFade() }
  window.addEventListener('hashchange', route)
  window.addEventListener('resize', cancel)
  document.addEventListener('visibilitychange', visibility)
  document.addEventListener('keydown', key)
  window.addEventListener('wheel', scroll, { passive: false })
  window.addEventListener('touchmove', scroll, { passive: false })
  reduced.addEventListener('change', reduce)
  current.removeListeners = () => {
    window.removeEventListener('hashchange', route)
    window.removeEventListener('resize', cancel)
    document.removeEventListener('visibilitychange', visibility)
    document.removeEventListener('keydown', key)
    window.removeEventListener('wheel', scroll)
    window.removeEventListener('touchmove', scroll)
    reduced.removeEventListener('change', reduce)
    interrupted?.video?.pause()
    interrupted?.video?.removeAttribute('src')
  }
  current.safetyTimer = window.setTimeout(cancel, 8000)
  void out.finished.then(() => {
    if (returnFade !== current) return
    surface.style.opacity = '0'
    interrupted?.video?.pause()
    interrupted?.video?.removeAttribute('src')
    current.layer.replaceChildren()
    current.animations.forEach(animation => animation.cancel())
    current.animations = []
    current.layer.style.opacity = '1'
    current.layer.dataset.phase = 'waiting-home'
    document.documentElement.dataset.projectEntry = 'waiting-home'
    resolveOut()
    queueHomeReturn(hash)
  }).catch(() => resolveOut())
  return finished
}

/** Runs after the homepage commits, before the ordinary route scroll handling. */
export function finishProjectReturn(hash: string): boolean {
  const pending = homeReturn
  if (!pending || pending.hash !== hash) {
    if (restoredHomeHash === hash) { restoredHomeHash = null; return true }
    return false
  }
  homeReturn = null
  const rail = document.querySelector<HTMLElement>('.figma-work-rail')
  const card = rail?.querySelector<HTMLElement>(`a[href="#/projects/${pending.slug}"] .figma-card-cover`)
  if (!card || !rail) { cancelProjectEntry(); return false }
  restoredHomeHash = hash
  const origin = pending.origin
  if (origin) {
    rail.scrollLeft = origin.railLeft
    sessionStorage.setItem('portfolio-figma-gallery', String(origin.railLeft))
    window.scrollTo({ top: origin.scrollY, behavior: 'instant' })
  } else {
    window.scrollTo({ top: Number(sessionStorage.getItem('portfolio-home-scroll') || 0), behavior: 'instant' })
  }
  const bounds = card.getBoundingClientRect()
  const railBounds = rail.getBoundingClientRect()
  if (bounds.bottom <= 64 || bounds.top >= innerHeight || bounds.right <= railBounds.left || bounds.left >= railBounds.right) {
    card.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })
  }
  sessionStorage.setItem('portfolio-home-scroll', String(scrollY))
  sessionStorage.setItem('portfolio-figma-gallery', String(rail.scrollLeft))
  const link = card.closest<HTMLAnchorElement>('a')!
  const current = returnFade
  if (!current || current.hash !== hash) {
    link.focus({ preventScroll: true })
    return true
  }
  current.focusTarget = link
  current.layer.dataset.phase = 'preparing-home'
  document.documentElement.dataset.projectEntry = 'preparing-home'
  const started = performance.now()
  let readyFrames = 0
  const paintThenFade = (now: number) => {
    if (returnFade !== current) return
    const canvases = [...current.surface.querySelectorAll<HTMLCanvasElement>('.figma-particles')].filter(canvas => {
      const rect = canvas.getBoundingClientRect()
      return rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth
    })
    const ready = canvases.every(canvas => canvas.dataset.ready === 'true' || canvas.dataset.failed === 'true') && [...card.querySelectorAll('img')].every(image => image.complete)
    readyFrames = ready ? readyFrames + 1 : 0
    if (readyFrames < 2 && now - started < 800) {
      current.layoutFrame = requestAnimationFrame(paintThenFade)
      return
    }
    current.layer.dataset.phase = 'fading-in'
    document.documentElement.dataset.projectEntry = 'fading-in'
    const fade = current.surface.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: 'cubic-bezier(.37,0,.63,1)', fill: 'forwards' })
    current.animations.push(fade)
    void fade.finished.then(() => { if (returnFade === current) cancelReturnFade() }).catch(() => {})
  }
  current.layoutFrame = requestAnimationFrame(paintThenFade)
  return true
}

export function beginProjectEntry(preview: HTMLElement, hash: string): boolean {
  origins.set(slugFromHash(hash), { scrollY, railLeft: document.querySelector('.figma-work-rail')?.scrollLeft || 0, homeHash: location.hash })
  return beginTransition(preview, hash)
}

/** Capture the actual visible frame, rather than replacing a playing clip with its poster. */
function beginTransition(preview: HTMLElement, hash: string): boolean {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || typeof preview.animate !== 'function') return false
  const clip = preview.querySelector<HTMLVideoElement>('video.is-playing')
  const image = preview.querySelector<HTMLImageElement>('img[data-work-foreground]') || preview.querySelector<HTMLImageElement>('img')
  const source = clip && clip.readyState >= 2 && Number(getComputedStyle(clip).opacity) > .5 ? clip : image
  if (!source || (source instanceof HTMLImageElement && (!source.complete || !source.naturalWidth))) return false
  const sourceRect = preview.getBoundingClientRect()
  const offscreen = sourceRect.bottom <= 0 || sourceRect.top >= innerHeight
  if (!sourceRect.width || !sourceRect.height || offscreen || sourceRect.right <= 0 || sourceRect.left >= innerWidth) return false
  const rect = sourceRect

  const snapshot = document.createElement('canvas')
  const nativeWidth = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth
  const nativeHeight = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight
  const scale = Math.min(1, 2048 / Math.max(nativeWidth, nativeHeight))
  snapshot.width = Math.round(nativeWidth * scale)
  snapshot.height = Math.round(nativeHeight * scale)
  const layered = preview.dataset.workLayered === 'true'
  try {
    const context = snapshot.getContext('2d')
    if (!context) return false
    if (layered) {
      const layers = [...preview.querySelectorAll<HTMLImageElement>('img[data-work-layer]')]
      if (layers.some(layer => !layer.complete || !layer.naturalWidth)) return false
      const resolution = Math.min(devicePixelRatio || 1, 2)
      snapshot.width = Math.round(rect.width * resolution); snapshot.height = Math.round(rect.height * resolution)
      context.setTransform(resolution, 0, 0, resolution, 0, 0)
      context.fillStyle = getComputedStyle(preview).backgroundColor
      context.fillRect(0, 0, rect.width, rect.height)
      for (const layer of layers) {
        const box = layer.getBoundingClientRect()
        const x = box.left - rect.left, y = box.top - rect.top
        if (layer.hasAttribute('data-work-foreground')) {
          // Capture the same clipped foreground, its current pan and four shadows.
          const foreground = document.createElement('canvas')
          foreground.width = Math.ceil(box.width * resolution); foreground.height = Math.ceil(box.height * resolution)
          const drawing = foreground.getContext('2d')
          if (!drawing) return false
          const radius = parseFloat(getComputedStyle(layer).borderTopLeftRadius) || 0
          drawing.setTransform(resolution, 0, 0, resolution, 0, 0)
          drawing.beginPath(); drawing.moveTo(radius, 0); drawing.lineTo(box.width, 0); drawing.lineTo(box.width, box.height); drawing.lineTo(0, box.height); drawing.lineTo(0, radius); drawing.quadraticCurveTo(0, 0, radius, 0); drawing.closePath(); drawing.clip()
          drawing.drawImage(layer, 0, 0, box.width, box.height)
          const coverScale = rect.height / 400
          for (const [offset, blur, alpha] of [[219, 88, .01], [123, 74, .04], [55, 55, .07], [14, 30, .08]]) {
            context.shadowColor = `rgba(0,0,0,${alpha})`; context.shadowOffsetY = offset * coverScale * resolution; context.shadowBlur = blur * coverScale * resolution
            context.drawImage(foreground, x, y, box.width, box.height)
          }
          context.shadowColor = 'transparent'; context.shadowOffsetY = 0; context.shadowBlur = 0
          context.drawImage(foreground, x, y, box.width, box.height)
        } else context.drawImage(layer, x, y, box.width, box.height)
      }
    } else context.drawImage(source, 0, 0, snapshot.width, snapshot.height)
  } catch { return false }

  cancelProjectEntry()
  const root = document.getElementById('root')
  const sourceStyle = getComputedStyle(source)
  const mediaTransform = layered ? 'none' : sourceStyle.transform
  const previewStyle = getComputedStyle(preview)
  const layer = document.createElement('div')
  layer.className = 'project-entry-layer'
  layer.setAttribute('aria-hidden', 'true')
  layer.dataset.phase = 'loading'
  layer.dataset.direction = 'enter'
  layer.dataset.sourceKind = source instanceof HTMLVideoElement ? 'video' : 'image'
  if (source instanceof HTMLVideoElement) layer.dataset.sourceTime = source.currentTime.toFixed(3)
  layer.dataset.source = source instanceof HTMLVideoElement ? source.currentSrc : source.currentSrc || source.src
  const backdrop = document.createElement('div')
  backdrop.className = 'project-entry-backdrop'
  const frame = document.createElement('div')
  frame.className = 'project-entry-frame'
  Object.assign(frame.style, { top: `${rect.top}px`, left: `${rect.left}px`, width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: previewStyle.borderRadius, backgroundColor: previewStyle.backgroundColor })
  snapshot.className = 'project-entry-media'
  Object.assign(snapshot.style, { objectFit: layered ? 'cover' : sourceStyle.objectFit, objectPosition: layered ? 'center' : sourceStyle.objectPosition, transform: mediaTransform })
  frame.append(snapshot)
  layer.append(backdrop, frame)
  document.body.append(layer)

  const current: Entry = { hash, direction: 'enter', layer, frame, root, wasInert: root?.inert ?? false, arrived: false, destinationStarted: false, ready: false, revealing: false, animations: [], video: null, imageTimer: 0, safetyTimer: 0, layoutFrame: 0, stopWaitingForMedia: () => {}, removeListeners: () => {}, focusTarget: null }
  entry = current
  if (root) root.inert = true
  document.documentElement.dataset.projectEntry = 'loading'

  // Keep the exact captured frame until a continuation clip has reached the same
  // playback position. A blocked autoplay or decode still leaves a valid image.
  if (source instanceof HTMLVideoElement) {
    const continuing = document.createElement('video')
    current.video = continuing
    continuing.className = 'project-entry-media project-entry-video'
    continuing.muted = true
    continuing.playsInline = true
    continuing.loop = source.loop
    continuing.preload = 'auto'
    continuing.src = source.currentSrc
    Object.assign(continuing.style, { objectFit: sourceStyle.objectFit, objectPosition: sourceStyle.objectPosition, transform: sourceStyle.transform, opacity: '0' })
    const time = source.currentTime
    const show = () => { if (entry === current && continuing.readyState >= 2) continuing.style.opacity = '1' }
    continuing.addEventListener('loadedmetadata', () => { if (entry === current) continuing.currentTime = Math.min(time, Math.max(0, continuing.duration - .01)) }, { once: true })
    const playing = !source.paused
    continuing.addEventListener('seeked', () => { if (entry === current) { if (playing) void continuing.play().then(show).catch(() => {}); else show() } }, { once: true })
    continuing.addEventListener('playing', show)
    frame.append(continuing)
  }

  const background = backdrop.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 360, easing: 'ease-out', fill: 'forwards' })
  current.animations.push(background)

  watchTransition(current)
  return true
}

function watchTransition(current: Entry) {
  const route = () => { if (window.location.hash !== current.hash) cancelProjectEntry() }
  const resize = () => cancelProjectEntry()
  const visibility = () => { if (document.hidden) cancelProjectEntry() }
  const escape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') cancelProjectEntry()
    else if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) event.preventDefault()
  }
  // Keep the measured media region still until the cover has arrived there.
  const preventScroll = (event: Event) => { if (event.cancelable && !(event instanceof WheelEvent && event.ctrlKey)) event.preventDefault() }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)')
  const reduce = () => { if (reduced.matches) cancelProjectEntry() }
  window.addEventListener('hashchange', route)
  window.addEventListener('resize', resize)
  document.addEventListener('visibilitychange', visibility)
  document.addEventListener('keydown', escape)
  window.addEventListener('wheel', preventScroll, { passive: false })
  window.addEventListener('touchmove', preventScroll, { passive: false })
  reduced.addEventListener('change', reduce)
  current.removeListeners = () => {
    window.removeEventListener('hashchange', route)
    window.removeEventListener('resize', resize)
    document.removeEventListener('visibilitychange', visibility)
    document.removeEventListener('keydown', escape)
    window.removeEventListener('wheel', preventScroll)
    window.removeEventListener('touchmove', preventScroll)
    reduced.removeEventListener('change', reduce)
  }
  // A failed destination import must never leave an inert app behind a permanent cover.
  current.safetyTimer = window.setTimeout(() => { if (entry === current) cancelProjectEntry() }, 8000)
}
