import { useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useInView, useReducedMotion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/portfolio/ThemeProvider'
import { AsciiParticles } from '@/components/home/AsciiParticles'
import { homeDesignPlants, homeDesignProjects, homeHeroText } from '@/content/home-design'
import { warmCase } from '@/lib/case-modules'
import { beginProjectEntry } from '@/lib/project-entry-transition'
import { DecryptedChip, DecryptedLabel, HoverPortrait, RotatingTool } from '@/components/home/HeroInteractions'
import { useGalleryMotion } from '@/components/home/useGalleryMotion'
import { WorkCover } from '@/components/home/WorkCover'
import { greetingParts, useGreetingType } from '@/components/home/useGreetingType'
import { ExperienceReveal } from '@/components/home/ExperienceReveal'
import '@/styles/figma-home.css'

type HomeNavigation = { onSectionNavigate: (event: MouseEvent<HTMLAnchorElement>) => void }

function HomeHeader({ onSectionNavigate }: HomeNavigation) {
  return <header className="figma-home-header"><a className="figma-wordmark" href="#" onClick={() => sessionStorage.removeItem('portfolio-home-scroll')}>Ailin Yu</a><nav aria-label="主要导航"><a href="#works" onClick={onSectionNavigate}><DecryptedLabel text="Work" /></a><a href="#experience" onClick={onSectionNavigate}><DecryptedLabel text="Experience" /></a><a href="#contact" onClick={onSectionNavigate}><DecryptedLabel text="Contact" /></a><ThemeToggle /></nav></header>
}
function HomeHero() {
  const area = useRef<HTMLElement>(null)
  const greeting = useGreetingType(area)
  const position = (x: number, y: number, width: number, height: number): CSSProperties => ({ left: `${x / 1440 * 100}%`, top: `${y / 714 * 100}%`, width: `${width / 1440 * 100}%`, height: `${height / 714 * 100}%` })
  return <section className="figma-hero" ref={area} aria-labelledby="figma-introduction">
    <h1 id="figma-introduction" className="sr-only">Hi，我是艾琳。我 Build 产品，连接技术与体验。目前在阿里云，做 Agent 与数据库产品，探索 AI Native 设计工程。Nice to meet you :)</h1>
    <AsciiParticles variant="background" eventTarget={area} />
    <svg className="figma-hero-typesetting" viewBox="0 0 1440 714" aria-hidden="true">
      {homeHeroText.filter(item => item.text !== 'Agent' && item.text !== 'AI Native').map(item => {
        const partIndex = greetingParts.findIndex(part => part === item.text)
        return <text key={item.text} x={item.x} y={item.y} className={`hero-${item.face}`} xmlSpace="preserve">{partIndex < 0 ? item.text : greeting.part(partIndex)}{greeting.cursorPart === partIndex && partIndex >= 0 && <tspan className="figma-type-cursor" dx="2">|</tspan>}</text>
      })}
      <image href="/home/figma/alibaba-cloud.svg" x="294" y="400.67" width="108" height="24" />
    </svg>
    <div className="figma-hero-interactions"><HoverPortrait style={position(387, 277, 48, 48)} /><RotatingTool style={position(311, 340, 39.6, 36)} /><DecryptedChip text="Agent" vector style={position(474, 393, 92, 43)} /><DecryptedChip text="AI Native" vector style={position(839, 393, 138, 43)} /></div>
    <div className="figma-hero-mobile">
      <p><span className="figma-typed-greeting" aria-hidden="true" data-typed-count={greeting.shown}>{greetingParts.map((part, index) => {
        const Tag = index === 2 ? 'strong' : 'span'
        return <Tag className={`figma-type-part ${index < 2 ? 'hero-latin' : ''}`} key={part}><span className="figma-type-reserve">{part}</span><span className="figma-type-display">{greeting.part(index)}{greeting.cursorPart === index && <span className="figma-type-caret" />}</span></Tag>
      })}</span><HoverPortrait className="figma-mobile-portrait" /></p>
      <p><strong>我 </strong><span className="hero-latin">Build</span>{' '}<RotatingTool className="figma-mobile-code" /><strong>产品，连接技术与体验</strong></p>
      <p><span className="figma-company-unit"><strong>目前在 </strong><img className="figma-mobile-company" src="/home/figma/alibaba-cloud.svg" width="108" height="24" alt="阿里云" /></span><strong>，做 </strong><DecryptedChip text="Agent" /><strong> 与数据库产品，探索 </strong><DecryptedChip text="AI Native" /><strong> 设计工程</strong></p>
      <p className="figma-mobile-greeting hero-latin">Nice to meet you :)</p>
    </div>
  </section>
}
function SectionTitle({ text, id, reveal = false }: { text: string; id: string; reveal?: boolean }) {
  const ref = useRef<HTMLHeadingElement>(null)
  const visible = useInView(ref, { once: true, amount: .2, margin: '0px 0px -48px 0px' })
  const reduced = useReducedMotion()
  const delay = (index: number): CSSProperties => ({ '--character-delay': `${index * .035}s` } as CSSProperties)
  return <h2 ref={ref} className="figma-section-title" id={id} aria-label={reveal ? text : undefined} data-revealed={reveal ? visible || !!reduced : undefined}>
    {reveal ? <span className="figma-title-reveal-text" aria-hidden="true">{Array.from(text, (character, index) => <span key={index} className="figma-title-character" style={delay(index)}>{character}</span>)}<span className="figma-section-asterisk figma-title-character" style={delay(text.length)}>*</span></span> : <>{text}<span className="figma-section-asterisk" aria-hidden="true">*</span></>}
  </h2>
}
function HomeWork() {
  const rail = useRef<HTMLDivElement>(null)
  const stopRail = useGalleryMotion(rail)
  const [canScroll, setCanScroll] = useState({ previous: false, next: false })
  useEffect(() => {
    const element = rail.current
    if (!element) return
    const update = () => {
      const maximum = element.scrollWidth - element.clientWidth
      const previous = element.scrollLeft > 1
      const next = element.scrollLeft < maximum - 1
      setCanScroll(current => current.previous === previous && current.next === next ? current : { previous, next })
    }
    update()
    element.addEventListener('scroll', update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(element)
    if (element.firstElementChild) observer.observe(element.firstElementChild)
    return () => { element.removeEventListener('scroll', update); observer.disconnect() }
  }, [])
  const remember = () => { sessionStorage.setItem('portfolio-home-scroll', String(window.scrollY)); sessionStorage.setItem('portfolio-home-return', 'true') }
  const move = (direction: number) => {
    const element = rail.current
    const card = element?.querySelector<HTMLElement>('.figma-work-card')
    if (!element || !card) return
    stopRail.current()
    const distance = card.offsetWidth + (parseFloat(getComputedStyle(element).columnGap) || 0)
    element.scrollBy({ left: direction * distance, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  const enter = (event: MouseEvent<HTMLAnchorElement>, slug: string, hasCase: boolean) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    remember()
    stopRail.current()
    if (!hasCase) return
    const preview = event.currentTarget.querySelector<HTMLElement>('.figma-card-cover')
    if (preview && beginProjectEntry(preview, `#/projects/${slug}`)) { event.preventDefault(); window.location.hash = `#/projects/${slug}` }
  }
  return <section className="figma-work" id="works" aria-labelledby="figma-work-title">
    <div className="figma-section-heading figma-work-heading"><SectionTitle text="Work" id="figma-work-title" reveal /><div className="figma-gallery-controls" role="group" aria-label="作品浏览">
      <Button type="button" variant="ghost" size="icon-lg" aria-label="向左浏览作品" aria-controls="figma-work-gallery" disabled={!canScroll.previous} onClick={() => move(-1)}><ArrowLeft aria-hidden="true" /></Button>
      <Button type="button" variant="ghost" size="icon-lg" aria-label="向右浏览作品" aria-controls="figma-work-gallery" disabled={!canScroll.next} onClick={() => move(1)}><ArrowRight aria-hidden="true" /></Button>
    </div></div>
    <div className="figma-work-rail" id="figma-work-gallery" ref={rail} role="region" aria-label="横向作品画廊，可使用左右方向键浏览" tabIndex={0} onKeyDown={event => {
      if (event.target !== event.currentTarget) return
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) }
      if (event.key === 'Home' || event.key === 'End') { event.preventDefault(); stopRail.current(); rail.current?.scrollTo({ left: event.key === 'Home' ? 0 : rail.current.scrollWidth, behavior: 'instant' }) }
    }}>
      {homeDesignProjects.map(project => <article className="figma-work-card" key={project.slug}><a href={`#/projects/${project.slug}`} className="figma-card-link" aria-label={`查看 ${project.title}`} onClick={event => enter(event, project.slug, !!project.kind)} onPointerDown={() => project.kind && warmCase(project.kind, project.slug)} onFocus={() => project.kind && warmCase(project.kind, project.slug)} onPointerEnter={event => { if (event.pointerType === 'mouse' && project.kind) warmCase(project.kind, project.slug) }}>
        <WorkCover cover={project.cover} title={project.title} />
        <svg className="figma-card-caption" viewBox="0 0 372 88" aria-hidden="true"><text className="figma-card-title" x="8" y="45.87">{project.title}</text><text className="figma-card-subtitle" x="8" y="75.76">{project.subtitle}</text></svg><h3 className="sr-only">{project.title}</h3><p className="sr-only">{project.subtitle}</p>
      </a></article>)}
    </div>
  </section>
}
function HomeExperience() {
  const flowerTone = new URLSearchParams(window.location.search).get('flowers') === 'gray' ? 'gray' : 'cool-violet'
  return <section className="figma-experience" id="experience" aria-labelledby="figma-experience-title">
    <div className="figma-section-heading"><SectionTitle text="Experience" id="figma-experience-title" reveal /><p className="figma-experience-hint">左右滑动，继续看我的经历 →</p></div>
    <div className="figma-experience-scroll" role="region" aria-label="教育与工作经历" tabIndex={0}><div className="figma-experience-scene">
      {homeDesignPlants.map((plant, stage) => <div key={plant.name} className="figma-plant" style={{ '--plant-x': plant.x, '--plant-width': plant.width } as CSSProperties} role="img" aria-label={`桔梗成长阶段：${plant.name}，由 ASCII 粒子绘制`}><div className="figma-plant-fallback" style={{ backgroundSize: `${1774 * plant.scaleX * 100}% 100%`, backgroundPosition: `${plant.offsetX / (1 - 1774 * plant.scaleX) * 100}% 0` }} /><AsciiParticles variant="flower" stage={stage} flowerTone={flowerTone} /></div>)}
      <svg className="figma-experience-labels" viewBox="0 0 1440 714" role="img" aria-label="2017至2021 重庆大学工业设计学士；2021至2024 浙江大学工业设计工程硕士；2022 腾讯 IEG 交互设计实习；2023 阿里云体验设计实习；2024年4月至今 阿里云数据库及 AIDBS 与工具产品线设计负责人、CloudAI 核心成员。">
        <path className="figma-timeline-line" d="M0 370H1440" />{[126, 361, 596, 831, 1066].map(x => <rect key={x} className="figma-timeline-dot" x={x} y="367" width="6" height="6" />)}{[596, 831, 1066].map(x => <g key={x}><path className="figma-timeline-stem" d={`M${x + 3} 373V434`} /><rect className="figma-timeline-work-dot" x={x} y="430" width="6" height="6" /></g>)}
        <ExperienceReveal x={120}><text className="figma-experience-date" y="399.19">2017 - 2021</text><text className="figma-experience-name" y="439.58">重庆大学</text><text className="figma-experience-role" y="473.76">工业设计 学士</text></ExperienceReveal>
        <ExperienceReveal x={355}><text className="figma-experience-date" y="399.19">2021 - 2024</text><text className="figma-experience-name" y="439.58">浙江大学</text><text className="figma-experience-role" y="473.76">工业设计工程 硕士</text></ExperienceReveal>
        <ExperienceReveal x={590}><text className="figma-experience-date" y="463.19">2022</text><text className="figma-experience-name" y="503.58" xmlSpace="preserve">腾讯 <tspan className="hero-latin" dy=".82">IEG</tspan></text><text className="figma-experience-role" y="537.76">交互设计 实习</text></ExperienceReveal>
        <ExperienceReveal x={825}><text className="figma-experience-date" y="463.19">2023</text><text className="figma-experience-name" y="503.58">阿里云</text><text className="figma-experience-role" y="537.76">体验设计 实习</text></ExperienceReveal>
        <ExperienceReveal x={1060}><text className="figma-experience-date" y="463.19">2024.04 - now</text><text className="figma-experience-name" y="503.58">阿里云</text><text className="figma-experience-note" y="537.76">数据库 <tspan className="hero-latin" x="52" y="538.58">AIDBS</tspan><tspan dy="-.82"> 与工具产品线设计负责人</tspan></text><text className="figma-experience-note hero-latin" y="568.58">CloudAI<tspan className="hero-chinese-regular" dy="-.82"> 核心成员</tspan></text></ExperienceReveal>
      </svg>
    </div></div>
  </section>
}
function HomeContact() {
  type ContactTarget = 'wechat' | 'email'
  const [feedback, setFeedback] = useState<{ target: ContactTarget; message: string; ok: boolean } | null>(null)
  const copySequence = useRef(0)
  useEffect(() => {
    if (!feedback) return
    const timer = window.setTimeout(() => setFeedback(null), 2400)
    return () => window.clearTimeout(timer)
  }, [feedback])
  const copy = async (value: string, target: ContactTarget) => {
    const sequence = ++copySequence.current
    setFeedback(null)
    try {
      await navigator.clipboard.writeText(value)
      if (sequence === copySequence.current) setFeedback({ target, message: '已复制✅', ok: true })
    } catch {
      if (sequence === copySequence.current) setFeedback({ target, message: '未能复制，请重试或手动复制。', ok: false })
    }
  }
  const status = (target: ContactTarget) => <span className="figma-contact-feedback" role="status" aria-live="polite" aria-atomic="true" data-visible={feedback?.target === target} data-success={feedback?.target === target && feedback.ok}>{feedback?.target === target ? feedback.message : ''}</span>
  return <footer className="figma-contact" id="contact" aria-labelledby="figma-contact-title">
    <div className="figma-section-heading"><SectionTitle text="Contact Me" id="figma-contact-title" reveal /><p className="figma-contact-invitation">欢迎一起聊聊产品、设计，或是一起喝杯咖啡～</p></div>
    <div className="figma-contact-row">
      <div className="figma-contact-links">
        <span className="figma-contact-item" data-contact="wechat"><button type="button" onClick={() => void copy('Yerin20', 'wechat')} aria-label="复制微信号 Yerin20" title="点击复制微信号"><span className="figma-contact-icon figma-contact-icon-wechat" aria-hidden="true" /><span>Yerin20</span></button>{status('wechat')}</span>
        <span className="figma-contact-item" data-contact="email"><button type="button" onClick={() => void copy('ailinyu68@gmail.com', 'email')} aria-label="复制邮箱 ailinyu68@gmail.com" title="点击复制邮箱"><span className="figma-contact-icon figma-contact-icon-email" aria-hidden="true" /><span>ailinyu68@gmail.com</span></button>{status('email')}</span>
      </div>
      <small>© 2026 Ailin Yu</small>
    </div>
  </footer>
}
export function HomePage({ onSectionNavigate }: HomeNavigation) {
  return <div className="figma-home"><HomeHeader onSectionNavigate={onSectionNavigate} /><main id="main-content" tabIndex={-1}><HomeHero /><HomeWork /><HomeExperience /></main><HomeContact /></div>
}
