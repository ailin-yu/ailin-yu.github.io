import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const destination = resolve(root, 'src/styles/tokens.generated.css')
const kebab = (value) => value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
const rem = (value) => `${Number((value / 16).toFixed(6))}rem`
const fontStack = (value) => value.map((name) => /^(sans-serif|serif|monospace)$/.test(name) ? name : JSON.stringify(name)).join(', ')

export function resolveToken(value, document, trail = []) {
  if (typeof value !== 'string' || !/^\{[^{}]+\}$/.test(value)) return value
  const key = value.slice(1, -1)
  if (trail.includes(key)) throw new Error(`循环 token 引用：${key}`)
  const token = key.split('.').reduce((node, part) => node?.[part], document)
  if (!token || !('$value' in token)) throw new Error(`找不到 token：${key}`)
  return resolveToken(token.$value, document, [...trail, key])
}

function colorValue(value, document, trail = []) {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value
  const reference = /^\{(brand|coolGray|roles)\.([a-zA-Z0-9]+)\}$/.exec(value)
  if (!reference) throw new Error(`无效颜色引用：${value}`)
  const [, group, key] = reference
  if (group === 'roles') {
    if (trail.includes(key)) throw new Error(`循环颜色引用：${key}`)
    if (!Object.hasOwn(document.roles, key)) throw new Error(`找不到颜色角色：${key}`)
    colorValue(document.roles[key], document, [...trail, key])
    return `var(--${kebab(key)})`
  }
  if (!document[group].some((entry) => String(entry.step) === key)) throw new Error(`找不到原始色阶：${value}`)
  return `var(--${group === 'coolGray' ? 'gray' : 'brand'}-${key})`
}

