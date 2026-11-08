import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))
const tokenFiles = [
  resolve(root, '设计规范/color.tokens.json'),
  resolve(root, '设计规范/typography.tokens.json'),
]
const generateTokens = () => {
  execFileSync(process.execPath, [resolve(root, 'scripts/design-tokens.mjs')], { stdio: 'inherit' })
}

export default defineConfig({
  base: '/',
  plugins: [
    {
      name: 'portfolio-design-tokens',
      buildStart: generateTokens,
      configureServer(server) {
        server.watcher.add(tokenFiles)
        server.watcher.on('change', (file) => {
          if (!tokenFiles.includes(file)) return
          try {
            generateTokens()
          } catch (error) {
            server.ws.send({ type: 'error', err: { message: '设计 token 同步失败，请检查终端中的具体字段。', stack: String(error) } })
          }
        })
      },
    },
    react(),
    tailwindcss(),
  ],
  resolve: { alias: { '@': resolve(root, 'src') } },
  server: {
    host: '127.0.0.1',
    fs: { strict: true, deny: ['**/.env*', '**/.git/**', '**/.local/**', '**/归档/**', '**/素材/**', '**/设计探索/**'] },
  },
})
