import { researchFigures, researchPaper } from '@/content/research-media'
import type { ProjectCase } from './types'

export const researchCase: ProjectCase = {
  slug: 'cscw', title: 'AI Agents Experience Research', role: '第一作者', state: 'draft', source: 'docs/projects/CSCW研究-内容Spec.md',
  publication: researchPaper,
  hero: null,
  overview: [
    'Agent 需要展示什么过程、展示到什么程度？这项研究按规划、执行与总结梳理信息组件，并依据重要性建立透明度分层框架。',
    '作为第一作者，我与团队从研究中提出可调节、任务驱动的透明度策略，并将这些洞察带入 Data Agent 等产品的分析体验。',
  ],
  chapters: [
    { id: 'research-contributions', label: '研究贡献', english: 'Contributions', numbered: true, items: [
      { id: 'research-information', outlineLabel: '过程信息框架', title: '以阶段与信息重要性建立透明度框架', paragraphs: ['将 Agent 执行过程划为规划、执行与总结三个阶段，识别 10 类信息组件，并区分必要、高、中、低重要程度，明确不同信息对用户理解任务的作用。'], media: [{ ...researchFigures[0], caption: 'Figure 1 · 三个执行阶段的信息组件与重要程度' }] },
      { id: 'research-levels', outlineLabel: '透明度分层', title: '将信息重要性转为透明度分层策略', paragraphs: ['高透明度展示完整过程；中透明度保留计划、当前任务与总结；低透明度聚焦任务总结。通过可比较的信息范围，将透明度转为可以设计和验证的交互变量。'], media: [{ ...researchFigures[1], caption: 'Figure 2 · 高、中、低透明度的信息组织' }] },
    ] },
    { id: 'research-insights', label: '设计洞察', english: 'Design Insights', numbered: true, paragraphs: ['研究中，高透明度的信任、满意度与使用意愿评分更高，但部分用户倾向于省略过程细节。据此提出以下设计策略。'], items: [
      { id: 'research-intermediate', outlineLabel: '中间产物', title: '中间产物应在执行中可见', paragraphs: ['用户不仅关心最终结果，也需要在任务进行时识别偏差。让中间产物随执行进展呈现，为追溯原因与调整方向提供依据。'] },
      { id: 'research-adjustable', outlineLabel: '动态调节', title: '透明度应允许动态调节', paragraphs: ['保留计划、进展和结果的概览，细节按需展开，让希望理解过程与只需结果的用户选择合适的展示深度。'] },
      { id: 'research-task-driven', outlineLabel: '任务驱动', title: '展示深度应由任务驱动', paragraphs: ['简单、目标明确的任务优先呈现结果；复杂、多步骤任务提供更多计划与执行依据，将透明度投入到用户当前需要判断的环节。'] },
    ] },
    { id: 'research-application', label: '产品应用', english: 'In Practice', paragraphs: ['研究中的透明度策略已应用于 Data Agent、PAI Artlab Yumi 等 8+ Agent 产品；规划、执行、总结三个阶段的信息组件，也沉淀到 CloudAI Design 设计范式中。'] },
  ],
  links: [
    { label: '阅读论文 · CSCW Companion 2025', href: researchPaper.href },
    { label: '查看 Data Agent', href: '#/projects/data-agent' },
    { label: '查看 CloudAI Design', href: '#/projects/cloudai' },
  ],
}
