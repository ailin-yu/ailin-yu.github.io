import type { ProjectCase } from './types'

export const eraPlanetCase: ProjectCase = {
  slug: 'era-planet', title: 'Éra-Planet', role: '团队项目 · 2022.02–2022.08', state: 'draft', source: 'docs/projects/era-planet-内容Spec.md',
  hero: { src: '/cases/era-planet/era-full.mp4', kind: 'video', poster: '/cases/era-planet/cover.webp', alt: 'Éra-Planet AR 智能木玩项目演示', width: 1280, height: 720 },
  overview: [
    'Éra-Planet 是一款为儿童设计的 AR 智能木玩，将实体拼搭与增强现实结合，趣味呈现地球演变与生物特征，鼓励孩子在动手探索中理解生态、发挥想象。',
    '该项目由浙江大学与云和木玩联合发起，探索木制玩具的智能化方向。我负责交互与视觉设计，以及项目管理（PM）与整体协调推进。这是我研究生期间投入心血最多的项目，我们共同完成的作品获得了 5 项国内外设计奖项，这段经历也让我收获了珍贵的友谊。',
  ],
  teamMembers: ['Sheng Yang', 'Ailin Yu', 'Fengyu Wang', 'Weijia Lin', 'Yihan Liu'],
  highlights: { label: '关键设计', english: 'Design Highlights', items: [
    { id: 'era-planet-physical', title: '让地球演变成为可拼搭的体验', paragraphs: [
      '用时期卡片与地形模块组织地球演变知识，让孩子先在实体中选择、组合与探索，为后续的 AR 体验建立具体情境。',
    ], media: [
      { src: '/cases/era-planet/overview.webp', alt: 'Éra-Planet 产品总览：木质底盘、地形模块、时期卡片与 AR App', width: 2880, height: 1371 },
    ] },
    { id: 'era-planet-ar', title: '用 AR 延伸实体探索', paragraphs: [
      '扫描拼搭后的地形，将对应时期的生物带入眼前，并通过生物卡片继续了解特征，让屏幕内容围绕孩子手中的实体展开。',
    ], media: [
      { src: '/cases/era-planet/cover.webp', alt: 'Éra-Planet AR 概念：在实体木玩上呈现生物及其信息', width: 2880, height: 1620 },
      { src: '/cases/era-planet/app.webp', alt: 'Éra-Planet App 界面：时期选择、AR 扫描、生物信息与探索记录', width: 2880, height: 1620 },
    ] },
    { id: 'era-planet-testing', title: '完成 App 开发与实体木玩制作', paragraphs: [
      '团队完成 AR App 开发与实体木玩制作，并邀请 6 组亲子上手体验，收集真实使用反馈。',
    ], media: [
      { src: '/cases/era-planet/physical-toy.webp', alt: 'Éra-Planet 实体样品：地形模块、拼接木盘与底盘细节', width: 2400, height: 1018 },
      { src: '/cases/era-planet/user-testing.webp', alt: 'Éra-Planet 亲子体验：儿童操作实体地形模块与手机 App', width: 2401, height: 892 },
    ] },
  ] },
  results: { label: '获奖情况', english: 'Awards', awards: [
    { title: 'K-Design Award Winner', year: '2022' },
    { title: 'SHAPL Design Award', year: '2022' },
    { title: '中国设计智造大奖 DIA', year: '2022' },
    { title: '国际用户体验创新大赛 UXDA', year: '2022' },
    { title: '中国制造之美最佳创意概念奖', year: '2022' },
  ] },
}
