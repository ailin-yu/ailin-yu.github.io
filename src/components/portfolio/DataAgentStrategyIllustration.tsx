import { useEffect, useRef } from 'react'
import { mountStrategyFigure, type StrategyHandle, type StrategyKind } from '@/lib/data-agent-strategies'

const descriptions: Record<StrategyKind, string> = {
  ready: '从托盘中提取开箱即用的分析应用',
  depth: '按需展开结果下方的分析过程与依据',
  connect: '数据与知识模块插接到共同的企业底座',
}

export function DataAgentStrategyIllustration({ kind }: { kind: StrategyKind }) {
  const stage = useRef<HTMLDivElement>(null)
  const handle = useRef<StrategyHandle | null>(null)
  const selected = useRef(-1)

  useEffect(() => {
    if (!stage.current) return
    const figure = mountStrategyFigure(stage.current, kind)
    handle.current = figure
    return () => { handle.current = null; figure.destroy() }
  }, [kind])

  return <div
    className="da-media-slot da-strategy-illustration"
    role="img"
    aria-label={`${descriptions[kind]}。移动鼠标或按方向键查看，Escape 恢复。`}
    tabIndex={0}
    onFocus={() => { selected.current = 0; handle.current?.point(0) }}
    onBlur={() => { selected.current = -1; handle.current?.point(-1) }}
    onKeyDown={event => {
      if (event.key === 'Escape') {
        selected.current = -1; handle.current?.point(-1)
      } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
        event.preventDefault()
        const direction = ['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1
        selected.current = (selected.current + direction + 3) % 3
        handle.current?.point(selected.current)
      }
    }}
  ><div ref={stage} className="da-strategy-stage" aria-hidden="true" /></div>
}
