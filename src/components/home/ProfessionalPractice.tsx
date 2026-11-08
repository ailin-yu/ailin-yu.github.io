import { ArrowUpRight } from 'lucide-react'
import { playbookLinks, speakingRecords } from '@/content/professional'

export default function ProfessionalPractice() {
  return <section className="professional-practice home-shell" aria-labelledby="practice-title">
    <header className="professional-section-heading"><span className="home-eyebrow">方法与分享</span><h2 id="practice-title">把实践，带到更大的讨论里。</h2><p>通过写作、工作坊和交流，将项目中的设计判断整理成可以继续使用的方法。</p></header>
    <article className="playbook-feature" aria-labelledby="playbook-title"><a className="playbook-cover" href={playbookLinks.read} target="_blank" rel="noreferrer" aria-label="阅读 Vibe Designing Playbook"><img src="/influence/playbook-cover.png" alt="Vibe Designing Playbook 官方首页图" width={3360} height={2000} loading="lazy" decoding="async" /><span>阅读 Playbook <ArrowUpRight size={18} aria-hidden /></span></a>
      <div className="playbook-description"><p className="home-eyebrow">公开写作 · 联合作者</p><h3 id="playbook-title" lang="en">Vibe Designing<br />Playbook</h3><p className="playbook-lead">让设计判断，进入 AI 的生成过程。</p><p>我与团队共同创作 Playbook，独立撰写「动态交互」章节，并参与「设计工程」内容与网页版实现。</p><p>围绕用户意图、任务状态与生成式界面，把业务实践中的交互经验整理出来，供设计师与开发者使用。</p><div className="practice-links"><a href={playbookLinks.read} target="_blank" rel="noreferrer">在线阅读 <ArrowUpRight size={16} aria-hidden /></a><a href={playbookLinks.source} target="_blank" rel="noreferrer">公开仓库 <ArrowUpRight size={16} aria-hidden /></a></div><a className="practice-context-link" href="#/projects/cloudai">在 CloudAI 中看这些方法的工作背景 <ArrowUpRight size={14} aria-hidden /></a></div>
    </article>
    <div className="professional-sharing"><figure className="d20-feature"><img src="/home/photos/backstage.webp" alt="余艾琳在 D20 论坛后台戴耳机参与现场统筹，背景可见舞台与观众" width={1200} height={900} loading="lazy" decoding="async" /><figcaption>D20 论坛后台 · 议题与现场统筹</figcaption></figure><div className="sharing-copy"><p className="home-eyebrow">组织 · 分享 · 交流</p><h3>从项目现场，到行业与课堂。</h3><p>连续担任 2025、2026 D20 阿里云 AI 设计论坛 PM，参与议题、嘉宾协同与现场统筹。</p><dl>{speakingRecords.map(record => <div key={record.venue}><dt><span>{record.venue}</span><small>{record.format}</small></dt><dd>{record.note}</dd></div>)}</dl></div></div>
    <a className="practice-research" href="#/projects/cscw"><span><span className="home-eyebrow">研究与公开发表</span><strong>Agent 应该展示多少过程信息？</strong><span>CSCW Companion 2025 Poster · 第一作者</span></span><ArrowUpRight size={24} aria-hidden /></a>
  </section>
}
