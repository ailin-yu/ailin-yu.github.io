/** Counts are source-material scene hits; categories overlap. See Query 分析证据. */
export const aidbsQueries = [
  { name: '数据查询与业务分析', count: 118, query: '查询近期某类产品的订购数', paraphrase: true, gap: '只推荐 Data Agent，未返回指标、口径与查询结果。', steps: ['指标与口径', '查询', '结果'], decision: '找到能力之后，还要承接口径确认与结果交付。', layer: '业务面' },
  { name: '资源生命周期', count: 75, query: '创建一个 PolarDB 实例', gap: '缺少参数收集、询价确认与实际创建。', steps: ['收集参数', '询价确认', '创建'], decision: '将执行前的条件收集、方案选择与确认纳入任务。', layer: '管控面' },
  { name: 'Agent / 应用构建', count: 72, query: '帮我定制化开发一个 Agent', gap: '只推荐产品或 Skill，未进入创建、配置、测试与发布。', steps: ['创建配置', '测试', '发布'], decision: '产品推荐之后，仍需要可继续构建的工作路径。', layer: '业务面' },
  { name: '故障诊断与优化', count: 57, query: '优化慢 SQL，看看索引和执行计划', gap: '未基于真实实例与 SQL 交付诊断结果。', steps: ['实例与 SQL', '诊断', '结果'], decision: '可信结果依赖真实上下文，界面组织与能力接入需要共同建设。', layer: '管控面' },
  { name: '连接接入与鉴权', count: 56, query: '我的实例在成都，为什么只显示北京？', gap: '未识别账号、地域、实例与授权状态。', steps: ['识别对象', '核对权限', '连接实例'], decision: '让任务携带对象和权限等前置条件。', layer: '管控面' },
  { name: '导入导出与归档', count: 42, query: '备份数据表，导出到 OSS', gap: '未选择源表、Bucket、周期并发起任务。', steps: ['选择对象', '确认配置', '发起任务'], decision: '先确认执行对象与配置，再交付任务状态。', layer: '数据面' },
  { name: '任务编排与自动化', count: 41, query: '创建定时任务自动调度这个存储过程', gap: '未创建任务、校验配置与返回运行状态。', steps: ['创建任务', '校验配置', '运行反馈'], decision: '从解释如何操作，延伸到配置校验、执行与反馈。', layer: '业务面' },
  { name: '数据资产治理', count: 41, query: '帮我做数据资产盘点', gap: '未确认范围、启动扫描与输出盘点结果。', steps: ['确认范围', '扫描', '盘点结果'], decision: '范围确认、扫描过程与盘点结果需要连续承接。', layer: '数据面' },
  { name: '数据变更', count: 37, query: '修改数据表中的数据', paraphrase: true, gap: '缺少影响预览、审批、执行与回滚。', steps: ['影响预览', '审批执行', '回滚'], decision: '涉及变更的操作需要让用户看清影响与执行边界。', layer: '数据面' },
  { name: '迁移与同步', count: 28, query: '一个表的数据需要跨实例导入', gap: '未完成源目标映射、预检查与任务启动。', steps: ['源目标映射', '预检查', '启动任务'], decision: '连接源目标、检查条件与任务启动，才能推进迁移。', layer: '数据面' },
] as const

export const aidbsPriorities = [
  { name: '业务面', scope: 'Agent 能力层', count: 231, share: '40.7%', priority: '查询分析', note: '交付用户直接需要的业务结果', scenarios: '查询分析 · 应用构建 · 任务编排' },
  { name: '管控面', scope: '资源运维层', count: 188, share: '33.2%', priority: '资源 / 接入', note: '补足执行前的资源与权限条件', scenarios: '资源生命周期 · 故障诊断 · 连接鉴权' },
  { name: '数据面', scope: '业务资产底座', count: 148, share: '26.1%', priority: '资产治理', note: '承接数据对象、操作范围与任务状态', scenarios: '导入导出 · 资产治理 · 数据变更 · 迁移同步' },
] as const

/** Workflow recorded in the product résumé, Figma node 21:1287; explanatory, not a repository screenshot. */
export const aidbsEngineeringWorkflow = [
  { label: 'Spec', lang: 'en', note: '对齐需求与交互约束' },
  { label: 'CloudAI', lang: 'en', note: '以工程规范约束实现' },
  { label: '同仓迭代', lang: 'zh', note: 'PD · 设计 · 研发' },
  { label: 'AI Coding', lang: 'en', note: '直接参与功能实现' },
] as const

