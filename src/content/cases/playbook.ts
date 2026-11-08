import type { ProjectCase } from './types'

// Official repository figures, pinned source and hashes: public/cases/playbook/sources.json.
export const playbookCase: ProjectCase = {
  slug: 'playbook', title: 'Vibe Designing Playbook', role: '共同作者', state: 'draft', source: 'docs/专业影响力内容Spec.md',
  hero: { src: '/influence/playbook-cover.png', alt: 'Vibe Designing Playbook 官方封面', width: 3360, height: 2000 },
  overview: [
    '一份面向设计师与开发者的实践指南，探讨如何将设计判断融入 AI 生成，涵盖设计工程、动态交互与自我进化。',
    '我独立撰写「动态交互」章节，并参与「设计工程」内容与网页版实现。',
    '作者：Yan Zhu、Ailin Yu、Zehui Jin。',
  ],
  linksPosition: 'overview',
  links: [
    { label: '在线阅读', href: 'https://alibaba-cloud-design.github.io/vibe-designing-playbook/' },
    { label: 'GitHub 仓库', href: 'https://github.com/Alibaba-Cloud-Design/vibe-designing-playbook' },
  ],
  preview: { label: '内容预览', english: 'Preview', items: [
    { id: 'playbook-engineering', title: '设计工程', media: { src: '/cases/playbook/design-io-light.svg', darkSrc: '/cases/playbook/design-io-dark.png', alt: 'Design I/O：理解规划、信息架构、组件、交互与评估回流', width: 2794, height: 946, caption: '01 设计工程 · Design I/O 生成链路' } },
    { id: 'playbook-interaction', title: '动态交互', media: { src: '/cases/playbook/experience-loop-light.svg', darkSrc: '/cases/playbook/experience-loop-dark.svg', alt: 'Agent Experience Loop：用户意图、Agent 行动、界面协作与用户控制', width: 2000, height: 1128, caption: '02 动态交互 · Agent Experience Loop' } },
    { id: 'playbook-evolution', title: '自我进化', media: { src: '/cases/playbook/evaluator-loop-light.svg', darkSrc: '/cases/playbook/evaluator-loop-dark.svg', alt: 'Evaluator 自我进化闭环', width: 1193, height: 704, caption: '03 自我进化 · Evaluator 评估闭环' } },
  ] },
}
