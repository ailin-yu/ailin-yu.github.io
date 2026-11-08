export type ChallengeKind = 'silos' | 'gap'
export interface ChallengeHandle { select(index: number): void; move(clientX: number, clientY: number): void; destroy(): void }
export function mountChallengeFigure(stage: HTMLElement, kind: ChallengeKind): ChallengeHandle
