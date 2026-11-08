import type { PortfolioItem } from '@/content/portfolio-catalog'

// The same import functions serve React.lazy and navigation intent. The browser
// reuses the loaded module; no project videos or full-size images are prefetched.
export const caseModules = {
  template: () => import('@/pages/ProjectCasePage'),
  aidbs: () => import('@/pages/AidbsCasePage'),
  'data-agent': () => import('@/pages/DataAgentCasePage'),
  cloudai: () => import('@/pages/CloudaiCasePage'),
  research: () => import('@/pages/ResearchCasePage'),
  developer: () => import('@/pages/DeveloperCasePage'),
  student: () => import('@/pages/StudentCasePage'),
}

export function warmCase(kind: PortfolioItem['kind']) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
  if (connection?.saveData || /^(slow-)?2g$/.test(connection?.effectiveType || '')) return
  // A failed speculative load must never prevent the regular link from working.
  void caseModules[kind]().catch(() => {})
}
