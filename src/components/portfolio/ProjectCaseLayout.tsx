import type { ReactNode } from 'react'
import { ThemeToggle } from '@/components/portfolio/ThemeProvider'
import { WorkMenu } from '@/components/portfolio/WorkMenu'
import { canonicalCaseSlug, nextCase } from '@/content/cases'
import { caseHref } from '@/content/portfolio-catalog'
import type { CasePublication } from '@/content/cases/types'
import '@/styles/data-agent-case.css'

export function ProjectCaseLayout({ slug, title, role, hero, publication, children }: { slug: string; title: string; role?: string; hero: ReactNode; publication?: CasePublication; children?: ReactNode }) {
  const canonical = canonicalCaseSlug(slug)
  const next = nextCase(canonical)
  const home = () => {
    sessionStorage.removeItem('portfolio-home-scroll')
    sessionStorage.removeItem('portfolio-home-return')
  }
  return <div className={`data-agent-case project-case${canonical === 'data-agent' ? '' : ' project-case-template'}`}>
    <header className="da-topbar"><nav className="da-breadcrumb" aria-label="当前位置"><a href="#works" lang="en">Ailin Yu’ s Work</a><span aria-hidden="true">/</span><WorkMenu currentSlug={canonical} variant="breadcrumb" /></nav><div className="da-topbar-actions"><a href="#" lang="en" onClick={home}>Home</a><ThemeToggle /></div></header>
    <main id="main-content" tabIndex={-1}>
      <article>
        {publication ? <header className="da-project-header da-publication-header">
          <p className="publication-label" lang="en">{title}</p>
          <h1 lang="en">{publication.title}</h1>
          <ol className="publication-authors" aria-label="论文作者，按发表顺序排列">{publication.authors.map(author => <li key={author.name} lang="en">{author.name}{author.marker && <sup>{author.marker}</sup>}</li>)}</ol>
          {publication.affiliation && <p className="publication-affiliation" lang="en">{publication.affiliation}</p>}
          <div className="publication-meta"><p className="publication-venue" lang="en">{publication.venue}</p><a className="publication-doi" lang="en" href={publication.href} target="_blank" rel="noreferrer">DOI: {publication.doi} ↗</a></div>
          {!!publication.notes?.length && <p className="publication-notes">{publication.notes.join('；')}</p>}
        </header> : <header className="da-project-header"><h1 lang="en">{title}</h1>{role && <p>{role}</p>}</header>}
        {hero}
        <div className="da-content">
          {children}
          <footer className="da-footer"><a href={caseHref(next.slug)} className="da-next" data-next-transition={canonical === 'cloudai' ? 'playbook' : undefined}><span lang="en">Next →</span><span lang="en">{next.title}<span className="da-asterisk" aria-hidden="true">*</span></span></a><small lang="en">© 2026 Ailin Yu</small></footer>
        </div>
      </article>
    </main>
  </div>
}
