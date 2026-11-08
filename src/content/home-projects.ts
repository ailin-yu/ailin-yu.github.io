import type { FolderProject } from '@/components/home/WorkFolder'

// All three selected work projects. Research keeps a separate, visible entry.
export const homeProjects: FolderProject[] = [
  {
    id: 'aidbs', order: '01', title: 'AI 原生数据库服务', en: 'AIDBS',
    summary: '让查询、建实例和诊断进入同一任务入口。',
    role: '设计负责人', topic: '产品判断 / AI Native', caption: '用户意图 · 产品形态 · GenUI',
    sheets: [
      { src: '/home/work/aidbs-task.webp', label: '任务链路', alt: 'AIDBS 真实运维任务链路界面' },
      { src: '/cases/aidbs/query-clarification.webp', label: '交互判断', alt: 'AIDBS 查询条件澄清的真实设计界面' },
      { src: '/home/work/aidbs-interface.webp', label: '产品界面', alt: 'AIDBS 数据库 Agent 的真实产品界面' },
    ],
  },
  {
    id: 'data-agent', order: '02', title: 'Data Agent', en: 'Data Agent',
    summary: '看清分析进度，在关键步骤介入，取得可用的报告。',
    role: '设计负责人', topic: '产品框架 / 人机协作', caption: '任务过程 · 持续分析 · 成果交付',
    sheets: [
      { src: '/cases/data-agent/report.webp', label: '分析产物', alt: 'Data Agent 汇报中的真实分析报告产物' },
      { src: '/cases/data-agent/detail.webp', label: '任务协作', alt: 'Data Agent 任务交互的真实界面片段' },
      { src: '/cases/data-agent/cover.webp', label: '分析工作台', alt: 'Data Agent 持续分析工作台的真实界面' },
    ],
  },
  {
    id: 'cloudai', order: '03', title: 'CloudAI Design', en: 'CloudAI',
    summary: '把设计规则转成 Agent 可以调用的 GenUI 组件。',
    role: '设计系统核心成员', topic: 'GenUI / 设计工程', caption: '设计声明 · 组件规则 · 工程资产',
    sheets: [
      { src: '/cases/cloudai/runtime-structure.webp', label: '系统机制', alt: 'CloudAI 团队 Runtime 结构图的原始汇报局部' },
      { src: '/home/work/genui.webp', label: '业务交互', alt: 'CloudAI GenUI 的业务界面实例' },
      { src: '/home/work/cloudai-system.webp', label: '组件资产', alt: 'CloudAI GenUI 真实组件目录' },
    ],
  },
]