export const aidbsDiagnosisVersions = [
  {
    label: 'Markdown', file: 'diagnosis-markdown.webp', title: '把完整诊断，沿长文展开',
    summaryCrop: 'diagnosis-markdown-summary.webp', actionCrop: 'diagnosis-markdown-action.webp',
    summaryTitle: '状态与异常，逐项阅读', summaryNote: '表格呈现资源状态，异常与原因由后续段落连接。',
    actionTitle: '建议、预估、风险依次展开', actionNote: '索引建议、优化预估与执行风险在长文后半段依次展开。',
    note: '资源状态、异常与建议共用一条阅读路径。',
    alt: '原始 Markdown 诊断结果，指标表格、SQL 与建议以长文本连续排列',
    changes: [
      { title: '资源检查用表格呈现', body: 'CPU、内存、连接、锁等待与慢查询逐行列出，状态与诊断需要逐项对照。' },
      { title: '异常与原因靠段落连接', body: '异常描述之后展开 SQL 代码，再用文字解释索引与扫描问题。' },
      { title: '建议与风险在后半段展开', body: '索引语句、优化预估和变更风险依次列出，操作说明位于长文末尾。' },
    ],
  },
  {
    label: 'GenUI 1.0', file: 'diagnosis-v1.webp', title: '提取指标，建立分组概览',
    summaryCrop: 'diagnosis-v1-summary.webp', actionCrop: 'diagnosis-v1-action.webp',
    summaryTitle: '把状态提取为指标概览', summaryNote: '仪表盘提取资源状态，柱图比较昨日与今日。',
    actionTitle: '给推荐操作独立的区域', actionNote: '用独立卡片归组建议、预估与风险。',
    note: '将长文内容拆成概览、异常与推荐操作。',
    alt: 'GenUI 1.0 诊断 Demo，顶部指标和仪表图，下方为分析与建议',
    changes: [
      { title: '将资源状态转成仪表盘', body: '三个仪表盘提取 CPU、内存和连接使用率，下方用昨日 / 今日柱图比较锁等待与慢查询。' },
      { title: '把异常指标单独提取', body: 'P95 延迟与慢查询占比成为两张指标卡，原因紧接其后，以提示区强调。' },
      { title: '给推荐操作独立区域', body: '索引方案、预估和风险集中在推荐区，底部提供“添加索引”和“查看执行详情”。' },
    ],
  },
  {
    label: 'GenUI 2.0', file: 'diagnosis-v2.webp', title: '沿诊断依据，组织后续操作',
    summaryCrop: 'diagnosis-v2-summary.webp', actionCrop: 'diagnosis-v2-action.webp',
    summaryTitle: '紧凑摘要，再看变化趋势', summaryNote: '紧凑指标连接时序图，先看概览，再定位变化。',
    actionTitle: '在操作之前，显式说明风险', actionNote: '索引语句、存储与 I/O 提示、低峰建议紧邻确认操作。',
    note: '摘要与趋势在前，异常、依据和操作分层呈现。',
    alt: 'GenUI 2.0 诊断方案，摘要指标、时序图、异常分析和操作建议分段呈现',
    changes: [
      { title: '用紧凑摘要连接时序变化', body: '四项资源指标并排展示；慢日志图改为带时间轴的趋势，替代 1.0 的仪表盘和日间对比。' },
      { title: '区分异常与原因', body: 'Finding 保留慢 SQL 与代码，Insight 单独解释索引问题，使诊断依据分层出现。' },
      { title: '在操作区显式交代风险', body: 'Action 将索引语句、存储与 I/O 提示、低峰建议和“取消 / 添加索引”放在同一区域。' },
    ],
  },
] as const

/** Intrinsic dimensions of the real source images and existing crops; reserve space before decode. */
export const aidbsImageSizes: Record<string, readonly [number, number]> = {
  'query-detail.webp': [607, 482],
  'resource-detail.webp': [1313, 774],
  'navigation-detail.webp': [2380, 1486],
  'shared-frame-before.webp': [1600, 900],
  'shared-frame-after.webp': [1600, 900],

  'platform-poster.webp': [1600, 900],
  'unified-navigation.webp': [1600, 999],
  'query-clarification.webp': [1600, 900],
  'query-focus.webp': [481, 382],
  'resource-options.webp': [1600, 900],
  'resource-focus.webp': [667, 393],
  'query-ranking-source.webp': [1600, 1051],
  'query-distribution-source.webp': [1600, 803],
  'diagnosis-markdown.webp': [1440, 2562],
  'diagnosis-markdown-summary.webp': [1295, 700],
  'diagnosis-markdown-action.webp': [1295, 1090],
  'diagnosis-v1.webp': [1600, 2872],
  'diagnosis-v1-summary.webp': [1095, 940],
  'diagnosis-v1-action.webp': [1095, 1110],
  'diagnosis-v2.webp': [1029, 1821],
  'diagnosis-v2-summary.webp': [800, 462],
  'diagnosis-v2-action.webp': [800, 360],
}
