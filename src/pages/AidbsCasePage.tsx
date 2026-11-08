import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Play, Plus } from 'lucide-react'
import { SiteFooter } from '@/components/portfolio/SiteChrome'
import { motion, useReducedMotion } from 'motion/react'
import { aidbsDiagnosisVersions, aidbsEngineeringWorkflow, aidbsImageSizes, aidbsPriorities, aidbsQueries } from '@/content/aidbs'
import '@/styles/aidbs-case.css'
import '@/styles/case-narrative.css'

const media = '/cases/aidbs/'

function jump(id: string) {
  const element = document.getElementById(id)
  if (id === 'main-content') element?.focus({ preventScroll: true })
  if (element) window.scrollTo({ top: Math.max(0, window.scrollY + element.getBoundingClientRect().top - 108), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

function SectionHeading({ title, note }: { title: string; note?: string }) {
  return <header className="aidbs-section-heading"><h2>{title}</h2>{note && <p>{note}</p>}</header>
}

function SourceImage({ file, preview, alt, className = '', eager = false }: { file: string; preview?: string; alt: string; title: string; className?: string; eager?: boolean }) {
  const reduced = useReducedMotion()
  const [width, height] = aidbsImageSizes[preview || file]
  return <motion.div className={`aidbs-source-image ${className}`} initial={eager || reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: reduced ? 0 : .4, ease: [.16, 1, .3, 1] }}><img src={`${media}${preview || file}`} alt={alt} width={width} height={height} loading={eager ? 'eager' : 'lazy'} decoding="async" /></motion.div>
}

function Film({ poster, video, label, caption, hero = false }: { poster: string; video: string; label: string; caption: string; hero?: boolean }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const element = videoRef.current
    if (!playing || !element) return
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) element.pause() })
    observer.observe(element)
    const pauseWhenHidden = () => { if (document.hidden) element.pause() }
    document.addEventListener('visibilitychange', pauseWhenHidden)
    const details = element.closest('details')
    const pauseWhenCollapsed = () => { if (details && !details.open) element.pause() }
    details?.addEventListener('toggle', pauseWhenCollapsed)
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', pauseWhenHidden); details?.removeEventListener('toggle', pauseWhenCollapsed) }
  }, [playing])
  return <figure className={`aidbs-film ${hero ? 'aidbs-hero-film' : ''}`}><div className="aidbs-film-stage">{playing ? <video ref={videoRef} src={`${media}${video}`} poster={`${media}${poster}`} width={hero ? 1920 : 1600} height={hero ? 1080 : 900} autoPlay controls muted={!hero} playsInline preload="none" aria-label={label} /> : <><img src={`${media}${poster}`} alt={label} width={hero ? 1920 : 1600} height={hero ? 1080 : 900} loading={hero ? 'eager' : 'lazy'} decoding="async" /><button className="aidbs-play" onClick={() => setPlaying(true)}><Play size={16} fill="currentColor" aria-hidden />{label}</button></>}</div><figcaption>{caption}</figcaption></figure>
}

function QueryExplorer() {
  const [selected, setSelected] = useState(0)
  const current = aidbsQueries[selected]
  const keyScenarios = aidbsQueries.filter((_, i) => [0, 1, 3, 4, 7].includes(i))
  return <div className="aidbs-query-study"><div className="aidbs-query-explorer"><div className="aidbs-query-chart"><div className="aidbs-chart-heading"><span>场景</span><span>独立问法数*</span></div><div className="aidbs-query-choices" role="group" aria-label="选择 Query 场景">{keyScenarios.map(item => {
    const index = aidbsQueries.indexOf(item)
    return <button key={item.name} className={`aidbs-query-row ${selected === index ? 'is-active' : ''}`} aria-pressed={selected === index} aria-controls="aidbs-query-result" onClick={() => setSelected(index)}><span>{item.name}</span><span className="aidbs-bar-track" aria-hidden><span style={{ width: `${item.count / 118 * 100}%` }} /></span><span className="aidbs-query-count" lang="en">{item.count}</span><ArrowRight size={14} aria-hidden /></button>
  })}</div></div><div className="aidbs-query-reading" id="aidbs-query-result" aria-live="polite"><div className="aidbs-query-intent"><span className="aidbs-small">{('paraphrase' in current && current.paraphrase) ? '意图摘要' : '材料摘录'}</span><blockquote>{('paraphrase' in current && current.paraphrase) ? current.query : `“${current.query}”`}</blockquote></div><div className="aidbs-query-gap"><span className="aidbs-path-dot" aria-hidden /><div><span className="aidbs-small">能力断点</span><p>{current.gap}</p></div></div><div className="aidbs-query-next"><span className="aidbs-path-dot" aria-hidden /><div><span className="aidbs-small">待承接</span><ol>{current.steps.map(step => <li key={step}>{step}</li>)}</ol></div></div></div></div><p className="aidbs-caption">*原图标签为“独立问法数”。十类合计 567 次场景命中，同一 Query 可重复命中。</p><details className="aidbs-details"><summary>完整十类场景与来源<Plus size={16} aria-hidden /></summary><div className="aidbs-full-queries">{aidbsQueries.map(item => <div key={item.name}><span>{item.name}</span><span lang="en">{item.count}</span><p>{item.gap}</p></div>)}</div><div className="aidbs-source-links"><SourceImage file="query-ranking-source.webp" title="Query 场景与能力断点原图" alt="原材料中的十类场景、独立问法数、典型 Query 和能力断点" /></div></details></div>
}

