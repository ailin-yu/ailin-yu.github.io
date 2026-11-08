export type ImagePoint = { x: number; y: number }
export type ImageTransform = { scale: number; x: number; y: number }
export type ImageBounds = { viewportWidth: number; viewportHeight: number; width: number; height: number; gap: number }

/** Image-local pinch/pan state, independent of page zoom and DOM event timing. */
export class ImageGestures {
  readonly pointers = new Map<number, ImagePoint>()
  state: ImageTransform = { scale: 1, x: 0, y: 0 }
  moved = false
  private baseline: { state: ImageTransform; point: ImagePoint; distance: number } | null = null
  readonly bounds: ImageBounds
  constructor(bounds: ImageBounds) { this.bounds = bounds }

  private constrain(next: ImageTransform): ImageTransform {
    const scale = Math.max(1, Math.min(5, next.scale))
    const x = Math.max(0, (this.bounds.width * scale - (this.bounds.viewportWidth - this.bounds.gap * 2)) / 2)
    const y = Math.max(0, (this.bounds.height * scale - (this.bounds.viewportHeight - this.bounds.gap * 2)) / 2)
    return { scale, x: Math.max(-x, Math.min(x, next.x)), y: Math.max(-y, Math.min(y, next.y)) }
  }

  private rebase() {
    const [a, b] = [...this.pointers.values()]
    this.baseline = a ? {
      state: { ...this.state },
      point: b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 } : { ...a },
      distance: b ? Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) : 1,
    } : null
  }

  start(id: number, point: ImagePoint) {
    if (this.pointers.size === 2 && !this.pointers.has(id)) return false
    if (!this.pointers.size) this.moved = false
    this.pointers.set(id, point)
    if (this.pointers.size === 2) this.moved = true
    this.rebase()
    return true
  }

  move(id: number, point: ImagePoint) {
    if (!this.pointers.has(id) || !this.baseline) return false
    this.pointers.set(id, point)
    const [a, b] = [...this.pointers.values()]
    const start = this.baseline
    if (b) {
      const scale = Math.max(1, Math.min(5, start.state.scale * Math.hypot(a.x - b.x, a.y - b.y) / start.distance))
      const mid = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }
      // Keep the image point under the fingers anchored as their midpoint moves.
      const anchorX = (start.point.x - this.bounds.viewportWidth / 2 - start.state.x) / start.state.scale
      const anchorY = (start.point.y - this.bounds.viewportHeight / 2 - start.state.y) / start.state.scale
      this.state = this.constrain({ scale, x: mid.x - this.bounds.viewportWidth / 2 - anchorX * scale, y: mid.y - this.bounds.viewportHeight / 2 - anchorY * scale })
    } else {
      const dx = a.x - start.point.x, dy = a.y - start.point.y
      if (Math.hypot(dx, dy) > 5) this.moved = true
      this.state = this.constrain({ scale: start.state.scale, x: start.state.x + dx, y: start.state.y + dy })
    }
    return true
  }

  end(id: number) {
    if (!this.pointers.delete(id)) return false
    // Lifting one finger must not jump when the remaining finger starts panning.
    this.rebase()
    return true
  }

  zoomTo(scale: number, point: ImagePoint = { x: this.bounds.viewportWidth / 2, y: this.bounds.viewportHeight / 2 }) {
    const next = Math.max(1, Math.min(5, scale))
    const relativeX = point.x - this.bounds.viewportWidth / 2
    const relativeY = point.y - this.bounds.viewportHeight / 2
    this.state = this.constrain({ scale: next, x: relativeX - (relativeX - this.state.x) / this.state.scale * next, y: relativeY - (relativeY - this.state.y) / this.state.scale * next })
    this.rebase()
  }

  cancel() { this.pointers.clear(); this.baseline = null }
}
