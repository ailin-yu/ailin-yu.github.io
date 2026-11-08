import { HL } from './kernel.js'
import { mount as ready } from './ready.js'
import { mount as depth } from './depth.js'
import { mount as connect } from './connect.js'

const figures = {
  ready: { mount: ready, center: [208.065, 193.73], value: 40, stops: [[170, 140], [250, 160], [290, 190]] },
  depth: { mount: depth, center: [200, 212.765], value: 18, stops: [[160, 112], [270, 175], [250, 218]] },
  connect: { mount: connect, center: [200.64, 201.555], value: 30, stops: [[150, 140], [270, 190], [180, 170]] },
}

// The figures share Hairline's sleeping frame loop; CSS handles theme changes.
export function mountStrategyFigure(stage, kind) {
  HL.inject(document)
  stage.dataset.hairline = kind
  const svg = HL.mk('svg', { viewBox: '0 0 400 320', 'aria-hidden': 'true' }, stage)
  const figure = figures[kind]
  // Centre the resting artwork bounds, rather than the SVG's empty viewBox.
  stage.style.setProperty('--strategy-center-x', `${-figure.center[0] / 4}%`)
  stage.style.setProperty('--strategy-center-y', `${-figure.center[1] / 3.2}%`)
  const handle = figure.mount({ stage, svg, read: { textContent: '' } }, figure.value)
  return {
    point(index) {
      if (index < 0) { stage.dispatchEvent(new PointerEvent('pointerleave')); return }
      const [x, y] = figure.stops[index % figure.stops.length]
      const rect = stage.getBoundingClientRect()
      stage.dispatchEvent(new PointerEvent('pointermove', {
        pointerType: 'mouse', pointerId: 1,
        clientX: rect.left + rect.width * x / 400,
        clientY: rect.top + rect.height * y / 320,
      }))
    },
    destroy() { handle.destroy(); stage.replaceChildren() },
  }
}
