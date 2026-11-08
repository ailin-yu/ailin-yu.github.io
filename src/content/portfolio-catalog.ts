import { homeProjects } from './home-projects'
import { developerProjects } from './developer-projects'
import { researchCover } from './research-media'
import { studentProjects } from './student-projects'

export type PortfolioItem = {
  slug: string
  title: string
  role: string
  category: string
  group: 'work' | 'research' | 'student'
  kind: 'template' | 'aidbs' | 'data-agent' | 'cloudai' | 'research' | 'developer' | 'student'
  summary: string
  cover?: string
  alt: string
  preview?: string
  coverFit?: 'cover' | 'contain'
}

// A single list powers the gallery, project menu and route discovery.
export const portfolioItems: PortfolioItem[] = [
  ...homeProjects.map(project => ({
    slug: project.id === 'aidbs' ? 'ai-database' : project.id,
    title: project.title, role: project.role, category: project.topic.split(' / ')[0], group: 'work' as const,
    kind: project.id as 'aidbs' | 'data-agent' | 'cloudai', summary: project.summary,
    cover: project.id === 'aidbs' ? '/cases/aidbs/platform-poster.webp' : project.id === 'data-agent' ? '/home/work/data-agent-key.webp' : '/home/work/genui.webp',
    alt: project.id === 'data-agent' ? 'Data Agent 首页：任务输入、上下文与分析示例' : project.id === 'cloudai' ? 'CloudAI GenUI 在数据库诊断中的真实界面方案' : 'AIDBS 数据库 Agent 产品任务界面',
    preview: project.id === 'aidbs' ? '/cases/aidbs/platform-preview.mp4' : project.id === 'data-agent' ? '/home/work/data-agent-key.mp4' : undefined,
  })),
  ...developerProjects.map(project => ({ slug: project.slug, title: project.title, role: project.role, category: project.focus, group: 'work' as const, kind: 'developer' as const, summary: project.summary, cover: project.cover || undefined, alt: project.coverAlt })),
  { slug: 'cscw', title: 'Agent 过程透明度', role: '第一作者', category: '交互研究', group: 'research', kind: 'research', summary: 'Agent 执行任务时，应该展示多少过程信息？', alt: researchCover.alt, cover: researchCover.src, coverFit: 'contain' },
  ...studentProjects.map(project => ({ slug: project.slug, title: project.title, role: project.stage.includes('概念') ? '概念项目' : '学生项目', category: project.discipline, group: 'student' as const, kind: 'student' as const, summary: project.summary, cover: project.cover, alt: project.coverAlt })),
]

export const caseHref = (slug: string) => `#/projects/${slug === 'ai-database' ? 'aidbs' : slug}`
