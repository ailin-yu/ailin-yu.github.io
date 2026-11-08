import { useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, RotateCcw } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'
import { SiteFooter } from '@/components/portfolio/SiteChrome'
import { cloudaiScenes, cloudaiLayers, cloudaiContributions } from '@/content/cloudai'
import '@/styles/cloudai-case.css'
import '@/styles/case-narrative.css'

function CaseImage({ src, alt, width, height, priority = false, className = '' }: { src: string; alt: string; width: number; height: number; priority?: boolean; className?: string }) {
  const reduced = useReducedMotion()
  return <motion.div className={`cloudai-media ${className}`} initial={priority || reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: reduced ? 0 : .4, ease: [.16, 1, .3, 1] }}><img src={src} width={width} height={height} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : 'auto'} decoding="async" /></motion.div>
}

function TaskPreview() {
  return <div className="cloudai-scene-sequence">{cloudaiScenes.filter(scene => scene.id !== 'understand').map(scene => <figure className={`cloudai-scene cloudai-scene-${scene.id}`} key={scene.id}><div className="cloudai-scene-heading"><h3 className="type-heading-h3">{scene.label}</h3><span>{scene.source}</span></div><CaseImage src={scene.image} alt={scene.alt} width={scene.width} height={scene.height} /><figcaption>{scene.task}</figcaption><p className="cloudai-design-point-label">从方案中整理的设计要点</p><ul className="cloudai-design-points">{scene.rules.map(rule => <li key={rule}>{rule}</li>)}</ul></figure>)}</div>
}

function RuleDemo() {
  const [basis, setBasis] = useState('order_date')
  const [note, setNote] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const reset = () => { setBasis('order_date'); setNote(''); setConfirmed(false) }
  return <figure className="cloudai-rule-demo">
    <div className="cloudai-demo-surface"><div className="cloudai-demo-topline"><span>交互演示</span><button onClick={reset} aria-label="重置交互演示"><RotateCcw size={16} aria-hidden />重置</button></div>
      <form onSubmit={event => { event.preventDefault(); setConfirmed(true) }}>
        <fieldset disabled={confirmed}><legend>计算的时间基准是什么？</legend>{[{ id: 'order_date', title: '订单创建时间' }, { id: 'pay_time', title: '支付时间' }].map(option => <label className={`cloudai-radio ${basis === option.id ? 'is-selected' : ''}`} key={option.id}><input type="radio" name="cloudai-time-basis" value={option.id} checked={basis === option.id} onChange={() => setBasis(option.id)} /><span><strong lang="en">{option.id}</strong><span>{option.title}</span></span></label>)}<label className="cloudai-note-label" htmlFor="cloudai-context-note">补充信息 <span>选填</span></label><textarea id="cloudai-context-note" value={note} onChange={event => setNote(event.target.value)} placeholder="补充统计要求" maxLength={200} rows={2} /></fieldset>
        <div className="cloudai-demo-submit"><p role="status">{confirmed ? <><Check size={17} aria-hidden /> 已确认{basis === 'order_date' ? '订单创建时间' : '支付时间'}{note.trim() ? '，并保留补充信息。' : '。'}</> : '确认后继续任务。'}</p><button className="cloudai-primary-button" type="submit" disabled={confirmed}>{confirmed ? '已确认' : '确认选择'}<ArrowRight size={16} aria-hidden /></button></div>
      </form>
    </div>
    <div className="cloudai-rule-source"><CaseImage src="/cases/cloudai/clarification-source.webp" alt="AIDBS 历史时间口径澄清方案" width={826} height={667} /></div><figcaption>本页独立演示 · 依据上方历史时间口径方案，非生产规则。</figcaption>
  </figure>
}

function SectionHeading({ title, note }: { title: string; note?: string }) {
  return <header className="cloudai-section-heading"><h2 className="type-heading-h3">{title}</h2>{note && <p>{note}</p>}</header>
}

