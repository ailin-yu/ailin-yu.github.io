import type { ProjectCase } from './types'
export const aidbsCase: ProjectCase = {
  slug: 'aidbs', title: 'AI Database Service', role: '设计负责人', state: 'draft', source: 'docs/projects/AIDBS-内容Spec.md',
  hero: { kind: 'video', src: '/cases/aidbs/aidbs-full.mp4', poster: '/cases/aidbs/aidbs-full-poster.webp', alt: 'AIDBS 完整产品演示', width: 1920, height: 1080 },
  overview: [
    'AIDBS 是面向 Agent 时代的 AI 原生数据库服务，连接数据底座构建、数据与语义知识管理、数据消费和数据库运维，让企业数据能够被 Agent 理解和使用。',
    '我担任设计负责人，基于 Agent Input 和 Output 与代码仓库的对照分析识别任务断点，协助推进产品方向。通过 Vibe Coding 构建可运行的 GenUI Demo，推动统一入口与场景体验方案获得产研共识，并与团队共同推进实现。',
    '随着产品形态逐步落地，我与产研团队持续打磨能力与体验，助力阿里云在 2026 年 IDC 中国 Data Agent 厂商评估中获评领导者，产品能力与战略规划评分均居首。',
  ],
  credits: [
    { label: '产品 & 交互设计', names: ['Ailin Yu'] },
    { label: '品牌 & 视觉设计', names: ['Yan Zhu'] },
  ],
  chaptersBeforeHighlights: true,
  chapters: [
    { id: 'aidbs-challenge', label: '挑战与策略', english: 'Challenge & Strategy', numbered: true, layout: 'columns', paragraphConnector: true, items: [
      { id: 'aidbs-agent-era', title: '多团队的专业能力如何形成一个产品？', outlineLabel: '跨团队能力整合', paragraphs: [
        '垂类 Agent 由不同产研团队独立建设，入口与交互各异，用户却需要跨能力完成任务。',
        '以任务统一入口，保留专业分工，统一导航、布局与执行反馈。',
      ], media: [
        { interactive: 'aidbs-silos', src: '/cases/aidbs/challenges/challenge-silos-light.svg', darkSrc: '/cases/aidbs/challenges/challenge-silos-dark.svg', alt: '三个专业模块各自位于独立底座，表达不同团队分别建设带来的入口与体验割裂', width: 1200, height: 900 },
      ] },
      { id: 'aidbs-genui-opportunity', title: '真实任务与平台能力如何衔接？', outlineLabel: '任务与能力衔接', paragraphs: [
        'Agent Input 和 Output 分析发现：用户希望优化慢 SQL，回应却缺少真实实例诊断。',
        '升级场景能力，以 GenUI 串联确认、判断、执行与反馈。',
      ], media: [
        { interactive: 'aidbs-gap', src: '/cases/aidbs/challenges/challenge-gap-light.svg', darkSrc: '/cases/aidbs/challenges/challenge-gap-dark.svg', alt: '从回应文档通向行动目标的路径缺少中间一段，表达给出说明与完成任务之间的能力缺口', width: 1200, height: 900 },
      ] },
    ] },
  ],
  highlights: { label: '关键设计', english: 'Design Highlights', items: [
    { id: 'aidbs-unified-entry', title: '以统一入口串联专业 Agent', outlineLabel: '统一任务入口', paragraphs: [
      "用户完成一个复杂任务时，往往需要串联数据准备、分析和管理等多种能力。AIDBS 将不同团队建设的专业 Agent、数据资产、开发与托管工具整合到同一入口，用户可以用自然语言描述需求，也能按需查找工具。",
      "各子 Agent 保留专业分工，导航、布局和交互规则保持一致。设计与产研在同一代码仓库中协作，支撑 34 个功能模块的体验建设。",
    ], media: [
      { src: '/cases/aidbs/unified-navigation.mp4', reducedMotionSrc: '/cases/aidbs/unified-navigation-still.webp', alt: "AIDBS 统一入口与能力导航：集中展示专业 Agent、数据与资产、开发与托管工具", width: 2380, height: 1486 },
    ] },
    { id: 'aidbs-genui', title: '以 GenUI 动态组织界面体验', outlineLabel: 'GenUI 动态界面', paragraphs: [
      '任务推进时，用户需要的信息和操作也在变化：有时要补充业务口径，有时要核对诊断依据，或比较不同方案。GenUI 技术为这些需求提供了很好的解决方案，让用户可以在对话中完成判断与操作。Agent 根据用户的选择继续处理任务，界面也随之更新。',
    ], subsections: [
      { id: 'aidbs-genui-clarification', title: '以主动澄清对齐分析口径', outlineLabel: '主动澄清口径', paragraphs: [
        "在数据分析场景中，用户希望基于业务数据计算指标。以复购率分析为例，找到订单表，并不意味着已经明确复购率该怎么算：有效订单范围、按下单还是支付时间统计，以及怎样定义复购，都会改变结果。让 Agent 在识别到业务口径缺失时主动澄清，将影响结果的条件拆成逐步确认的 GenUI 卡片。",
        "每一步提供带含义说明的选项与默认建议，保留补充输入和返回修改。确认后，将用户选择带回任务，生成对应的计算公式与口径说明，让用户清楚结果建立在什么条件上。",
      ], media: [
        { src: '/cases/aidbs/query-clarification-2x.mp4', reducedMotionSrc: '/cases/aidbs/query-clarification-still.webp', alt: "复购率口径澄清演示：逐步确认有效订单范围、时间基准与复购定义，再生成计算公式和口径说明", width: 2020, height: 1136 },
      ] },
      { id: 'aidbs-genui-judgment', title: '让诊断建议直接衔接执行', outlineLabel: '诊断与执行闭环', paragraphs: [
        "数据库运维中，DBA 往往需要在多个监控大盘间切换、逐层下钻，关联指标与慢 SQL 来定位异常。通过 GenUI，将 Agent 的诊断结论、相关监控趋势与建议操作组织在同一任务链路中。以 CPU 过载为例，诊断依据与 SQL 限流卡片相邻呈现，便于 DBA 理解原因、核对参数与风险，减少跨页面查找和拼接信息的负担。",
        "关键操作由用户确认后提交，Agent 在当前链路中执行，随后以性能监控反馈处理后的变化。将「诊断—建议—确认—执行—反馈」连接起来，让用户掌握操作决策，同时把问题排查推进到实际处理。",
      ], media: [
        { src: '/cases/aidbs/diagnosis.mp4', reducedMotionSrc: '/cases/aidbs/diagnosis-still.webp', alt: "数据库运维闭环演示：CPU 异常诊断、SQL 限流建议、用户确认执行与性能监控反馈", width: 1280, height: 720 },
      ] },
      { id: 'aidbs-genui-action', title: '让资源推荐衔接比较与选用', outlineLabel: '衔接比较与选用', paragraphs: [
        "数据库的参数配置复杂，具有较高的专业门槛。用户提出「推荐一个 MySQL 数据库」时，往往还不清楚该如何选择参数。通过意图澄清卡片，引导用户说出业务用途、部署地域和使用规模等需求，再由 Agent 据此匹配合适的资源规格，并说明推荐理由。",
        "将推荐、经济与内存余量方案按价格、架构和配置并列呈现，突出差异与适用场景，共同配置集中展示。选用入口直接放在方案卡片内，让需求澄清、权衡比较与方案选择在同一对话中衔接。",
      ], media: [
        { src: '/cases/aidbs/resource-options.mp4', reducedMotionSrc: '/cases/aidbs/resource-options-still.webp', alt: "数据库资源推荐演示：确认业务用途、地域与规模，展示推荐理由、三种方案比较及卡片内选用入口", width: 2180, height: 1226 },
      ] },
    ] },
  ] },
  results: { numbered: true, label: '项目结果', english: 'Results', items: [
    { title: '获评 IDC 中国 Data Agent 领导者', outlineLabel: 'IDC 领导者认可', copy: '2026 年厂商评估中，阿里云的产品能力与战略规划评分均居首。', media: { src: '/cases/aidbs/idc-marketscape-2026.png', alt: 'IDC MarketScape 中国 Data Agent 2026 年厂商评估图：阿里云位于领导者区域', width: 930, height: 918 } },
    { title: '2026.09 云栖大会正式发布', outlineLabel: '云栖大会发布', copy: '提炼产品价值与演示叙事，借助 Codex 编排分镜与关键帧，将视频制作周期从 30 天缩短至 7 天。', media: { src: '/cases/aidbs/yunqi-launch.webp', alt: 'AIDBS 在云栖大会正式发布的现场照片，舞台展示 AI 原生数据库服务与产品界面', width: 4000, height: 2270 } },
  ] },
}
