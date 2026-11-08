import { useEffect, useRef, type PointerEvent } from 'react'
import { mountChallengeFigure, type ChallengeHandle, type ChallengeKind } from '@/lib/aidbs-challenges'

export function AidbsChallengeIllustration({ kind, src, alt }: { kind: ChallengeKind; src: string; alt: string }) {
  const root = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const handle = useRef<ChallengeHandle | null>(null)
  const selected = useRef(-1)
  const pointerInside = useRef(false)

  useEffect(() => {
    if (!stage.current || !root.current) return
    const figure = mountChallengeFigure(stage.current, kind)
    handle.current = figure
    root.current.dataset.enhanced = 'true'
    return () => {
      handle.current = null
      figure.destroy()
      if (root.current) delete root.current.dataset.enhanced
    }
  }, [kind])

  function movePointer(event: PointerEvent<HTMLDivElement>) {
    pointerInside.current = true
    selected.current = -1
    handle.current?.move(event.clientX, event.clientY)
  }
  function leavePointer() {
    pointerInside.current = false
    selected.current = -1
    handle.current?.select(-1)
  }

  return <div ref={root} className="aidbs-challenge-illustration" role="img" tabIndex={0}
    aria-label={`${alt}。移入鼠标查看交互，方向键切换，Escape 恢复。`}
    onPointerEnter={movePointer}
    onPointerMove={movePointer}
    onPointerDown={movePointer}
    onPointerLeave={leavePointer}
    onPointerCancel={leavePointer}
    onFocus={event => {
      // A mouse click must not replace the hovered module with keyboard item 0.
      if (!pointerInside.current && event.currentTarget.matches(':focus-visible')) {
        selected.current = 0; handle.current?.select(0)
      }
    }}
    onBlur={() => {
      selected.current = -1
      if (!pointerInside.current) handle.current?.select(-1)
    }}
    onKeyDown={event => {
      if (event.key === 'Escape') {
        selected.current = -1; handle.current?.select(-1)
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        const count = kind === 'silos' ? 3 : 1
        const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1
        selected.current = (selected.current + direction + count) % count
        handle.current?.select(selected.current)
      }
    }}>
    <img className="aidbs-challenge-fallback" src={src} alt="" aria-hidden="true" width={1200} height={900} />
    <div ref={stage} className="aidbs-challenge-stage" aria-hidden="true" />
  </div>
}
