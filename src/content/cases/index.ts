import { homeDesignProjects } from '@/content/home-design'
import { aidbsCase } from './aidbs'
import { cloudaiCase } from './cloudai'
import { playbookCase } from './playbook'
import { researchCase } from './research'
import { futureVehiclesCase } from './future-vehicles'
import { eraPlanetCase } from './era-planet'
import { webideCase } from './webide'
import type { CaseOutlineItem, ProjectCase } from './types'
export type { CaseMedia, CaseOutlineItem, ProjectCase } from './types'

export const canonicalCaseSlug = (slug: string) => slug === 'ai-database' ? 'aidbs' : slug
const authoredCases: Record<string, ProjectCase> = {
  aidbs: aidbsCase, cloudai: cloudaiCase, playbook: playbookCase, cscw: researchCase,
  'future-vehicles': futureVehiclesCase,
  'era-planet': eraPlanetCase,
  'webide-notebook': webideCase,
  'data-agent': { slug: 'data-agent', title: 'Data Agent', role: '设计负责人', state: 'custom', source: 'docs/projects/Data-Agent-项目Spec.md' },
}
export const projectCases: Record<string, ProjectCase> = Object.fromEntries(homeDesignProjects.map(project => [project.slug, authoredCases[project.slug] || { slug: project.slug, title: project.title, state: 'empty' }]))
export const getProjectCase = (slug: string) => projectCases[canonicalCaseSlug(slug)]
export const caseSectionId = (slug: string, name: string) => `${slug}-${name}`
export const dataAgentOutline: CaseOutlineItem[] = [
  { id: 'da-overview', label: '产品介绍', english: 'Overview' }, { id: 'da-strategy', label: '设计策略', english: 'Design Strategy' },
  { id: 'da-highlights', label: '关键设计', english: 'Design Highlights', children: [{ id: 'da-apps', label: '01 开箱应用' }, { id: 'da-analysis', label: '02 分析体验' }, { id: 'da-enterprise', label: '03 企业级能力' }] },
  { id: 'da-results', label: '项目结果', english: 'Results' },
]
export function projectOutline(project: ProjectCase): CaseOutlineItem[] {
  if (project.state === 'custom') return dataAgentOutline
  const items: CaseOutlineItem[] = []
  if (project.overview?.length) items.push({ id: caseSectionId(project.slug, 'overview'), label: project.slug === 'cscw' ? '研究介绍' : '项目介绍', english: 'Overview' })
  if (project.preview?.items.length) items.push({ id: caseSectionId(project.slug, 'preview'), label: project.preview.label, english: project.preview.english, children: project.preview.items.map((item, i) => ({ id: item.id, label: `${String(i + 1).padStart(2, '0')} ${item.title}` })) })
  if (project.strategy) items.push({ id: caseSectionId(project.slug, 'strategy'), label: project.strategy.label, english: project.strategy.english })
  const chapters = project.chapters?.map(chapter => ({ id: chapter.id, label: chapter.label, english: chapter.english, children: chapter.items?.map((item, i) => ({ id: item.id, label: `${chapter.numbered ? `${String(i + 1).padStart(2, '0')} ` : ''}${item.outlineLabel || item.title}` })) })) || []
  if (project.chaptersBeforeHighlights) items.push(...chapters)
  if (project.highlights?.items.length) items.push({ id: caseSectionId(project.slug, 'highlights'), label: project.highlights.label, english: project.highlights.english, children: project.highlights.items.map((item, i) => ({ id: item.id, label: `${String(i + 1).padStart(2, '0')} ${item.outlineLabel || item.title}` })) })
  if (!project.chaptersBeforeHighlights) items.push(...chapters)
  if (project.results) items.push({ id: caseSectionId(project.slug, 'results'), label: project.results.label || (project.slug === 'cscw' ? '研究结果' : '项目结果'), english: project.results.english || 'Results', children: project.results.numbered ? project.results.items?.map((item, i) => ({ id: caseSectionId(project.slug, `result-${i + 1}`), label: `${String(i + 1).padStart(2, '0')} ${item.outlineLabel || item.title}` })) : undefined })
  if (project.reflection) items.push({ id: caseSectionId(project.slug, 'reflection'), label: '项目总结', english: 'Reflection' })
  return items.length ? items : [{ id: 'main-content', label: '项目概览', english: 'Overview' }]
}
const outlineRegistry = Object.fromEntries(Object.values(projectCases).map(project => [project.slug, projectOutline(project)]))
export const getProjectOutline = (slug: string) => outlineRegistry[canonicalCaseSlug(slug)]
export function nextCase(slug: string) {
  const index = homeDesignProjects.findIndex(project => project.slug === canonicalCaseSlug(slug))
  return homeDesignProjects[(index + 1) % homeDesignProjects.length]
}
