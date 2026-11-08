import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DotText } from '@/components/effects/DotText'
import { ThemeToggle } from '@/components/portfolio/ThemeProvider'
import { WorkMenu } from '@/components/portfolio/WorkMenu'

export const experiences = [
  { date: '2017.09—2021.06', title: '重庆大学', role: '工业设计 · 学士', note: '从实体产品、造型与交互原型开始。', flower: 'seedling', phase: '好奇与起点' },
  { date: '2021.09—2024.03', title: '浙江大学', role: '工业设计工程 · 硕士', note: '继续探索交互体验与产品研究。', flower: 'bud', phase: '积累与探索' },
  { date: '2022.06—2022.12', title: '腾讯光子', role: '交互设计实习', note: '参与游戏系统交互，与视觉和研发协作。', flower: 'early-flower', phase: '实践与协作' },
  { date: '2023.06—2023.10', title: '阿里云', role: '体验设计实习', note: '从学习与研究走进企业级产品。', flower: 'open-flower', phase: '理解复杂系统' },
  { date: '2024.04—至今', title: '阿里云', role: '体验设计师', note: '数据库工具线设计负责人，参与 Agent 产品、设计系统与公开方法建设。', flower: 'plant', phase: '承担与连接' },
]

export function SiteHeader({ currentSlug }: { currentSlug?: string }) {
  return <header className={`site-header${currentSlug ? '' : ' site-header-home'}`}><div className="header-inner"><a href="#" className="wordmark" aria-label="余艾琳，返回首页" onClick={() => sessionStorage.removeItem('portfolio-home-scroll')}><span lang="en">AILIN YU</span><span className="wordmark-dot">.</span></a><nav aria-label="主要导航"><WorkMenu currentSlug={currentSlug} /><a href="#practice" onClick={() => sessionStorage.removeItem('portfolio-home-return')}>方法与分享</a><a href="#experience" onClick={() => sessionStorage.removeItem('portfolio-home-return')}>经历</a><a href="#contact" onClick={() => sessionStorage.removeItem('portfolio-home-return')}>联系</a><ThemeToggle /></nav></div></header>
}

export function SiteFooter({ compact = false }: { compact?: boolean }) {
  const [copied, setCopied] = useState(false)
  const backToCaseStart = () => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const copy = async () => {
    try { await navigator.clipboard.writeText('ailinyu68@gmail.com'); setCopied(true); window.setTimeout(() => setCopied(false), 2400) }
    catch { window.location.href = 'mailto:ailinyu68@gmail.com' }
  }
  if (compact) return <footer className="site-footer compact-footer case-footer" id="contact"><div className="shell"><div className="case-footer-contact"><a href="mailto:ailinyu68@gmail.com">ailinyu68@gmail.com <ArrowUpRight size={17} aria-hidden /></a><button onClick={copy}>{copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}{copied ? '已复制' : '复制邮箱'}</button></div><div className="footer-bottom"><span lang="en">© 2026 Ailin Yu</span><button className="footer-back-to-top" onClick={backToCaseStart}>回到案例开头 ↑</button></div><span className="sr-only" role="status">{copied ? '邮箱已复制' : ''}</span></div></footer>
  return <footer className={`site-footer ${compact ? 'compact-footer' : ''}`} id="contact"><div className="shell"><div className="footer-main"><div><DotText text="继续生长" /><p>如果你也在探索 AI 产品，欢迎一起聊聊。</p></div><div className="footer-contact"><Button asChild size="lg"><a href="mailto:ailinyu68@gmail.com">一起聊聊 <ArrowUpRight size={18} aria-hidden /></a></Button><div className="email-line"><a href="mailto:ailinyu68@gmail.com">ailinyu68@gmail.com</a><button onClick={copy} aria-label={copied ? '邮箱已复制' : '复制邮箱'}>{copied ? <Check size={17} /> : <Copy size={17} />}</button></div><span aria-live="polite" className="copy-status">{copied ? '邮箱已复制' : '欢迎关于产品、设计与新想法的交流'}</span></div></div><div className="footer-bottom"><span>© 2026 Ailin Yu</span>{compact ? <button className="footer-back-to-top" onClick={backToCaseStart}>回到案例开头 ↑</button> : <a href="#" onClick={() => sessionStorage.removeItem('portfolio-home-scroll')}>回到顶部 ↑</a>}</div></div></footer>
}
