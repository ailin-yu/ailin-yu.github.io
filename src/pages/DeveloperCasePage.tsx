import { ArrowLeft } from 'lucide-react'
import { SiteFooter } from '@/components/portfolio/SiteChrome'
import { developerProjects, type DeveloperSlug } from '@/content/developer-projects'
import '@/styles/developer-case.css'

export default function DeveloperCasePage({ slug }: { slug: DeveloperSlug }) {
  const project = developerProjects.find(item => item.slug === slug)!
  return <>
    <main className="developer-case" id="main-content" tabIndex={-1}>
      <article className="developer-shell">
        <header className="developer-intro">
          <a className="developer-back" href="#works"><ArrowLeft size={16} aria-hidden />全部作品</a>
          <h1 className="type-heading-h1" lang={slug === 'webide-notebook' ? 'en' : undefined}>{project.title}</h1>
        </header>
        {/* Intentionally empty until the user supplies this project's sources. */}
        <div className="developer-blank" aria-hidden="true" />
      </article>
    </main>
    <SiteFooter compact />
  </>
}
