import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { SiteFooter } from '@/components/portfolio/SiteChrome'
import { ZoomableCaseImage } from '@/components/portfolio/ZoomableCaseImage'
import { studentProjects, type StudentImage, type StudentSection } from '@/content/student-projects'
import '@/styles/student-case.css'

function Artwork({ image, priority = false }: { image: StudentImage; priority?: boolean }) {
  const reduced = useReducedMotion()
  return <motion.figure className={`student-artwork ${priority ? 'student-hero' : ''}`} initial={priority || reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: reduced ? 0 : .4, ease: [.16, 1, .3, 1] }}>
    <ZoomableCaseImage src={image.src} width={image.width} height={image.height} alt={image.alt} eager={priority} />
    <figcaption><span>{image.caption}</span></figcaption>
  </motion.figure>
}

function ProcessSequence({ original, frames }: NonNullable<StudentSection['process']>) {
  const reduced = useReducedMotion()
  return <motion.figure className="student-artwork student-process" initial={reduced ? false : { opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .1 }} transition={{ duration: reduced ? 0 : .4, ease: [.16, 1, .3, 1] }}>
    <div className="student-process-grid" data-count={frames.length}>{frames.map(frame => <span className="student-process-step" key={frame.src}><ZoomableCaseImage src={frame.src} width={frame.width} height={frame.height} alt={frame.alt} /><span aria-hidden="true">{frame.caption}</span></span>)}</div>
    <figcaption><span>{original.caption}</span></figcaption>
  </motion.figure>
}

function BaseComparison({ before, after, note }: { before: StudentImage; after: StudentImage; note: string }) {
  const [version, setVersion] = useState<'before' | 'after'>('after')
  const image = version === 'before' ? before : after
  return <figure className="student-comparison"><div className="student-version-switch" role="group" aria-label="查看底盘方案变化"><button aria-pressed={version === 'before'} onClick={() => setVersion('before')}>原方案</button><button aria-pressed={version === 'after'} onClick={() => setVersion('after')}>简化方案</button></div><div className="student-comparison-image"><ZoomableCaseImage key={image.src} src={image.src} width={image.width} height={image.height} alt={image.alt} imageClassName="student-version-image" /></div><figcaption><span aria-live="polite">{image.caption}</span></figcaption><p className="student-comparison-note">{note}</p></figure>
}

export function StudentCasePage({ slug }: { slug: string }) {
  const project = studentProjects.find(item => item.slug === slug)
  if (!project) return <main id="main-content" tabIndex={-1} className="student-case"><div className="student-shell"><h1 className="type-heading-h2">没有找到这篇学生作品。</h1><a className="student-back" href="#works">返回作品</a></div></main>
  const otherProjects = studentProjects.filter(item => item.slug !== slug)
  return <><main id="main-content" className={`student-case student-case-${project.slug}`} tabIndex={-1}><article className="student-shell" aria-labelledby="student-title">
    <a href="#works" className="student-back"><ArrowLeft size={16} aria-hidden />全部作品</a>
    <header className="student-intro"><h1 id="student-title" className="type-heading-h1" lang="en">{project.title}</h1><p className="student-subtitle">{project.subtitle}{project.year ? ` · ${project.year}` : ''}</p><p className="student-meta">{project.stage}</p><p className="case-story-lead">{project.summary}</p></header>
    <Artwork image={project.hero} priority /><div className="student-overview"><p>{project.role}</p></div>
    {project.sections.map(section => <section className={`student-section ${section.observations && !section.images ? 'student-section-notes' : ''}`} id={`student-${project.slug}-${section.id}`} key={section.id}><header className="student-section-heading"><h2 className="type-heading-h3">{section.title}</h2>{section.description && <p>{section.description}</p>}</header>{section.process && <ProcessSequence {...section.process} />}{section.comparison && <BaseComparison {...section.comparison} />}{section.images && <div className={section.layout === 'pair' ? 'student-image-pair' : 'student-image-stack'}>{section.images.map(image => <Artwork key={image.src} image={image} />)}</div>}{section.observations && <dl className="student-observations">{section.observations.map(item => <div key={item.title}><dt>{item.title}</dt><dd>{item.detail}</dd></div>)}</dl>}</section>)}
    <section id={`student-${project.slug}-sources`} className="student-section student-sources"><details><summary>角色与来源<span aria-hidden>＋</span></summary><p>来源：原学生作品集第{project.sourcePages}页。页面图像均为原稿裁切，没有生成补画。</p>{project.period && <p>原稿标注项目时间：{project.period}。</p>}{project.sourceNotes.map(note => <p key={note}>{note}</p>)}</details></section>
    <nav className="student-related" aria-label="其他学生作品">{otherProjects.map(item => <a key={item.slug} href={`#/projects/${item.slug}`}><span>{item.subtitle}</span><strong lang="en">{item.title}<ArrowUpRight size={20} aria-hidden /></strong></a>)}</nav>
  </article></main><SiteFooter compact /></>
}

export default StudentCasePage
