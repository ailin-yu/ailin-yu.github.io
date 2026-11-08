import { Children, cloneElement, isValidElement, useRef, type CSSProperties, type ReactNode } from 'react'
import { useInView, useReducedMotion } from 'motion/react'

/** Split Text-style reveal inside the original SVG typesetting.
 * Nested tspans retain their explicit x/y/dy and mixed-language baselines.
 */
function splitCharacters(children: ReactNode, row: number): ReactNode {
  let index = 0
  const split = (content: ReactNode): ReactNode => Children.map(content, child => {
    if (typeof child === 'string' || typeof child === 'number') {
      return Array.from(String(child), (character, key) => <tspan
        key={key}
        className="figma-experience-character"
        style={{ '--character-delay': `${row * .18 + Math.min(index++, 20) * .035}s` } as CSSProperties}
      >{character}</tspan>)
    }
    if (isValidElement<{ children?: ReactNode }>(child)) return cloneElement(child, {}, split(child.props.children))
    return child
  })
  return split(children)
}

export function ExperienceReveal({ x, children }: { x: number; children: ReactNode }) {
  const ref = useRef<SVGGElement>(null)
  const visible = useInView(ref, { once: true, amount: .2, margin: '0px 0px -48px 0px' })
  const reduced = useReducedMotion()
  return <g ref={ref} transform={`translate(${x} 0)`} className="figma-experience-reveal" data-revealed={visible || !!reduced}>
    {Children.map(children, (child, row) => {
      if (!isValidElement<{ children?: ReactNode; xmlSpace?: 'preserve' }>(child)) return child
      return <g className="figma-experience-reveal-row" style={{ '--row-delay': `${row * .18}s` } as CSSProperties}>
        {cloneElement(child, { xmlSpace: 'preserve' }, splitCharacters(child.props.children, row))}
      </g>
    })}
  </g>
}
