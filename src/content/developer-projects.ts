export type DeveloperSlug = 'webide-notebook' | 'yaochi'

export type DeveloperProject = {
  slug: DeveloperSlug
  title: string
  english: string
  category: '产品设计'
  role: string
  subtitle: string
  summary: string
  status: 'draft'
  materialStatus: 'available' | 'needs-source'
  cover: string | null
  coverKind: 'image' | 'unavailable'
  coverAlt: string
  focus: string
  focusEnglish: string
  materialNote: string
}

// Project names and presentation focuses were confirmed by the user on 2026-11-03.
// DMS WebIDE sources were supplied in Linear on 2026-11-07; its live detail is
// maintained in content/cases/webide.ts. Yaochi still awaits original materials.
export const developerProjects: DeveloperProject[] = [
  {
    slug: 'webide-notebook',
    title: 'DMS WebIDE',
    english: 'DMS WebIDE',
    category: '产品设计',
    role: '产品设计负责人',
    subtitle: '开发者体验设计',
    summary: '围绕 Notebook，衔接运行资源配置、查询与结果探索。',
    status: 'draft',
    materialStatus: 'available',
    cover: '/cases/webide/notebook-cover.webp',
    coverKind: 'image',
    coverAlt: 'DMS WebIDE Notebook：代码编辑、SQL 查询与结果表格',
    focus: '开发者体验',
    focusEnglish: 'Developer experience',
    materialNote: '已接入用户提供的 Linear 文章与原图/动图；项目时间为2024.11–2025.02，用户确认为产品设计负责人，重点设计 Notebook 编辑器，量化成果仍待补充，辅助信息见独立项目 Spec。',
  },
  {
    slug: 'yaochi',
    title: '瑶池数据库',
    english: 'Enterprise product design',
    category: '产品设计',
    role: '具体分工待核对',
    subtitle: 'B 端复杂技术产品设计',
    summary: '以 B 端复杂技术产品为展示重点，关键页面与具体分工待原始材料补充。',
    status: 'draft',
    materialStatus: 'needs-source',
    cover: null,
    coverKind: 'unavailable',
    coverAlt: '瑶池数据库原始产品画面尚未取得',
    focus: 'B 端复杂技术产品',
    focusEnglish: 'Enterprise product design',
    materialNote: '目前本机资料中尚未找到此项目的原始界面与独立记录。产品范围、设计问题、个人分工及成果需结合原始材料核对后补充。',
  },
]

export const developerOutlines: Record<DeveloperSlug, { id: string; label: string }[]> = {
  'webide-notebook': [],
  yaochi: [],
}
