import { useEffect, useState, type RefObject } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

// Text Type-inspired entrance, shared by the SVG and mobile greeting.
// Keep the original typesetting; this single sentence never deletes or loops.
export const greetingParts = ['Hi', '，', '我是艾琳'] as const
const total = greetingParts.join('').length

export function useGreetingType(ref: RefObject<HTMLElement | null>) {
  const visible = useInView(ref, { once: true, amount: .2 })
  const reduced = useReducedMotion()
  const mobile = useMediaQuery('(max-width: 767px)')
  const immediate = reduced || mobile
  const [count, setCount] = useState(0)
  const [settled, setSettled] = useState(false)

  useEffect(() => {
    if (!visible || immediate) return
    const timers: number[] = []
    let elapsed = 280
    for (let index = 1; index <= total; index++) {
      // A brief pause at the comma makes the greeting feel spoken.
      elapsed += index === 4 ? 190 : 95
      timers.push(window.setTimeout(() => setCount(index), elapsed))
    }
    timers.push(window.setTimeout(() => setSettled(true), elapsed + 1100))
    return () => timers.forEach(window.clearTimeout)
  }, [visible, immediate])

  const shown = immediate ? total : count
  const cursorPart = shown <= 2 ? 0 : shown <= 3 ? 1 : 2
  return {
    shown,
    cursorPart: visible && !immediate && !settled ? cursorPart : -1,
    part: (index: number) => greetingParts[index].slice(0, Math.max(0, shown - greetingParts.slice(0, index).join('').length)),
  }
}
