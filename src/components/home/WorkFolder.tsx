import { FolderStack } from '@/components/home/FolderStack'
import { ArrowUpRight } from 'lucide-react'

export type FolderProject = {
  id: string; order: string; title: string; en: string
  summary: string; role: string; topic: string; caption: string
  sheets: { src: string; label: string; alt: string }[]
}

export function rememberWorkPosition() {
  sessionStorage.setItem('portfolio-home-scroll', String(window.scrollY))
  sessionStorage.setItem('portfolio-home-return', '1')
}

export function WorkFolder({ project }: { project: FolderProject }) {
  return <article className={`home-project home-project-${project.id}`}>
    <div className="home-project-story"><span className="home-index" lang="en">{project.order}</span><p className="home-eyebrow">{project.topic}</p></div>
    <FolderStack title={project.title} tab={project.en} caption={project.caption} href={`#/projects/${project.id}`} onNavigate={rememberWorkPosition}
      sheets={project.sheets.map((image,index)=>({id:String(index),label:image.label,alt:image.alt,content:<img src={image.src} alt={image.alt} loading="lazy" width="1200" height="800"/>}))} />
    <div className="home-project-description"><p>{project.summary}</p><div><span>{project.role}</span><a href={`#/projects/${project.id}`} onClick={rememberWorkPosition}>阅读案例 <ArrowUpRight size={15} aria-hidden="true" /></a></div></div>
  </article>
}
