import type { PortfolioItem } from '@/content/portfolio-catalog'

// The same import functions serve React.lazy and navigation intent. The browser
// reuses the loaded module; full project videos are never prefetched.
export const caseModules = {
  template: () => import('@/pages/ProjectCasePage'),
  aidbs: () => import('@/pages/AidbsCasePage'),
  'data-agent': () => import('@/pages/DataAgentCasePage'),
  cloudai: () => import('@/pages/CloudaiCasePage'),
  research: () => import('@/pages/ResearchCasePage'),
  developer: () => import('@/pages/DeveloperCasePage'),
  student: () => import('@/pages/StudentCasePage'),
}

const heroSources: Record<string, string> = {
  'data-agent': '/cases/data-agent/product-film.webp',
  aidbs: '/cases/aidbs/aidbs-full-poster.webp',
  cloudai: '/cases/cloudai/hero.webp',
  playbook: '/influence/playbook-cover.png',
  'webide-notebook': '/home/work/webide.webp',
  'era-planet': '/cases/era-planet/cover.webp',
}
const warmedHeroes = new Map<string, HTMLImageElement>()

export function warmCase(kind: PortfolioItem['kind'], slug?: string) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType || '')) return
  // A failed speculative load must never prevent the regular link from working.
  void caseModules[kind]().catch(() => {})
  const src = slug ? heroSources[slug] : undefined
  if (src && !warmedHeroes.has(src)) {
    const image = new Image()
    warmedHeroes.set(src, image)
    void import('@/lib/media-images').then(({ mobileImage, imageSrcSet }) => {
      image.decoding = 'async'
      image.fetchPriority = 'high'
      if (matchMedia('(max-width: 767px)').matches) {
        image.sizes = 'calc(100vw - 48px)'
        image.srcset = imageSrcSet(src) || ''
        image.src = mobileImage(src)
      } else image.src = src
    }).catch(() => { warmedHeroes.delete(src) })
    image.onerror = () => warmedHeroes.delete(src)
  }
}
