export type StrategyKind = 'ready' | 'depth' | 'connect'
export interface StrategyHandle {
  point(index: number): void
  destroy(): void
}
export function mountStrategyFigure(stage: HTMLElement, kind: StrategyKind): StrategyHandle