export default function CloudaiCasePage() {
  return <><main id="main-content" className="cloudai-case" tabIndex={-1}><article aria-labelledby="cloudai-title" className="cloudai-wrap cloudai-shell">
    <a className="cloudai-back" href="#works"><ArrowLeft size={16} aria-hidden />全部作品</a>
    <header className="cloudai-intro"><h1 id="cloudai-title" className="type-heading-h1" lang="en">CloudAI Design</h1><p className="cloudai-project-summary">阿里云 · 设计系统核心成员 · 主导 GenUI</p><p className="case-story-lead">让设计成为 Agent 可调用的工程资产，连接研发与运行时。</p></header>

    <section className="case-direction cloudai-context-intro" id="cloudai-context" aria-labelledby="cloudai-context-title"><span className="case-direction-label">问题与机制</span><h2 id="cloudai-context-title">让设计判断，贯穿研发与运行。</h2><p className="case-decision-note">研发时生成产品页面，运行时根据任务生成界面。两种情境需要不同的输入与约束，也需要能被读取、调用和检查的设计经验。</p></section>

    <section id="cloudai-decisions" className="cloudai-section cloudai-opening" aria-label="Dev 与 Runtime 双态能力"><div className="cloudai-dual-assets"><figure><div className="cloudai-scene-heading"><h2 className="type-heading-h3" lang="en">Dev</h2><span>研发时 · 生成产品页面</span></div><CaseImage src="/cases/cloudai/dev-runtime-source.webp" alt="原始汇报中的 CloudAI Design 工程资产：设计规则、模板与组件。" width={2200} height={790} priority /><figcaption>设计声明、组件与模板，进入产品研发。</figcaption></figure><figure><div className="cloudai-scene-heading"><h2 className="type-heading-h3" lang="en">Runtime</h2><span>运行时 · 按任务生成界面</span></div><CaseImage src="/cases/cloudai/component-catalog.webp" alt="原始 CloudAI GenUI 目录中的运行时组件。" width={1800} height={1036} priority /><figcaption>场景、界面单元与约束，承接用户意图。</figcaption></figure></div></section>

    <div className="case-direction-copy cloudai-context-details"><p><strong>研发时，规则需要进入生成与检查</strong>当 Agent 参与页面开发，设计要求需要被清楚表达、调用和检查。团队把设计声明、组件、模板与工程链路连接起来，让同一套要求进入实际交付。</p><p><strong>运行时，界面需要回应任务变化</strong>条件澄清、分析结果和方案选择需要不同的表达。我主导 GenUI，围绕用户意图与任务状态组织动态界面，同时参与设计声明与组件规则，把业务经验带入共性资产。</p></div>

    <section id="cloudai-rules" className="cloudai-section"><SectionHeading title="从意图到工程交付" note="把适用条件、组件选型和检查要求，连接到同一条工程链。" />
      <figure className="cloudai-dev-flow"><CaseImage src="/cases/cloudai/dev-design-io.webp" alt="CloudAI 团队原始工程链路：需求经 Design Spec、设计规则与组件 Skill，生成代码，再由检查与评估回到验收。" width={2200} height={1770} /><figcaption>团队工程链路 · 原始汇报取景。我参与设计声明与组件规则。</figcaption></figure>
    </section>

    <section id="cloudai-runtime" className="cloudai-section"><SectionHeading title="按任务生成界面" note="我主导 GenUI：根据意图与任务状态，组织此刻需要的信息和操作。" /><figure className="cloudai-runtime-figure"><CaseImage src="/cases/cloudai/runtime-structure.webp" alt="CloudAI Design GenUI 原始运行结构图" width={1800} height={1131} /><figcaption>团队 Runtime 结构 · 场景、组件、约束与渲染共同支撑生成。</figcaption></figure>
      <div className="cloudai-business-examples"><p className="case-decision-note">资产是否有用，要回到具体任务中看：条件不清时怎样询问，方案不同怎样比较，用户的选择又怎样接回任务。下面是来自 AIDBS 的两类真实方案。</p><TaskPreview /><a className="cloudai-inline-link" href="#/projects/aidbs">在 AIDBS 中看完整任务 <ArrowUpRight size={16} aria-hidden /></a></div>
      <details className="cloudai-source-disclosure cloudai-demo-disclosure"><summary>试用时间口径澄清<span aria-hidden>＋</span></summary><RuleDemo /></details>
      <details className="cloudai-source-disclosure"><summary>资产分层与使用路径<span aria-hidden>＋</span></summary><div className="cloudai-layer-list" aria-label="Runtime 资产层级整理">{cloudaiLayers.map(layer => <div className="cloudai-layer" key={layer.name}><h3 lang="en">{layer.name}</h3><strong>{layer.title}</strong><p>{layer.description}</p></div>)}</div><figure className="cloudai-two-modes"><div className="cloudai-mode-lanes"><div><h3>研发时</h3><p>需求与规格</p><ArrowRight aria-hidden /><p>规则 · 组件 · 检查</p><ArrowRight aria-hidden /><strong>页面与代码</strong></div><div><h3>运行时</h3><p>意图与任务状态</p><ArrowRight aria-hidden /><p>场景 · 单元 · 约束</p><ArrowRight aria-hidden /><strong>动态界面</strong></div></div><figcaption>依据团队机制整理。</figcaption></figure></details>
    </section>

    <section id="cloudai-practice" className="cloudai-section"><SectionHeading title="把实践开放出来" note="参与 CloudAI Dev Toolkit 与 Vibe Designing Playbook 双开源，负责「动态交互」章节。" /><figure><CaseImage src="/cases/cloudai/open-source.webp" alt="原始汇报中的 Vibe Designing Playbook 封面与目录，包含设计工程、动态交互和自我进化章节。" width={2100} height={2160} /><figcaption>Playbook 原始封面与目录 · 团队设计能力同时接入 AgentScope 生态。</figcaption></figure>
      <a className="cloudai-playbook" href="https://github.com/Alibaba-Cloud-Design/vibe-designing-playbook" target="_blank" rel="noreferrer"><div><span>联合创作 · 负责动态交互</span><h3 className="type-heading-h3" lang="en">Vibe Designing Playbook</h3></div><span className="cloudai-playbook-link">阅读公开仓库 <ArrowUpRight size={18} aria-hidden /></span></a>
      <a className="cloudai-inline-link" href="https://github.com/aliyun/ai-agent-handbook/blob/main/06-case-study/%E7%AC%AC26%E7%AB%A0%20%E8%AE%BE%E8%AE%A1%E5%B7%A5%E7%A8%8B/GenUI%EF%BC%9A%E8%AE%A9%20Agent%20%E4%BB%8E%E7%BB%99%E5%87%BA%E7%AD%94%E6%A1%88%E8%B5%B0%E5%90%91%E4%BA%A4%E4%BB%98%E7%BB%93%E6%9E%9C.md" target="_blank" rel="noreferrer">收录于 AI Agent Handbook 的 GenUI 实践 <ArrowUpRight size={16} aria-hidden /></a>
    </section>

    <section id="cloudai-contribution" className="cloudai-section cloudai-ending"><SectionHeading title="我的贡献" /><div className="cloudai-contribution-list">{cloudaiContributions.map(item => <div key={item.scope}><h3>{item.scope}</h3><span>{item.role}</span><p>{item.detail}</p></div>)}</div>
      <details className="cloudai-source-disclosure cloudai-evidence-notes"><summary>来源与贡献边界<span aria-hidden>＋</span></summary><p>Dev 资产、Design I/O、Runtime 与开源配图来自原始团队汇报 IMG_3917–3919、3922。拍屏取景保留原内容，部分文字有摩尔纹。问数与资源方案为 AIDBS 不同任务的原生帧；本页澄清演示独立编写，不代表生产规则或精确调用链。</p><p>主导 GenUI、参与设计声明与组件规则，依据本人既有确认；核心成员身份、参与双开源与负责动态交互章节，依据指定 Figma 产品简历。完整双态基座与工程资产是团队成果。</p><p>简历记录应用于 20+ 产品项目、Toolkit 累计下载 8270 次、Playbook 155 Stars；这些是团队成果的材料快照，不是个人增长归因或实时数据。原汇报 9/30 记为 150 Stars，保留各自时间口径。</p></details>
    </section>
    <div className="cloudai-related"><a href="#/projects/ai-database"><span>产品判断</span><h2 className="type-heading-h3" lang="en">AIDBS <ArrowUpRight size={24} aria-hidden /></h2></a><a href="#/projects/data-agent"><span>任务协作</span><h2 className="type-heading-h3" lang="en">Data Agent <ArrowUpRight size={24} aria-hidden /></h2></a></div>
  </article></main><SiteFooter compact /></>
}