function Priorities() {
  return <figure className="aidbs-priorities"><div className="aidbs-priority-labels"><span>需求分布</span><span>567 次场景命中中的占比</span><span>材料中的 P0 方向</span></div>{aidbsPriorities.map(item => <div className="aidbs-priority-row" key={item.name}><div><h3>{item.name}</h3><span className="aidbs-small">{item.scope}</span></div><div className="aidbs-priority-distribution"><div className="aidbs-priority-bar" style={{ width: `${item.count / 231 * 100}%` }}><span lang="en">{item.share}</span></div><span className="aidbs-priority-count">{item.count} 次命中</span></div><div className="aidbs-priority-direction"><ArrowRight size={16} aria-hidden /><div><strong>{item.priority}</strong></div></div></div>)}<figcaption>需求分析视图 · P0 沿用原材料标注，频次不代表完整优先级评审。</figcaption></figure>
}

function ProductForm() {
  return <><Film poster="platform-poster.webp" video="platform-preview.mp4" label="查看调用与反馈 · 11 秒" caption="数据准备：从任务输入到 DataCollector 调用、数据源连接。完整演示 00:21–00:32。" /><details className="aidbs-details"><summary>入口与导航<Plus size={16} aria-hidden /></summary><figure className="aidbs-navigation-example"><SourceImage file="navigation-detail.webp" title="统一入口与子 Agent 导航" alt="AIDBS 真实导航设计，在统一入口中保留子 Agent 选择菜单" /><figcaption>统一任务入口下，保留专业子 Agent 的直接入口。</figcaption></figure><div className="aidbs-entry-comparison" aria-label="产品入口路径对照"><div className="aidbs-old-path"><span>原有路径</span><ol><li>表达任务</li><li>自己判断 Agent</li><li>切换入口</li><li>适应各自交互</li></ol></div><div className="aidbs-proposed-path"><span>探索形态</span><ol><li>表达任务</li><li><strong>统一任务入口</strong></li><li>专业子 Agent</li><li><strong>反馈与 GenUI</strong></li></ol></div></div></details></>
}

function Diagnosis() {
  const [version, setVersion] = useState(2)
  const [compare, setCompare] = useState(false)
  const current = aidbsDiagnosisVersions[version]
  const comparing = compare && version !== 0
  const renderVersion = (item: typeof aidbsDiagnosisVersions[number]) => <figure key={item.label} className="aidbs-diagnosis-version"><SourceImage file={item.file} title={`${item.label} · 完整诊断方案`} alt={item.alt} /><figcaption lang="en">{item.label}</figcaption></figure>
  return <div className="aidbs-diagnosis"><div className="aidbs-diagnosis-controls"><div className="aidbs-version-picker" role="group" aria-label="诊断方案版本">{aidbsDiagnosisVersions.map((item, index) => <button key={item.label} aria-pressed={version === index} onClick={() => setVersion(index)} lang="en">{item.label}</button>)}</div>{version !== 0 && <button className="aidbs-compare-toggle" onClick={() => setCompare(!compare)} aria-pressed={compare} aria-controls="aidbs-diagnosis-views">并排对照</button>}</div><p className="aidbs-version-note" aria-live="polite">{current.note}</p><div id="aidbs-diagnosis-views" className={`aidbs-diagnosis-layout ${comparing ? 'is-comparing' : ''}`}>{comparing && renderVersion(aidbsDiagnosisVersions[0])}{renderVersion(current)}</div><p className="aidbs-caption">历史方案 · 图内优化数值为预估。</p></div>
}

