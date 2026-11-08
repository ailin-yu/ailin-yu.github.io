import type { ProjectCase } from './types'

export const webideCase: ProjectCase = {
  slug: 'webide-notebook', title: 'DMS WebIDE', role: '产品设计负责人 · 2024.11–2025.02', state: 'draft', source: 'docs/projects/DMS-WebIDE-项目Spec.md',
  hero: { src: '/home/work/webide.webp', backgroundSrc: '/home/work/BG-06.webp', alt: 'DMS WebIDE Notebook：代码编辑、SQL 查询与结果表格', width: 2880, height: 2048 },
  overview: [
    'DMS WebIDE 是一款面向企业数据开发者的云端开发工具，支持数据分析与模型开发。企业的 Data+AI 开发涉及数据接入、访问权限与计算资源配置，这些准备工作与实际开发分散在不同入口，开发者需要在配置环境、编写代码与查看结果之间往返。',
    '我担任产品设计负责人，重点负责基于 JupyterLab 的 Notebook 编辑器体验。在已有编辑能力的基础上，将运行资源配置融入开发过程，并增强 SQL 查询结果的查找、列操作与条件筛选，让开发者在同一工作上下文中继续处理数据。',
  ],
  chaptersBeforeHighlights: true,
  chapters: [
    { id: 'webide-journey', label: '用户旅程', english: 'User Journey', paragraphs: [
      '项目始于 2024 年 Q4，面向企业从数据开发、模型开发到应用开发的完整旅程，DMS WebIDE 以统一工作空间衔接数据与开发能力。下文主要介绍 Notebook 编辑器的相关设计。',
    ], media: [
      { src: '/cases/webide/user-journey-light.svg', darkSrc: '/cases/webide/user-journey-dark.svg', layout: 'wide-diagram', alt: 'DMS 企业 AI 开发用户旅程：DataOps、MLOps 与 LLMOps 七个阶段的需求痛点及产品体验', width: 1440, height: 535, caption: '企业 AI 开发核心旅程 · Core User Journey' },
    ] },
  ],
  highlights: { label: '关键设计', english: 'Design Highlights', items: [
    { id: 'webide-workspace', title: '给开发准备一个清晰起点', paragraphs: [
      '首次进入工作空间时，开发者需要先完成数据与环境准备。将引入数据、添加成员、创建 Notebook 等事项组织成清单，并为每项提供直接入口，让用户知道从哪里开始、下一步做什么。',
    ], media: [
      { src: '/cases/webide/workspace-guide.mp4', reducedMotionSrc: '/cases/webide/workspace-guide-still.webp', alt: '工作空间准备引导：数据接入、成员配置与 Notebook 创建', width: 2872, height: 1794 },
    ] },
    { id: 'webide-resources', title: '将资源准备融入开发过程', paragraphs: [
      '运行代码前，开发者需要先选定计算资源。将集群选择放在 Notebook 内，已有资源可直接选用；尚无可用集群时，从同一入口进入创建流程，保留当前代码上下文。',
      '创建侧栏按集群类型、运行环境和资源参数组织配置，并将更多选项收起，让常用配置清晰可见，也为需要精细调整的开发者保留入口。',
    ], media: [
      { src: '/cases/webide/notebook-select-resources.mp4', reducedMotionSrc: '/cases/webide/notebook-select-resources-still.webp', alt: 'Notebook 运行资源配置：在开发界面内选择计算集群，或通过侧栏创建集群并配置资源', width: 2080, height: 1300 },
    ] },
    { id: 'webide-sql-cell', title: '让结果表格支持就地操作', paragraphs: [
      '查询完成后，开发者还需要定位、查看和提取结果。将查找入口放在结果表格上方，通过高亮与匹配数量帮助定位；列名和列数据复制、列宽调整等操作收进列菜单，让操作紧邻处理对象，便于在当前结果中继续处理数据。',
    ], media: [
      { src: '/cases/webide/notebook-edit.mp4', reducedMotionSrc: '/cases/webide/notebook-edit-still.webp', alt: 'Notebook 查询结果操作：查找高亮、列菜单、复制与列宽调整', width: 2872, height: 1794 },
    ] },
    { id: 'webide-results', title: '将查询结果作为继续探索的起点', paragraphs: [
      '面对较多结果，开发者需要按具体条件收窄范围。筛选按字段、条件和值逐步组织，配置后将条件直接展示在表格上方，让用户在查看结果时也能看清当前的筛选依据。',
      '结果区支持拖拽调整高度，在保留代码上下文的同时，为表格阅读提供更合适的空间。',
    ], media: [
      { src: '/cases/webide/notebook-filter.mp4', reducedMotionSrc: '/cases/webide/notebook-filter-still.webp', alt: 'Notebook 查询结果筛选：选择字段、设置条件和值、回显筛选条件并调整结果区高度', width: 2480, height: 1550 },
    ] },
  ] },
  reflection: '这个项目加深了我对开发者体验的理解，项目中形成的 Notebook 体验，也为后续 Data Agent 的分析过程设计打下了基础。',
}
