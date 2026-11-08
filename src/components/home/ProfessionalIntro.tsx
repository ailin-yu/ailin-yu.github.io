import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ChevronDown, X } from 'lucide-react'
import PersonalPhotoFolder from '@/components/home/PersonalPhotoFolder'
import { careerStops } from '@/content/professional'

function CareerNote() {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLSpanElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!open) return
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false) }
    document.addEventListener('pointerdown', outside)
    return () => document.removeEventListener('pointerdown', outside)
  }, [open])
  return <span className="career-inline" ref={root}
    onPointerEnter={event => { if (event.pointerType === 'mouse') setOpen(true) }}
    onPointerLeave={() => { if (!root.current?.contains(document.activeElement)) setOpen(false) }}
    onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}
    onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); setOpen(false); trigger.current?.focus() } }}>
    <button ref={trigger} className="career-inline-trigger" aria-expanded={open} aria-controls="intro-career" aria-label="阿里云，查看工作经历" onFocus={() => setOpen(true)} onClick={() => setOpen(true)}><img src="/brands/alibaba-cloud-orange.svg" alt="阿里云" width={119} height={15} /><ChevronDown size={13} aria-hidden /></button>
    {open && <span className="career-inline-panel" id="intro-career" role="region" aria-label="工作经历">
      <span className="career-inline-heading">一路走来<button aria-label="收起工作经历" onClick={() => { trigger.current?.focus(); setOpen(false) }}><X size={16} aria-hidden /></button></span>
      {careerStops.map(stop => <span className="career-inline-stop" key={stop.id}>
        <span className="career-inline-date" lang="en">{stop.date}</span>
        <span className="career-inline-company"><img className={'darkLogo' in stop ? 'career-logo-light' : undefined} src={stop.logo} alt={stop.company} width={119} height={24} />{'darkLogo' in stop && <img className="career-logo-dark" src={stop.darkLogo} alt={stop.company} width={119} height={24} />}</span>
        <span className="career-inline-role">{stop.role}</span>
      </span>)}
    </span>}
  </span>
}

export function ProfessionalIntro() {
  return <section className="home-intro home-shell home-intro-professional" aria-labelledby="home-title">
    <div className="home-intro-copy">
      <p className="home-hello">你好，我是</p>
      <div className="home-name-line"><h1 id="home-title" className="home-name">余艾琳<span className="home-name-period">。</span></h1><p className="home-english-name" lang="en">Ailin Yu</p></div>
      <div className="home-introduction">
        <p className="home-current-role">目前在 <CareerNote />，<br />负责数据库工具与 Agent 产品的体验设计。</p>
        <p className="home-professional-note">近三年的实践里，我更关心：用户究竟想完成什么，AI 应该做到哪一步，以及怎样把判断变成可运行的产品。</p>
      </div>
      <div className="home-intro-actions"><a className="home-text-action" href="#works">从作品认识我 <ArrowDown size={16} aria-hidden /></a></div>
    </div>
    <PersonalPhotoFolder />
  </section>
}
