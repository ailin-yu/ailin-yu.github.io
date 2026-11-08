import { motion, useReducedMotion } from 'motion/react'
import { ArrowUpRight, ArrowLeft } from 'lucide-react'
import { SiteFooter } from '@/components/portfolio/SiteChrome'
import { researchFigures, researchPaper } from '@/content/research-media'
import '@/styles/research-case.css'

const conditions = [
  { name: '高透明度', scope: '全部已识别的过程信息' },
  { name: '中透明度', scope: '执行计划、当前任务与任务总结' },
  { name: '低透明度', scope: '任务总结' },
]
const results = [
  { metric: '信任', values: [5.14, 4.88, 4.14] },
  { metric: '满意度', values: [5.33, 4.95, 3.98] },
  { metric: '使用意愿', values: [5.23, 4.83, 4.03] },
]

type Figure = (typeof researchFigures)[number]
function PaperFigure({ figure, eager = false }: { figure: Figure; eager?: boolean }) {
  const reduced = useReducedMotion()
  return <motion.figure className="research-paper-figure" initial={eager || reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .08 }} transition={{ duration: reduced ? 0 : .4, ease: [.16, 1, .3, 1] }}><img src={figure.src} width={figure.width} height={figure.height} alt={figure.alt} loading={eager ? 'eager' : 'lazy'} fetchPriority={eager ? 'high' : 'auto'} decoding="async" /><figcaption>Figure {figure.number} · {figure.title}</figcaption></motion.figure>
}
export default function ResearchCasePage() {
  return <><main className="research-case" id="main-content" tabIndex={-1}><article className="research-shell">
    <header className="research-intro"><a className="research-back" href="#works"><ArrowLeft size={16} aria-hidden />全部作品</a><h1 className="type-heading-h1"><span lang="en">Agent</span> 过程透明度</h1><p className="research-meta">CSCW Companion 2025 · Poster · 第一作者</p><p className="case-story-lead">Agent 执行任务时，展示多少过程信息更合适？</p></header>
    <section className="research-section research-opening" id="research-question"><h2 className="type-heading-h2">先确定哪些信息值得展示</h2><p className="case-story-note">与 6 位 UX 专家识别 10 项过程信息，覆盖规划、执行和总结。</p><PaperFigure figure={researchFigures[0]} eager /><div className="research-study-map">{[{value:'6',unit:'位 UX 专家'}, {value:'10',unit:'项过程信息'}, {value:'3',unit:'种透明度条件'}, {value:'40',unit:'位参与者'}].map(item=><div key={item.value}><strong lang="en">{item.value}</strong><span>{item.unit}</span></div>)}</div></section>
    <section className="research-section" id="research-conditions" aria-label="三种透明度条件"><h2 className="type-heading-h2">比较三种展示范围</h2><PaperFigure figure={researchFigures[1]} /><dl className="research-condition-summary">{[...conditions].reverse().map(item => <div key={item.name}><dt>{item.name}</dt><dd>{item.scope}</dd></div>)}</dl></section>
    <section className="research-section" id="research-study"><h2 className="type-heading-h2">研究方法</h2><div className="research-method">{[{title:'海报生成',value:'3 段预录视频',note:'每段 2 分钟'},{title:'观看顺序',value:'被试内比较',note:'拉丁方平衡顺序'},{title:'体验测量',value:'7 点量表',note:'信任、满意度、使用意愿'}].map(item=><div key={item.title}><span>{item.title}</span><strong>{item.value}</strong><p>{item.note}</p></div>)}</div><div className="research-sample"><div className="research-sample-bar" role="img" aria-label="33名设计学生，7名职业设计师"><i style={{width:'82.5%'}}/><i style={{width:'17.5%'}}/></div><div className="research-sample-legend"><span>33 名设计学生</span><span>7 名职业设计师</span></div></div><p className="research-caption">观看模拟视频，参与者未实时操作 Agent。</p></section>
    <section className="research-section" id="research-results"><div className="research-result-heading"><h2 className="type-heading-h2">体验评分</h2><span>7 点量表 · 平均值</span></div><div className="research-result-grid">{results.map(result=><figure className="research-metric" key={result.metric}><figcaption>{result.metric}</figcaption>{result.values.map((value,index)=><div className="research-bar-row" key={index}><span>{conditions[index].name}</span><div><i className={`research-bar-${index}`} style={{width:`${value/7*100}%`}}/></div><strong lang="en">{value.toFixed(2)}</strong></div>)}</figure>)}</div><p className="research-caption">本次模拟中高透明度评分更高。均值据表 1，无误差线；限于设计背景样本，不代表效率提升。</p></section>
    <section className="research-section research-contribution" id="research-contribution"><h2 className="type-heading-h2">我的工作</h2><p>第一作者 · 研究设计、用户研究、论文写作与发表</p><details><summary>论文与贡献边界</summary><p>{researchPaper.title}. Ailin Yu 等，CSCW Companion 2025，Poster，pp. 379–384。</p><p>Figure 1、Figure 2 从本人本地保存的 6 页发表版 PDF 提取，分别位于 PDF 第 2、3 页，与投稿源文件 fig01.png、fig02.png 的 RGB 像素一致。两图均完整展示，保留原始配色。</p>{researchFigures.map(figure => <p key={figure.number}><span>Figure {figure.number} · PDF 第 {figure.pdfPage} 页</span><br /><span lang="en">{figure.caption}</span></p>)}<p>作为第一作者带领团队开展研究；作者间统计、编码及全部原型制作分工尚待逐项核实，不表示本人独立完成全部研究。折叠、可调与任务自适应属于后续设计启示，未在本次实验直接检验。</p><a href={researchPaper.href} target="_blank" rel="noreferrer">阅读论文 <ArrowUpRight size={15} aria-hidden /></a></details></section>
    <div className="research-related"><a href="#/projects/data-agent"><span>产品实践</span><strong lang="en">Data Agent</strong><ArrowUpRight size={23} aria-hidden /></a><a href="#/projects/cloudai"><span>交互规则复用</span><strong lang="en">CloudAI</strong><ArrowUpRight size={23} aria-hidden /></a></div>
  </article></main><SiteFooter compact /></>
}
