export type Project = {
  slug: string
  title: string
  summary: string
  role: string
  status: 'draft' | 'review' | 'ready'
  number: string
  english: string
  category: '产品设计' | '设计工程' | '交互研究'
  subtitle: string
  introduction: string
  responsibilities: string[]
  chapters: { title: string; paragraphs: string[] }[]
  takeaway: string
}

// Local content index. Homepage structure follows docs/作品集网站主Spec.md; case facts follow docs/projects/.
// Draft records are not public case pages or evidence of completed publication.
export const projects: Project[] = [
  {
    slug: 'ai-database', number: '01', title: 'AI 原生数据库服务', english: 'AI-native database', category: '产品设计',
    summary: '从分散的 Agent 能力，到围绕用户任务的生成式体验。', role: '设计负责人', status: 'draft',
    subtitle: '让界面接住回答之后的判断与行动。',
    introduction: '能力增加后，用户仍需要自己寻找合适的 Agent。我从真实 Query 与现有能力出发，将体验缺口转成统一任务入口、GenUI 场景和跨产品规则，用可运行的方案推进产品与研发协作。',
    responsibilities: ['用户任务与能力分析', '统一入口与 GenUI', '可运行 Demo', '跨产品体验建设'],
    chapters: [
      { title: '先接住任务，再组织 Agent', paragraphs: ['原体验要求用户先知道该找哪个 Agent。我从代码仓库与 Agent 走查建立能力视图，再归类用户 Query，寻找能力与任务之间没有接上的环节。', '我将用户意图、子 Agent 调用、执行反馈与结果组织进统一的交互框架，用可运行 Demo 与产品、研发讨论完整的使用方式。'] },
      { title: '把不确定条件，变成可以作出的选择', paragraphs: ['问数不只是将一句话翻译成查询。统计使用订单创建时间还是支付时间，会直接影响结果含义。设计需要让用户在任务中明确口径，再继续分析。', '我将这类不确定条件转成带有说明和选项的澄清交互。界面不只展示答案，也将用户的选择接回任务。下面重绘了材料中的时间口径片段。'] },
      { title: '让共性体验进入多个产品', paragraphs: ['单个场景的 Demo 不能解决各子产品分别建设的问题。我继续统一导航、页面布局与交互规则，让用户切换能力时仍能认识到同一个平台。', '我借助 CloudAI Template 整理布局、间距与组件规范，并进入代码协作，将场景中的经验转成能随产品迭代继续使用的规则。'] },
    ],
    takeaway: '从一次回答，到一段能够被理解、被推进的任务体验。',
  },
  {
    slug: 'data-agent', number: '02', title: 'Data Agent', english: 'A workspace for analysis', category: '产品设计',
    summary: '把数据、协作过程与分析产物，组织成持续使用的工作台。', role: '设计负责人', status: 'draft',
    subtitle: '从一次自然语言分析，到持续使用的企业数据工作台。',
    introduction: '我从项目启动阶段负责产品设计，与产品经理、架构师和研发共同定义产品形态。随后围绕企业持续分析的需求，重构任务反馈、人机决策、工作台与成果交付。',
    responsibilities: ['0→1 产品框架', '执行过程与人机协同', '持续分析工作台', '报告多形态体验'],
    chapters: [
      { title: '按任务决定展示多少过程', paragraphs: ['简单问数与复杂分析需要不同的反馈。目标明确的查询，让用户更快看到结果；需要拆解与协作的任务，则展示计划、任务状态和中间产物。', '我推动组件流式反馈与分步计划，让第一步有效内容先出现，再逐步补齐后续计划。过程信息服务于当前的理解与判断。'] },
      { title: '在需要判断的地方，让用户介入', paragraphs: ['分析使用哪个收入字段，会改变结果的业务含义。我将这类歧义转成任务中的动态问询，把可选方案与说明放在当前上下文里。', '当执行可能影响业务性能时，设计还需要将风险转成明确的确认节点。交互将复杂执行与用户决策连接起来。'] },
      { title: '把数据、对话和产物放回同一工作台', paragraphs: ['企业分析不会随着一次回答结束。我重构了“上下文—对话—产物与过程”的工作台，让用户在同一会话中查看数据、推进分析并使用结果。', '从工作台结构到执行过程、阶段产物与报告多形态，我关注的是分析如何继续、依据如何回溯，以及结果如何进入下一步工作。'] },
    ],
    takeaway: '分析不止于得到一个答案，也在于让数据、判断与成果持续连接。',
  },
  {
    slug: 'cloudai', number: '03', title: 'CloudAI Design', english: 'Design for generation', category: '设计工程',
    summary: '将设计判断写进 Agent 可以使用的规则、组件与交付流程。', role: '核心成员 · 主导 GenUI', status: 'draft',
    subtitle: '让业务里的交互经验，成为可复用的设计能力。',
    introduction: '作为 CloudAI 核心成员，我主导 GenUI 工作，并参与贡献设计声明与组件规则。设计既要服务研发时的构建，也要服务运行时围绕用户意图生成的界面。',
    responsibilities: ['GenUI 体验主导', '设计声明与组件规则', '业务应用与代码协作', 'Playbook 动态交互章节'],
    chapters: [
      { title: '从任务状态，决定界面应该做什么', paragraphs: ['什么时刻需要用户补充条件，什么结果适合组织成图表或卡片，界面怎样把用户的决定接回任务——这些是我在 GenUI 中持续推进的问题。', '问数需要明确口径，导购需要比较方案。界面围绕当前任务组织，业务中的交互经验也成为规则与场景结构的输入。'] },
      { title: '将判断写进规则，而不只留下组件名称', paragraphs: ['我参与贡献设计声明与组件规则，说明适用条件、信息层级、布局、状态与交互边界，让设计经验可以被读取和使用。', 'CloudAI 的 Dev 与 Runtime 体系为这些工作提供位置。系统整体架构与全量工程资产是团队成果，我的工作围绕 GenUI、规则贡献与业务应用展开。'] },
      { title: '把实践变成可以分享的方法', paragraphs: ['我联合创作 Vibe Designing Playbook，独立撰写“动态交互”章节，并作为“设计工程”核心贡献者之一参与内容与网页版实现。', '业务项目提供问题，设计系统整理共性规则，公开章节进一步说明这些方法如何被设计师和开发者使用。'] },
    ],
    takeaway: '让设计判断从个人经验，走向能被团队和 Agent 使用的共同语言。',
  },
  {
    slug: 'cscw', number: '04', title: 'Agent 过程透明度研究', english: 'How much should an agent reveal?', category: '交互研究',
    summary: 'Agent 执行任务时，应该向用户展示多少过程信息？', role: '第一作者', status: 'draft',
    subtitle: '将产品里的交互问题，转成可以比较的研究条件。',
    introduction: '作为第一作者，我带领团队探索过程透明度对 AI Design Agent 用户体验的影响，负责研究问题与实验设计、用户研究、论文撰写及投稿，并代表团队赴挪威发表。',
    responsibilities: ['研究问题与实验设计', '用户研究', '论文撰写与投稿', 'CSCW Companion 2025 · Poster'],
    chapters: [
      { title: '先明确展示什么，再比较展示多少', paragraphs: ['除了最终产物，用户在等待与判断时还需要知道什么？我们先将过程拆分为可以表达的信息，围绕规划、执行与总结建立讨论框架。', '前期研究中，6 位 UX 专家参与识别过程信息，形成 10 项内容，再将呈现范围转成高、中、低三种条件。'] },
      { title: '用相同任务，比较三种透明度', paragraphs: ['用户研究采用被试内比较，40 位参与者观看三段海报生成的预录模拟视频。顺序使用拉丁方平衡，以 7 点量表测量信任、满意度和使用意愿。', '高透明度提供全部已识别的过程信息，中透明度保留关键进展，低透明度主要提供任务总结。这里的示意仅解释信息范围，未替代原始实验界面。'] },
      { title: '让结论保留它的适用边界', paragraphs: ['在这次海报生成模拟情境中，较高透明度获得更高的信任、满意度与使用意愿评分。研究为过程信息的价值提供了证据。', '预录材料与设计背景样本，也限制了结论向实时操作与一般人群的推广。折叠、可调与任务自适应是后续设计启示，仍需另行验证。'] },
    ],
    takeaway: '先理解用户此刻需要作出的判断，再决定何时提供哪些过程信息。',
  },
]