function SharedFrameComparison() {
  const [after, setAfter] = useState(true)
  return <div className="aidbs-shared-frame"><div className="aidbs-frame-picker" role="group" aria-label="子 Agent 框架对照"><button aria-pressed={!after} aria-controls="aidbs-shared-frame-image" onClick={() => setAfter(false)}>整合前</button><button aria-pressed={after} aria-controls="aidbs-shared-frame-image" onClick={() => setAfter(true)}>整合后</button></div><figure id="aidbs-shared-frame-image" aria-live="polite"><SourceImage file={after ? 'shared-frame-after.webp' : 'shared-frame-before.webp'} title="Analytics Agent 框架对照" alt={after ? '整合后的 Analytics Agent 界面，使用 AIDBS 统一导航、Data Agent 路径与任务输入区域' : '整合前的 Analytics Agent 界面，左侧导航、产品标识与任务输入区采用原有布局'} /><figcaption>{after ? '整合后：统一导航与任务区的布局和交互规则。' : '整合前：各子 Agent 独立组织导航与任务区。'}<span className="aidbs-image-origin">Analytics Agent · 历史汇报实拍裁切</span></figcaption></figure></div>
}

function EngineeringWorkflow() {
  return <ol className="aidbs-engineering-flow" aria-label="AI Native 设计工程工作流">{aidbsEngineeringWorkflow.map((step, index) => <li key={step.label}><h3 lang={step.lang}>{step.label}</h3><p>{step.note}</p>{index < aidbsEngineeringWorkflow.length - 1 && <ArrowRight size={16} aria-hidden />}</li>)}</ol>
}

function EvidenceNotes() {
  return <details className="aidbs-details aidbs-sources"><summary>材料来源、统计口径与贡献边界<Plus size={18} aria-hidden /></summary><div className="aidbs-source-copy"><p>依据指定简历、本人确认的工作、项目汇报、Query 分析与演示素材整理。Query 交互图、路径与工作流为依据材料的解释性整理；需求分布原图、界面与实拍裁切均来自真实历史材料。</p><ul><li>Query 分析与方向：IMG_3997–3999。原图“独立问法数”按场景汇总为 567 次命中，类别可重叠，不是 567 位用户或去重 Query。40.7% / 33.2% / 26.1% 以这 567 次命中为分母。材料记录“72% 含明确使用或执行意图”，样本范围、时间窗口与分母未明，不作为效果指标。P0 为材料标注，现有材料不包含完整优先级评审、投入和排期。</li><li>形态与界面：IMG_3910–3912，Markdown / AfterGenUI1 / AfterGenUI2 源图。界面承接理解、条件确认和选择；查询、创建、扫描、变更及结果反馈仍依赖 Agent 与后端。图中优化数值为方案预估，不是实测收益。</li><li>视频分别展示：开篇为本人指定的 AIDBS-合并.mp4 完整 1 分 28 秒，保留原始时序与音轨，仅作网页转码；任务框架复用其中 00:21–00:32 的连续选段；问数为复购率澄清，与分析中的订购数 Query 是不同任务；导购只展示方案比较与选用，不代表实例已创建或交易完成。各段不作为同一次任务的端到端验证。</li><li>推进与建设：IMG_3908、3913–3915。Analytics Agent 整合前后两图裁自 IMG_3913，仅作透视校正，保留实拍纹理；呈现该历史界面的框架调整，不代表本站新实现了产品。指定简历记录支撑 34 个功能板块、2026 年 6 月以来累计贡献 11 万+ 行代码。34 是体验与实现的支撑范围，代码数是简历记录的统计，未展开逐仓统计口径，不等于有效代码量、质量收益或个人独立上线成果。原汇报另记录 5 个仓库、4 位前端同源复用，属于团队建设背景。现有材料未提供完整任务完成率、耗时和满意度验证。</li><li>正式身份为阿里云体验设计师、数据库工具线设计负责人。各场景上线阶段、具体模块与后端实现分工尚待逐项核实。团队发布与他人署名产物不归为个人独立完成。</li></ul><div className="aidbs-source-links"><SourceImage file="query-distribution-source.webp" title="Query 三层分布原图" alt="业务面、管控面和数据面的场景命中与 P0 标记原图" /><SourceImage file="query-ranking-source.webp" title="Query 排名与断点原图" alt="十类场景、典型 Query 与能力断点原图" /></div></div></details>
}

