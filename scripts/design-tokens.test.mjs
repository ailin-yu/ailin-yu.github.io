import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { generateStyles, resolveToken } from './design-tokens.mjs'

const typography = JSON.parse(readFileSync(new URL('../设计规范/typography.tokens.json', import.meta.url), 'utf8'))
const colors = JSON.parse(readFileSync(new URL('../设计规范/color.tokens.json', import.meta.url), 'utf8'))

test('brand and reading styles compile to responsive, rem-based CSS', () => {
  const css = generateStyles(colors, typography)
  assert.match(css, /--brand-7: #636AE7/)
  assert.match(css, /--type-zh-body-default-size: 1rem/)
  assert.match(css, /--type-zh-body-small-size: 0\.875rem/)
  assert.match(css, /@media \(min-width: 768px\)/)
  assert.match(css, /@media \(min-width: 1024px\)/)
  assert.match(css, /\.type-heading-h1:lang\(en\)/)
})

test('a reading size below 14px stops compilation', () => {
  const invalid = structuredClone(typography)
  invalid.font.size.s14.$value.value = 13
  assert.throws(() => generateStyles(colors, invalid), /14px/)
})

test('case-study prose follows the ordinary body token in every mode', () => {
  for (const mode of ['mobile', 'tablet', 'desktop']) {
    for (const lang of ['zh', 'en']) {
      const value = resolveToken(typography.typography[mode][lang].body.article.$value, typography)
      assert.equal(resolveToken(value.fontSize, typography).value, 16)
      assert.equal(typography.typography[mode][lang].body.articleLarge.$extensions['io.github.ailin-yu.portfolio'].status, 'exploratory-not-default')
    }
  }
})

test('missing and circular aliases fail instead of silently falling back', () => {
  assert.throws(() => resolveToken('{missing.value}', typography), /找不到 token/)
  assert.throws(() => resolveToken('{loop}', { loop: { $value: '{loop}' } }), /循环/)
})

test('dark roles compile independently and reject broken aliases', () => {
  const css = generateStyles(colors, typography)
  assert.match(css, /:root\[data-theme="dark"\] \{/)
  assert.match(css, /--background: #11141C/)
  const invalid = structuredClone(colors)
  invalid.modes.dark.roles.body = '{roles.missing}'
  assert.throws(() => generateStyles(invalid, typography), /找不到颜色角色/)
  invalid.modes.dark.roles.body = '{roles.foreground}'
  invalid.modes.dark.roles.foreground = '{roles.body}'
  assert.throws(() => generateStyles(invalid, typography), /循环颜色引用/)
})

test('dark reading and primary action pairs meet WCAG AA contrast', () => {
  const roles = { ...colors.roles, ...colors.modes.dark.roles }
  const resolve = value => {
    if (value.startsWith('#')) return value
    const [, group, key] = /^\{([^.]*)\.([^}]*)\}$/.exec(value)
    return group === 'roles' ? resolve(roles[key]) : colors[group].find(entry => String(entry.step) === key).hex
  }
  const luminance = hex => hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0)
  for (const [text, surface] of [['body','background'], ['mutedForeground','background'], ['foreground','surface'], ['body','brandSurface'], ['foreground','brandSoft'], ['primaryForeground','primary']]) {
    const values = [luminance(resolve(roles[text])), luminance(resolve(roles[surface]))].sort((a,b) => a-b)
    assert.ok((values[1] + .05) / (values[0] + .05) >= 4.5, `${text}/${surface}`)
  }
})
