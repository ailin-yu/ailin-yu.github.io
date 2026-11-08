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
for (const file of all) {
  const path = relative(resolve(root, 'dist'), file)
  const size = (await stat(file)).size
  total += size
  if (size > 50 * 1024 ** 2) failures.push(`${path}: 单文件超过 50 MiB`)
  if (/(^|\/)(\.DS_Store|\.env.*|sources?\.json)$|\.(gif|blend|heic|pdf|map)$|\.sources\.json$/i.test(path)) failures.push(`${path}: 非发布资源`)
  if (['.js', '.css'].includes(extname(file))) {
    const text = await readFile(file, 'utf8')
    for (const match of text.matchAll(/["'`(](\/(?:cases|home|flowers|brands|fonts|influence|licenses)\/[^\s"'`<>?${})]+\.[a-z0-9]+)["'`)]/gi)) {
      try { await stat(resolve(root, 'dist', match[1].slice(1))) } catch { failures.push(`缺少资源 ${match[1]}`) }
    }
  }
}
if (total > 200 * 1024 ** 2) failures.push('发布产物超过 200 MiB')
console.log(`Release: ${all.length} files, ${(total / 1024 ** 2).toFixed(2)} MiB`)
const index = all.find(f => /assets\/index-[^/]+\.js$/.test(f))
if (index) console.log(`Entry JS gzip: ${(gzipSync(await readFile(index)).length / 1024).toFixed(1)} KiB`)
if (failures.length) { console.error([...new Set(failures)].join('\n')); process.exitCode = 1 }