export default function AidbsCasePage() {
  return <><main className="aidbs-case type-body-default" id="main-content" tabIndex={-1}><article className="aidbs-shell"><header className="aidbs-intro"><a className="aidbs-back" href="#works"><ArrowLeft size={16} aria-hidden />全部作品</a><h1><span lang="en">AIDBS</span><span className="aidbs-project-name">AI 原生数据库服务</span></h1><div className="aidbs-role">阿里云 · 数据库工具线设计负责人</div><p className="case-story-lead">从需求与能力缺口出发，推动统一任务体验，并直接参与代码实现。</p></header>
    <Film hero poster="aidbs-full-poster.webp" video="aidbs-full.mp4" label="播放完整演示 · 1:28" caption="AIDBS · 产品演示" />
    <section className="case-direction" id="aidbs-direction" aria-labelledby="aidbs-direction-title"><span className="case-direction-label">从问题，到产品方向</span><h2 id="aidbs-direction-title">用户按任务提问，<br />产品却按能力分散建设。</h2><div className="case-direction-copy"><p><strong>先重新理解问题</strong>查询、资源管理与诊断由不同 Agent 承接，用户需要先判断该找谁。对照真实 Query 与已有能力后，我看到任务还会停在条件不清、执行未承接或结果难以判断的环节。</p><p><strong>让任务成为组织产品的依据</strong>我推动用统一入口承接意图，同时保留专业子 Agent 的分工。GenUI 用来组织条件确认、结果理解与方案选择；实际查询、创建和变更仍需要 Agent 与后端执行能力。</p></div></section>
    <section className="aidbs-section" id="aidbs-problem"><SectionHeading title="任务停在执行之前" note="分析 Agent 输入输出，结合代码盘点现有能力，找到任务断点。" /><QueryExplorer /></section>
    <section className="aidbs-section" id="aidbs-priority"><SectionHeading title="从需求分布判断建设方向" note="查询分析、资源接入与资产治理，分别落在三层诉求中。" /><figure><SourceImage file="query-distribution-source.webp" title="Query 三层诉求与建设方向" alt="真实 Query 分析原图：业务面231次、管控面188次、数据面148次场景命中，分别标记查询分析、资源接入和资产治理P0方向" /><figcaption>原始需求分析 · 567 次场景命中，可重叠。P0 沿用材料标注，频次不代表完整优先级评审。</figcaption></figure><details className="aidbs-details"><summary>三层诉求与 P0 方向<Plus size={16} aria-hidden /></summary><Priorities /></details></section>
    <section className="aidbs-section" id="aidbs-form"><SectionHeading title="统一入口，保留专业分工" note="让用户从任务开始，让专业能力在统一框架中被调用。" /><p className="case-decision-note">这里的取舍是减少寻找与切换入口的成本，同时保留专业子 Agent 的直接入口与能力边界。统一体验需要与能力建设一起推进。</p><ProductForm /></section>
    <section className="aidbs-section aidbs-solutions" id="aidbs-solutions"><SectionHeading title="按任务状态组织交互" note="按意图与任务状态生成界面，分别承接澄清、判断与操作。" />
      <div className="aidbs-solution"><div className="aidbs-solution-heading"><h3>先确认统计口径</h3></div><SourceImage file="query-clarification.webp" preview="query-detail.webp" title="问数 · 口径澄清" alt="真实问数方案中的有效订单范围澄清，包含选项、补充信息与确认操作" className="aidbs-clarification-image" /><p className="aidbs-caption">有效订单、时间基准、复购定义，在执行前确认。</p><Film poster="query-clarification.webp" video="query-demo.mp4" label="播放问数交互 · 20 秒" caption="复购率澄清演示，与前文订购数 Query 为不同任务。" /></div>
      <div className="aidbs-solution"><div className="aidbs-solution-heading"><h3>让诊断依据可读</h3></div><Diagnosis /></div>
      <div className="aidbs-solution"><div className="aidbs-solution-heading"><h3>并列比较资源方案</h3></div><SourceImage file="resource-options.webp" preview="resource-detail.webp" title="资源方案 · 比较与选用" alt="真实资源推荐方案，三张卡片并列展示配置、价格与选用入口" /><Film poster="resource-options.webp" video="resource-demo.mp4" label="播放方案选择 · 6 秒" caption="配置、价格与选用；不包含实际成交或实例创建。" /></div>
    </section>
    <section className="aidbs-section" id="aidbs-delivery"><SectionHeading title="从 Spec 到同仓迭代" note="把需求与交互约束带进代码，与 PD、研发持续协作。" /><EngineeringWorkflow /><h3 className="aidbs-engineering-output-title">共性框架的实际产物</h3><SharedFrameComparison /><p className="aidbs-contributions">我的工作：从输入输出分析与代码盘点，到产品形态、交互 Spec 和 AI Coding 实现。子 Agent 能力与平台工程由团队共同建设。</p><EvidenceNotes /></section>
    <div className="aidbs-end"><a href="#/projects/data-agent"><span className="aidbs-small">下一篇 · 从方向到任务体验</span><strong lang="en">Data Agent <ArrowUpRight size={22} aria-hidden /></strong></a><button className="aidbs-top" onClick={() => jump('main-content')}>回到开头<ArrowDown size={15} className="aidbs-up-arrow" aria-hidden /></button></div>
  </article></main><SiteFooter compact /></>
}
