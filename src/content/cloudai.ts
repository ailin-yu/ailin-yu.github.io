export const cloudaiScenes = [
  {
    id: 'clarify', label: '条件确认', task: '有歧义的条件，在执行前确认。',
    image: '/cases/aidbs/query-detail.webp', width: 607, height: 482,
    original: '/cases/aidbs/query-clarification.webp', originalWidth: 1600, originalHeight: 900,
    alt: 'AIDBS 问数任务中的有效订单范围澄清，包含两种统计口径、补充信息、跳过和确认操作。',
    source: 'AIDBS · 问数方案', description: 'AIDBS 原始问数视频帧；展示完整业务界面。',
    rules: ['具体问题', '明确选项及含义', '补充后确认'],
  },
  {
    id: 'understand', label: '诊断结果', task: '结论、依据与操作分层呈现。',
    image: '/cases/aidbs/diagnosis-v2.webp', width: 1029, height: 1821,
    original: '/cases/aidbs/diagnosis-v2.webp', originalWidth: 1029, originalHeight: 1821,
    alt: 'AIDBS GenUI 2.0 完整诊断方案，包含分析结论、依据、建议与操作。',
    source: 'GenUI 业务实例 · AIDBS', description: 'AIDBS 原始方案截图；展示完整诊断方案。',
    rules: ['结论前置', '关键指标成组', '图表保留时间关系'],
  },
  {
    id: 'compare', label: '方案比较', task: '配置与历史价格并列。',
    image: '/cases/aidbs/resource-detail.webp', width: 1313, height: 774,
    original: '/cases/aidbs/resource-options.webp', originalWidth: 1600, originalHeight: 900,
    alt: 'AIDBS 资源导购中的推荐、经济和内存余量方案，包含配置、历史价格和选择入口。',
    source: 'AIDBS · 资源方案', description: 'AIDBS 原始资源导购视频帧；价格为历史示例。',
    rules: ['相同维度对照', '突出关键差异', '就近提供选用操作'],
  },
] as const

export const cloudaiLayers = [
  { name: 'Template', title: '场景结构', description: '典型任务如何组织信息和交互。' },
  { name: 'Component / Block', title: '界面单元', description: '为不同任务提供可组合的表达。' },
  { name: 'Rules', title: '生成约束', description: '说明使用条件、状态与交互边界。' },
  { name: 'Schema / Renderer', title: '运行与渲染', description: '将生成的结构转为实际界面。' },
  { name: 'Registry', title: '工程分发', description: '连接资产与业务使用方。' },
]

export const cloudaiContributions = [
  { scope: 'GenUI', role: '主导', detail: '按用户意图与任务状态组织动态交互。' },
  { scope: '设计声明与组件规则', role: '参与贡献', detail: '参与适用情境、信息与交互规则。' },
  { scope: 'Vibe Designing Playbook', role: '联合创作', detail: '独立撰写「动态交互」章节，参与「设计工程」内容与网页版实现。' },
]
