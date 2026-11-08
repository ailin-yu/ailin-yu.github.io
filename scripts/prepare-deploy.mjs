import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
const root = resolve(import.meta.dirname, '..')
const output = resolve(root, '.local/deploy/repository')
await rm(output, { recursive: true, force: true })
await mkdir(output, { recursive: true })
// Explicit source allowlist: never export personal documents, originals or review snapshots.
for (const path of ['src', 'public', '.github', '设计规范', 'index.html', 'package.json', 'pnpm-lock.yaml', 'pnpm-workspace.yaml', '.npmrc', '.gitignore', 'tsconfig.json', 'vite.config.ts', 'components.json', 'README.md']) {
  await cp(resolve(root, path), resolve(output, path), { recursive: true })
}
await mkdir(resolve(output, 'scripts'))
for (const path of ['design-tokens.mjs', 'design-tokens.test.mjs', 'home-gallery.test.mjs', 'check-release.mjs', 'prepare-deploy.mjs', 'prepare-chinese-fonts.py']) await cp(resolve(root, 'scripts', path), resolve(output, 'scripts', path))
console.log(`GitHub source: ${output}\nStatic site: ${resolve(root, 'dist')}`)
