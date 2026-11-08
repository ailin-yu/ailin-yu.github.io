import type { ProjectCase } from './types'

// Figure provenance: public/cases/cloudai/*sources.json.
export const cloudaiCase: ProjectCase = {
  slug: 'cloudai', title: 'CloudAI Design', role: '设计系统核心成员', state: 'draft', source: 'docs/projects/CloudAI-内容Spec.md',
  hero: { src: '/cases/cloudai/hero.webp', alt: 'CloudAI Design 设计工程资产：模板、组件与设计规则', width: 4246, height: 1518 },
  overview: [
    'Agent 可以生成页面和代码，但真实产品的信息层级、组件用法与交互边界仍需要设计判断。CloudAI Design 将这些经验沉淀为可调用的设计能力。',
    '研发生产时，Agent 根据需求调用设计规则、组件和模板，生成设计规格与页面代码；Agent 产品运行时，通过 CloudAI 提供的 GenUI 能力，根据当前任务和业务结果组织界面。',
    '作为项目核心成员，我与团队从 Data Agent、AIDBS 的实践中提炼设计声明与体验范式，并建设支撑 GenUI 的组件、模板及渲染规则。',
  ],
  credits: [{ label: '作者', names: ['Yan Zhu', 'Ailin Yu'] }],
  highlights: { label: '设计与实践', english: 'Design & Practice', items: [
    {
      id: 'cloudai-rules', title: '让设计能力进入开发过程', outlineLabel: '设计能力工程化', paragraphs: [
        '我们按设计的不同阶段拆解知识与资产，整理成 Agent 可以读取和使用的声明文件。',
        '再通过 Skill 编排，将这些声明接入从需求到代码的不同环节，让 Agent 按需调用相应的设计规则与资产。我们把这个过程称为 Design I/O。',
      ], media: [
        { src: '/cases/cloudai/design-io.png', alt: 'Design I/O：Agent 从产品需求生成 Design Spec 与代码，在相应环节调用设计规则、组件与模板，并注入 design token', width: 2374, height: 1844, caption: 'Design I/O · 在生成的不同环节提供相应的设计知识。' },
      ], subsections: [
        { id: 'cloudai-agent-components', title: '让 Agent 理解并使用组件', paragraphs: [
          '以预定义的 Agent Components 为例，Component.md 作为总入口，维护组件清单与路由，指向各组件的独立 Markdown 文档。每份文档写明适用场景、设计语义及对应源码，让 Agent 在选择组件时，也能获得相应的设计依据与实现方式。',
        ], media: [
          { src: '/cases/cloudai/agent-components.webp', alt: 'Agent Components：布局、消息、输入、执行与协作等 20 项 Agent 界面组件', width: 1484, height: 1060, caption: 'Agent Components' },
        ] },
      ],
    },
    {
      id: 'cloudai-genui', title: '让界面随任务动态组织', outlineLabel: 'GenUI 动态交互', paragraphs: [
        '在各类云场景中，Agent 给出结果后，用户往往还需要补充条件、比较方案或确认操作。GenUI 根据当前任务与业务结果，动态组合信息和操作入口，让用户在对话中理解结果并继续完成任务。',
        '解释性内容可继续使用自然语言，高频稳定的流程保留固定页面；当信息结构与操作需求随任务变化时，由 GenUI 动态组织界面。强事务、字段复杂的配置仍交由控制台承接。',
      ], subsections: [
        {
          id: 'cloudai-genui-comparison', title: 'CloudAI GenUI 的生成效果', paragraphs: [
            '下图以实例诊断场景为例，对比仅使用 shadcn 基础组件和接入 CloudAI GenUI 设计资产后的生成效果。两种结果都包含指标、建议与操作入口，可以从以下三个方面观察信息组织的差异。',
          ], comparisonNotes: [
            { title: '结论与依据', copy: '将异常结论、关键指标与分析发现分层组织，便于沿着结论查看依据。' },
            { title: '指标与时间', copy: '用时间趋势呈现指标变化，帮助理解异常出现的过程。' },
            { title: '建议与操作', copy: '将建议、风险提示与确认入口成组呈现，便于在了解影响后作出决定。' },
          ], columns: true, media: [
            { src: '/cases/cloudai/genui-before-cropped.svg', alt: '仅使用 shadcn 基础组件的诊断生成效果：基础卡片、仪表和推荐操作', width: 3024, height: 3490, caption: '仅使用 shadcn 基础组件。' },
            { src: '/cases/cloudai/genui-after.webp', alt: '接入 CloudAI GenUI 设计资产的诊断生成效果：分析、发现、洞察和操作分层，趋势、SQL、风险与确认成组呈现', width: 3200, height: 3776, caption: '接入 CloudAI GenUI 设计资产。' },
          ],
        },
        {
          id: 'cloudai-genui-assets', title: '构建 GenUI 设计资产', paragraphs: [
            '社区已有 json-render、A2UI、OpenUI 等 GenUI 开源方案，可结合 shadcn 等组件库生成交互界面。云场景还需要表达业务含义与任务关系：例如在实例诊断中，结论需要有指标和趋势支撑，操作建议需要同时说明影响与确认方式。',
            '这些关系需要进入可复用的设计资产。我们在通用组件之上扩展云业务组件，将相互关联的信息与操作沉淀为具有业务语义的 Block；再通过 GenUI Template 示范典型信息结构，配合使用规则，指导 Agent 选择与组合组件。',
          ], media: [
            { src: '/cases/cloudai/genui-assets.webp', alt: 'GenUI 共享设计资产：组件注册为 Catalog，包含基础组件、业务组件与 Block，并以 Template 提供任务结构', width: 3200, height: 1644, caption: 'GenUI 设计资产的构成' },
          ],
        },
        {
          id: 'cloudai-genui-contract', title: '让动态组合遵循设计边界', paragraphs: [
            'Agent 根据任务决定呈现哪些信息、如何组织层级，并输出结构化的界面描述；客户端将其映射到已定义的组件，由组件实现落实品牌样式、布局约束与交互行为。可用组件与字段由组件目录（Catalog）限定，结构规则负责检查描述是否有效。',
            '内容可以随任务变化，关键的视觉与交互规则仍由设计资产承接。结构校验不判断业务结论，数据与结果仍来自实际业务执行。',
          ], media: [
            { src: '/cases/cloudai/genui-declarative.webp', alt: '声明式生成：Agent 输出组件、层级与数据的结构化 Spec，通过限定组件、字段与操作的 Catalog 渲染界面', width: 2674, height: 1162, caption: '声明式生成 · Agent 组织内容，客户端确定呈现。' },
          ],
        },
      ],
    },
    {
      id: 'cloudai-business', title: '把设计资产带入真实项目', outlineLabel: '项目协作与复用', paragraphs: [
        'CloudAI 的设计工程已接入 Data Agent、AIDBS 等项目仓库，支撑 AI Native 的协同工作流。已有资产能够覆盖的需求，团队共享规则完成生成与评审，设计按需参与修改；需要探索新体验的关键场景，设计从需求与原型阶段深入参与，推进到代码交付。这两类协作工作流已被 10+ 项目复用。',
      ], subsections: [
        { id: 'cloudai-business-integration', title: '标准化需求：共享规则，按需介入', paragraphs: [
          '通过 Agent.md 将 CloudAI 设计工程接入仓库级规则，PD、研发与设计在同一代码仓库中使用 Agent 时，都能调用并遵循同一套设计知识。',
          '研发据此生成功能界面，设计主要参与代码 CR。需要调整时，再在独立分支中交付修改，经前端 CR 后合并，并将共性问题回补到设计声明与执行契约。',
        ], media: [
          { src: '/cases/cloudai/workflow-standard.png', alt: '标准化需求工作流：研发通过 CloudAI 开发界面，设计参与代码 CR，按需在独立分支修改，并反哺设计声明与执行契约', width: 2926, height: 1000 },
        ] },
        { id: 'cloudai-business-spec', title: '关键场景：迭代原型，推进代码交付', paragraphs: [
          '对于需要探索新体验的场景，设计先借助 CloudAI 生成或补全 UX Spec，再结合关键 Figma 设计迭代原型代码。可运行的预发 Demo 用于与产研共同评审，直接在真实界面中对齐体验与实现；最终交付 View 层代码与对应分支，经前端 CR 后合并。',
        ], media: [
          { src: '/cases/cloudai/workflow-spec.png', alt: '关键场景工作流：从 UX Spec、原型与关键 Figma 设计，到多轮迭代、可运行预发 Demo、View 层代码及分支交付', width: 4238, height: 852 },
        ] },
      ],
    },
  ] },
  results: { label: '应用与开放', english: 'Adoption & Sharing', summary: 'CloudAI 的设计能力已应用于阿里云 AIDBS 等 20+ 项目，并接入 AgentScope 生态，让具体项目中积累的设计经验能够持续被复用。', content: [
    { kind: 'paragraph', text: '为了让更多设计师与开发者使用其中的通用能力，我们将移除业务相关内容后的精简版本开源为 CloudAI Design Toolkits。该版本可通过 npm 安装使用，也已上架千问办公的专家套件。' },
    { kind: 'code', code: 'npm i @cloudai-design/oneskill', label: 'npm 安装命令' },
    { kind: 'paragraph', text: '我们也将实践中的设计方法与思考整理成文，收录于阿里云 AI Agent Handbook 白皮书。相关经验沉淀为 Vibe Designing Playbook，并在 GitHub 开源，供更多团队参考。' },
  ] },
  links: [
    { label: 'CloudAI Design Toolkits · npm', href: 'https://www.npmjs.com/package/@cloudai-design/oneskill' },
    { label: 'AI Agent Handbook 白皮书', href: 'https://github.com/aliyun/ai-agent-handbook/blob/main/06-case-study/%E7%AC%AC%2026%20%E7%AB%A0%E3%80%80%E8%AE%BE%E8%AE%A1%E5%B7%A5%E7%A8%8B/GenUI%EF%BC%9A%E8%AE%A9%20Agent%20%E4%BB%8E%E7%BB%99%E5%87%BA%E7%AD%94%E6%A1%88%E8%B5%B0%E5%90%91%E4%BA%A4%E4%BB%98%E7%BB%93%E6%9E%9C.md' },
  ],
}
