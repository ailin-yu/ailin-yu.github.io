import { useReducedMotion } from 'motion/react'
import type { CSSProperties } from 'react'
import { ProjectCaseLayout } from '@/components/portfolio/ProjectCaseLayout'
import { ZoomableCaseImage } from '@/components/portfolio/ZoomableCaseImage'
import { ProjectCredits } from '@/components/portfolio/ProjectCredits'
import { caseHref } from '@/content/portfolio-catalog'
import { DataAgentStrategyIllustration } from '@/components/portfolio/DataAgentStrategyIllustration'
import { SectionTitle, DesignTitle, BulletTitle, ProjectVideo } from '@/components/portfolio/ProjectCaseMedia'

const strategies = [
  { number: '01', title: '降低使用门槛', copy: '通过开箱应用复用专业经验，降低从提问到产出的试错成本', figure: 'ready' as const },
  { number: '02', title: '灵活组织分析体验', copy: '问数直接呈现结果；深入分析提供过程与依据，让用户在关键处参与判断', figure: 'depth' as const },
  { number: '03', title: '构建企业级能力', copy: '连接企业数据与知识，支持自定义拓展，融入原有工作流', figure: 'connect' as const },
]

const applicationExamples = [
  { name: 'app-report', caption: '网页报告', bordered: true, alt: '网页报告产物示例', width: 1488, height: 837 },
  { name: 'app-infographic', caption: '信息图', bordered: true, alt: '信息图产物示例', width: 1600, height: 900 },
  { name: 'app-ppt-light', caption: 'PPT Light 主题', bordered: true, alt: 'PPT 默认浅色主题产物示例', width: 1280, height: 715 },
  { name: 'app-ppt-dark', caption: 'PPT Dark 主题', bordered: false, alt: 'PPT 深色主题产物示例', width: 1280, height: 715 },
]

// Opaque card bounds exclude asymmetric transparent shadow padding.
const humanCards = [
  { src: 'human-choice.webp', alt: '业务口径选择卡片', width: 2016, height: 1936, centerY: 928, visibleHeight: 1840 },
  { src: 'human-confirm.webp', alt: 'SQL 执行确认卡片', width: 2656, height: 1792, centerY: 880, visibleHeight: 1696 },
]

const patentOutcomes = [
  { title: 'GenReport：面向 LLM 的数据保真与视觉可控协同报告生成方法及系统', detail: '专利已受理 · 第一发明人' },
  { title: '一种多智能体并行任务的动态拓扑可视化及依赖干预方法与系统', detail: '专利待受理 · 第一发明人' },
  { title: 'AI Design Agent 的用户感知式过程信息展示方式', detail: '专利已受理' },
]

