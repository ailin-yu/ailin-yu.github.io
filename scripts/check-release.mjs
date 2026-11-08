import { readdir, readFile, stat } from 'node:fs/promises'
import { resolve, relative, extname } from 'node:path'
import { gzipSync } from 'node:zlib'
const root = resolve(import.meta.dirname, '..')
async function files(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  return (await Promise.all(entries.map(e => e.isDirectory() ? files(resolve(dir, e.name)) : resolve(dir, e.name)))).flat()
}
const all = await files(resolve(root, 'dist'))
let total = 0
const failures = []
// Copy edits must remain covered by both licensed Chinese webfont weights.
// Keep this in the release check so a new character cannot silently fall back
// to a sans-serif font on a phone without locally installed Songti.
const fontCss = await readFile(resolve(root, 'src/styles/chinese-fonts.css'), 'utf8')
const coverage = new Map([[400, new Set()], [700, new Set()]])
for (const face of fontCss.matchAll(/@font-face\s*\{([^}]+)\}/g)) {
  const weight = Number(/font-weight:\s*(\d+)/.exec(face[1])?.[1])
  const ranges = /unicode-range:\s*([^;]+)/.exec(face[1])?.[1] || ''
  for (const range of ranges.matchAll(/U\+([\dA-F]+)(?:-([\dA-F]+))?/gi)) {
    for (let cp = parseInt(range[1], 16); cp <= parseInt(range[2] || range[1], 16); cp++) coverage.get(weight)?.add(cp)
  }
}
const required = new Set()
for (const file of await files(resolve(root, 'src'))) {
  if (!['.ts', '.tsx', '.json'].includes(extname(file))) continue
  for (const char of (await readFile(file, 'utf8')).match(/[\u3000-\u303f\u3400-\u9fff\uf900-\ufaff\uff00-\uffef]/gu) || []) required.add(char)
}
for (const [weight, chars] of coverage) {
  const missing = [...required].filter(char => !chars.has(char.codePointAt(0)))
  if (missing.length) failures.push(`中文字体 ${weight} 缺少 ${missing.join('')}；请运行 scripts/prepare-chinese-fonts.py 更新子集`)
}
// Check the minified output: a WebKit-only declaration can silently lose blur
// in browsers that support only the standard backdrop-filter property.
const glass = { headerReset: false, headerBackdrop: false, menuBlur: false }
for (const file of all) {
  const path = relative(resolve(root, 'dist'), file)
  const size = (await stat(file)).size
  total += size
  if (size > 50 * 1024 ** 2) failures.push(`${path}: 单文件超过 50 MiB`)
  if (/(^|\/)(\.DS_Store|\.env.*|sources?\.json)$|\.(gif|blend|heic|pdf|map)$|\.sources\.json$/i.test(path)) failures.push(`${path}: 非发布资源`)
  if (['.js', '.css'].includes(extname(file))) {
    const text = await readFile(file, 'utf8')
    if (extname(file) === '.css') {
      for (const rule of text.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
        const selectors = rule[1].split(',').map(selector => selector.trim())
        const standard = /(?:^|;)\s*backdrop-filter\s*:\s*([^;]+)/.exec(rule[2])?.[1].trim()
        if (selectors.includes('.da-topbar') && standard === 'none') glass.headerReset = true
        if (selectors.some(selector => /^\.da-topbar::?before$/.test(selector)) && standard?.includes('blur(')) glass.headerBackdrop = true
        if (selectors.includes('.da-topbar .work-menu-panel') && standard?.includes('blur(')) glass.menuBlur = true
      }
    }
    for (const match of text.matchAll(/["'`(](\/(?:cases|home|flowers|brands|fonts|influence|licenses)\/[^\s"'`<>?${})]+\.[a-z0-9]+)["'`)]/gi)) {
      try { await stat(resolve(root, 'dist', match[1].slice(1))) } catch { failures.push(`缺少资源 ${match[1]}`) }
    }
  }
}
for (const [name, retained] of Object.entries(glass)) {
  if (!retained) failures.push(`玻璃浮层的标准 backdrop-filter 声明丢失：${name}`)
}
if (total > 200 * 1024 ** 2) failures.push('发布产物超过 200 MiB')
console.log(`Release: ${all.length} files, ${(total / 1024 ** 2).toFixed(2)} MiB`)
const index = all.find(f => /assets\/index-[^/]+\.js$/.test(f))
if (index) console.log(`Entry JS gzip: ${(gzipSync(await readFile(index)).length / 1024).toFixed(1)} KiB`)
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exitCode = 1 }