export function generateStyles(colors, typography) {
  const lines = ['/* Generated from 设计规范/*.tokens.json. Run pnpm tokens; do not edit. */']
  // Latin remains Georgia Regular even when a mixed Chinese paragraph is bold.
  // A static regular face covers requested weights; CJK falls through to Songti.
  const latinFace = typography.font.latinRegularFace
  if (latinFace) lines.push('@font-face {', `  font-family: ${JSON.stringify(latinFace.family)};`, `  src: ${latinFace.local.map(name => `local(${JSON.stringify(name)})`).join(', ')};`, '  font-style: normal;', `  font-weight: ${latinFace.weightRange.join(' ')};`, `  unicode-range: ${latinFace.unicodeRange};`, '  font-display: swap;', '}')
  const modes = ['mobile', 'tablet', 'desktop']
  const entries = []
  function walk(node, path = []) {
    if (node.$type === 'typography') entries.push([path.join('-'), node])
    else for (const [key, value] of Object.entries(node)) if (!key.startsWith('$')) walk(value, [...path, key])
  }
  walk(typography.typography.mobile.zh)
  const roleNames = entries.map(([key]) => key)
  const getStyle = (mode, locale, role) => {
    const node = role.split('-').reduce((target, part) => target?.[part], typography.typography[mode][locale])
    if (!node) return null
    const value = resolveToken(node.$value, typography)
    const size = resolveToken(value.fontSize, typography).value
    if (size < 14) throw new Error(`${mode}.${locale}.${role} 小于阅读下限 14px`)
    const family = resolveToken(value.fontFamily, typography)
    if (!Array.isArray(family) || !family.length) throw new Error(`字体未定义：${role}`)
    if (!(value.lineHeight >= 1)) throw new Error(`行高无效：${role}`)
    return { size, family, weight: resolveToken(value.fontWeight, typography), spacing: value.letterSpacing.value, line: value.lineHeight }
  }
  lines.push(':root {')
  for (const [name, palette] of [['brand', colors.brand], ['gray', colors.coolGray]]) {
    for (const item of palette) {
      if (!/^#[0-9a-f]{6}$/i.test(item.hex)) throw new Error(`无效颜色：${item.hex}`)
      lines.push(`  --${name}-${item.step}: ${item.hex};`)
    }
  }
  for (const [role, value] of Object.entries(colors.roles)) {
    lines.push(`  --${kebab(role)}: ${colorValue(value, colors, [role])};`)
  }
  for (const [name, token] of Object.entries(typography.font.family)) lines.push(`  --font-${kebab(name)}: ${fontStack(token.$value)};`)
  // The supplied homepage is a separate, explicit Figma typesetting system.
  // Its 12px timeline dates do not change the case-study reading minimum.
  for (const [name, size] of Object.entries(typography.homepage?.sizes || {})) {
    if (!(Number.isFinite(size) && size >= 12)) throw new Error(`首页字号无效：${name}`)
    lines.push(`  --home-${kebab(name)}-size: ${rem(size)};`)
  }
  for (const [name, size] of Object.entries(typography.projectCase?.sizes || {})) {
    if (!(Number.isFinite(size) && size >= 14)) throw new Error(`案例字号无效：${name}`)
    lines.push(`  --case-${kebab(name)}-size: ${rem(size)};`)
  }
  lines.push('}')
  for (const [name, mode] of Object.entries(colors.modes || {})) {
    if (!/^[a-z]+$/.test(name)) throw new Error(`无效主题：${name}`)
    const document = { ...colors, roles: { ...colors.roles, ...mode.roles } }
    lines.push(`:root[data-theme="${name}"] {`, `  color-scheme: ${name === 'dark' ? 'dark' : 'light'};`)
    for (const [role, value] of Object.entries(mode.roles)) {
      if (!Object.hasOwn(colors.roles, role)) throw new Error(`主题角色未定义：${role}`)
      lines.push(`  --${kebab(role)}: ${colorValue(value, document, [role])};`)
    }
    lines.push('}')
  }
  for (const mode of modes) {
    const media = mode === 'tablet' ? 768 : mode === 'desktop' ? 1024 : null
    if (media) lines.push(`@media (min-width: ${media}px) {`)
    lines.push(':root {')
    for (const locale of ['zh', 'en']) {
      for (const role of [...roleNames, ...(locale === 'en' ? ['display-hero', 'display-section'] : [])]) {
        const style = getStyle(mode, locale, role)
        if (!style) continue
        const prefix = `--type-${locale}-${kebab(role)}`
        lines.push(`  ${prefix}-size: ${rem(style.size)};`, `  ${prefix}-line: ${style.line};`, `  ${prefix}-weight: ${style.weight};`, `  ${prefix}-spacing: ${rem(style.spacing)};`, `  ${prefix}-family: ${fontStack(style.family)};`)
      }
    }
    lines.push('}')
    if (media) lines.push('}')
  }
  lines.push('@layer components {')
  for (const role of [...roleNames, 'display-hero', 'display-section']) {
    for (const locale of role.startsWith('display') ? ['en'] : ['zh', 'en']) {
      const selector = `.type-${kebab(role)}${!role.startsWith('display') && locale === 'en' ? ':lang(en)' : ''}`
      const prefix = `--type-${locale}-${kebab(role)}`
      lines.push(`  ${selector} { font-family: var(${prefix}-family); font-size: var(${prefix}-size); line-height: var(${prefix}-line); font-weight: var(${prefix}-weight); letter-spacing: var(${prefix}-spacing); }`)
    }
  }
  lines.push('}', '')
  return lines.join('\n')
}

function main() {
  const colors = JSON.parse(readFileSync(resolve(root, '设计规范/color.tokens.json'), 'utf8'))
  const typography = JSON.parse(readFileSync(resolve(root, '设计规范/typography.tokens.json'), 'utf8'))
  const css = generateStyles(colors, typography)
  const current = existsSync(destination) ? readFileSync(destination, 'utf8') : ''
  if (process.argv.includes('--check')) {
    if (css !== current) throw new Error('网页样式与设计 token 不一致，请运行 pnpm tokens')
    console.log('设计 token 与网页样式一致；阅读字号下限 14px。')
  } else if (css !== current) {
    mkdirSync(dirname(destination), { recursive: true })
    writeFileSync(destination, css)
    console.log('已同步设计 token → 网页样式。')
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main()