export default function DataAgentCasePage() {
  const reducedMotion = useReducedMotion()
  return <ProjectCaseLayout slug="data-agent" title="Data Agent" role="设计负责人" hero={<ProjectVideo src="/cases/data-agent/product-film.mp4" poster="/cases/data-agent/product-film.webp" label="Data Agent 产品介绍完整视频" />}>
          <section className="da-overview" id="da-overview" aria-label="产品介绍">
            <p>Data Agent 是一款企业级数据分析智能体，帮助业务人员和数据分析师利用企业数据快速获得业务洞察。它需要兼顾两类需求：业务人员需要在不会编写复杂 SQL 的情况下，快速获取支持业务判断的数据结果；数据分析师则需要核验结果、理解原因，并围绕问题持续深入探索。</p>
            <p>项目始于 2025 年 Agent 产品形态探索初期，许多交互方式仍待定义。我协助推动产品方向，与工程师协同 Coding，持续打磨产品细节。从产品落地到市场推广，每个环节都凝聚着我的心血。探索中形成的 Agent 透明度研究，也发表于 CSCW Companion 2025（第一作者），并沉淀了 3 项发明专利。</p>
            <ProjectCredits credits={[
              { label: '产品 & 交互设计', names: ['Ailin Yu'] },
              { label: '品牌 & 视觉设计', names: ['Yan Zhu'] },
            ]} />
          </section>
          <section className="da-strategy" id="da-strategy">
            <SectionTitle>Design Strategy</SectionTitle>
            <p className="da-strategy-summary">对于一款垂类的企业级 Agent，设计需要让专业分析易于开始、复杂过程可理解可掌控，并融入企业真实的业务流程。</p>
            <div className="da-strategy-grid">{strategies.map(item => <div className="da-strategy-item" key={item.number}><span className="da-strategy-number" lang="en">{item.number}</span><h3>{item.title}</h3><p>{item.copy}</p><DataAgentStrategyIllustration kind={item.figure} /></div>)}</div>
          </section>
          <section className="da-highlights" id="da-highlights">
            <SectionTitle>Design Highlights</SectionTitle>
            <section className="da-design da-apps" id="da-apps">
              <DesignTitle number="01">提供开箱即用的应用，降低使用门槛</DesignTitle>
              <div className="da-design-copy"><p>首页提供输入引导、示例数据和演示案例，帮助用户快速了解并体验产品能力。</p><p>将报告主题、视觉规范与分析编排经验沉淀为 Skill，内置于网页报告、信息图、PPT 等开箱即用的应用，帮助用户以更低的试错成本，获得分析逻辑清晰、视觉表达成熟的结果。</p></div>
              <figure className="project-figure da-apps-overview"><ZoomableCaseImage src={reducedMotion ? '/cases/data-agent/apps-overview-still.webp' : '/cases/data-agent/apps-overview.mp4'} alt="Data Agent 开箱应用总览" width={2629} height={1478} /></figure>
              <div className="da-media-grid da-apps-examples">{applicationExamples.map(item => <figure className={`project-figure${item.bordered ? ' da-app-example-bordered' : ''}`} key={item.name} data-application={item.name}><ZoomableCaseImage src={`/cases/data-agent/${item.name}${reducedMotion ? '-still.webp' : '.mp4'}`} alt={item.alt} width={item.width} height={item.height} /><figcaption>/ {item.caption}</figcaption></figure>)}</div>
            </section>
            <section className="da-design da-analysis" id="da-analysis">
              <DesignTitle number="02">根据用户意图，灵活组织分析体验</DesignTitle>
              <p className="da-design-copy">围绕快速问数和深度分析两类需求，提出按用户意图自动路由简单、复杂模式的策略。简单模式聚焦结果，深度分析按需展开计划、进展与依据，通过任务拓扑支持追踪与下钻子 Agent 执行详情，并在口径歧义或执行风险处引导用户确认。</p>
              <div className="da-transparency"><BulletTitle>任务驱动的透明度</BulletTitle><figure className="project-figure"><ZoomableCaseImage src={reducedMotion ? '/cases/data-agent/query-mode.webp' : '/cases/data-agent/query-mode.mp4'} alt="简单模式：问数后直接呈现分析结果" width={2000} height={1125} /><figcaption>/ 简单模式</figcaption></figure><figure className="project-figure"><ZoomableCaseImage src={reducedMotion ? '/cases/data-agent/complex-mode-still.webp' : '/cases/data-agent/complex-mode.mp4'} alt="复杂模式：展开分析计划、执行进展与依据" width={2016} height={1258} /><figcaption>/ 复杂模式</figcaption></figure></div>
              <div className="da-human"><BulletTitle>Human in the Loop</BulletTitle><p className="da-design-copy">当需求或业务口径不明确，或操作可能影响数据库性能时，Agent 会主动向用户确认，再继续执行。</p><div className="da-media-grid">{humanCards.map(card => <figure className="project-figure" key={card.src}><div className="da-media-slot da-human-card-frame" style={{ '--human-image-height': `${78 * card.height / card.visibleHeight}%`, '--human-center-y': `${100 * card.centerY / card.height}%` } as CSSProperties}><ZoomableCaseImage src={`/cases/data-agent/${card.src}`} alt={card.alt} width={card.width} height={card.height} /></div></figure>)}</div></div>
            </section>
            <section className="da-design da-enterprise" id="da-enterprise">
              <DesignTitle number="03">连接数据与业务语义，构建企业级能力</DesignTitle>
              <p className="da-design-copy">提供便捷的企业数据与知识接入体验，构建知识图谱让业务语义可理解、可追溯，帮助 Agent 更准确地分析。同时支持自定义 Agent 复用任务、钉钉多维表格内分析和 IM 结果推送，让 Agent 融入企业原有工作流。</p>
              <div className="da-media-grid da-enterprise-data-grid">
                <figure className="project-figure"><div className="da-enterprise-data-frame"><ZoomableCaseImage src={reducedMotion ? '/cases/data-agent/data-import-still.webp' : '/cases/data-agent/data-import.mp4'} alt="导入数据：上传文件或连接企业数据库" width={3000} height={1686} /></div><figcaption>/ 导入数据</figcaption></figure>
                <figure className="project-figure"><div className="da-enterprise-data-frame"><ZoomableCaseImage src={reducedMotion ? '/cases/data-agent/data-directory-still.webp' : '/cases/data-agent/data-directory.mp4'} alt="数据目录：浏览数据源与库表信息" width={2000} height={1125} /></div><figcaption>/ 数据目录</figcaption></figure>
              </div>
              <figure className="project-figure"><ZoomableCaseImage src={reducedMotion ? '/cases/data-agent/knowledge-graph-still.webp' : '/cases/data-agent/knowledge-graph.mp4'} alt="知识图谱：查看业务实体、关系与语义信息" width={3020} height={1694} /><figcaption>/ 知识图谱</figcaption></figure>
            </section>
          </section>
          <section className="da-results" id="da-results">
            <SectionTitle>Results</SectionTitle>
            <div className="da-result-row"><div className="da-result-copy"><h3 className="da-bullet-title"><span>2025.09</span><span>云栖大会正式发布</span></h3><p>由现阿里云 CTO 李飞飞于技术主论坛发布</p></div><figure className="project-figure"><ZoomableCaseImage src="/cases/data-agent/yunqi-launch.webp" alt="云栖大会 Data Agent 正式发布现场" width={3200} height={1800} /></figure></div>
            <div className="da-result-summary">
              <div className="da-result-summary-copy">
                <h3 className="da-bullet-title">研究与设计沉淀</h3>
                <p className="da-design-copy">Agent 过程透明度研究发表于 CSCW Companion 2025（第一作者）；产品设计探索同时沉淀了 3 项发明专利。</p>
                <a className="da-result-research-link" href={caseHref('cscw')}>查看 Agent 过程透明度研究<span aria-hidden="true">→</span></a>
              </div>
              <ul className="da-result-patents" aria-label="发明专利名称与状态">{patentOutcomes.map(patent => <li key={patent.title}><h4>{patent.title}</h4><p>{patent.detail}</p></li>)}</ul>
            </div>
          </section>
  </ProjectCaseLayout>
}
