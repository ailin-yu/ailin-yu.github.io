import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState, useTransition, type MouseEvent, type ReactNode } from 'react'
import { MotionConfig } from 'motion/react'
import { flushSync } from 'react-dom'
import { HomePage } from '@/pages/HomePage'
import { SiteHeader } from '@/components/portfolio/SiteChrome'
import { CaseFrame } from '@/components/portfolio/CaseFrame'
import { portfolioItems } from '@/content/portfolio-catalog'
import { caseModules } from '@/lib/case-modules'
import { beginProjectReturn, cancelProjectEntry, finishProjectEntry, finishProjectReturn } from '@/lib/project-entry-transition'
import { getProjectCase } from '@/content/cases'
import '@/styles/portfolio.css'

const StudentCasePage = lazy(caseModules['student'])
const DeveloperCasePage = lazy(caseModules['developer'])

const FoundationPage = lazy(() => import('@/pages/FoundationPage').then(module => ({ default: module.FoundationPage })))
const DataAgentCasePage = lazy(caseModules['data-agent'])
const ProjectCasePage = lazy(caseModules['template'])

function CaseArrival({ children, hash }: { children: ReactNode; hash: string }) {
  useLayoutEffect(() => { finishProjectEntry(hash) }, [hash])
  useEffect(() => {
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [])
  return children
}

function CaseLoading() {
  return <main className="shell missing-project" id="main-content" tabIndex={-1} aria-busy="true"><p role="status">正在打开作品…</p></main>
}

export default function App() {
  const [hash, setHash] = useState(window.location.hash)
  const [isNavigating, startNavigation] = useTransition()
  const previousProject = useRef(false)
  const pendingHomeSection = useRef<string | null>(null)
  const caseNextTransition = useRef<ViewTransition | null>(null)
  const navigateHomeSection = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return
    const nextHash = event.currentTarget.hash
    const section = document.getElementById(nextHash.slice(1))
    if (!section) return
    event.preventDefault()
    if (nextHash === hash) {
      section.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
      return
    }
    // Update the URL without the browser's immediate fragment jump; the route effect scrolls once.
    pendingHomeSection.current = nextHash
    history.pushState(history.state, '', nextHash)
    startNavigation(() => setHash(nextHash))
  }
  const requestedSlug = hash.startsWith('#/projects/') ? hash.slice('#/projects/'.length) : null
  const slug = requestedSlug === 'aidbs' ? 'ai-database' : requestedSlug
  const sharedCase = slug ? getProjectCase(slug) : undefined
  const project = portfolioItems.find(p => p.slug === slug)
  useEffect(() => () => { cancelProjectEntry(); caseNextTransition.current?.skipTransition() }, [])
  useEffect(() => {
    const navigate = async (from: string, next: string) => {
      document.dispatchEvent(new Event('portfolio:before-case-navigation'))
      caseNextTransition.current?.skipTransition()
      if (from === '#/projects/cloudai' && next === '#/projects/playbook' && typeof document.startViewTransition === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
        cancelProjectEntry()
        document.documentElement.dataset.caseNextTransition = 'true'
        const transition = document.startViewTransition(async () => {
          await caseModules.template()
          if (location.hash !== next) return
          flushSync(() => setHash(next))
          window.scrollTo({ top: 0, behavior: 'instant' })
          const image = document.querySelector<HTMLImageElement>('.case-content [data-project-entry-target] img')
          if (image) {
            let timer = 0
            await Promise.race([image.decode().catch(() => {}), new Promise<void>(resolve => { timer = window.setTimeout(resolve, 700) })])
            window.clearTimeout(timer)
          }
        })
        caseNextTransition.current = transition
        const finish = () => {
          if (caseNextTransition.current !== transition) return
          caseNextTransition.current = null
          delete document.documentElement.dataset.caseNextTransition
        }
        void transition.finished.then(finish, finish)
        return
      }
      await beginProjectReturn(from, next)
      if (location.hash !== next) return
      startNavigation(() => setHash(next))
    }
    const update = (event: HashChangeEvent) => { void navigate(new URL(event.oldURL).hash, location.hash) }
    const returnLink = (event: globalThis.MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || !location.hash.startsWith('#/projects/')) return
      const anchor = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null
      if (!anchor || anchor.hasAttribute('download') || anchor.target && anchor.target !== '_self') return
      const destination = new URL(anchor.href)
      if (destination.origin !== location.origin || destination.pathname !== location.pathname || destination.search !== location.search || !['', '#works'].includes(destination.hash)) return
      event.preventDefault() // Preserve the current reading position until fade-out finishes.
      const from = location.hash
      history.pushState(history.state, '', anchor.href)
      void navigate(from, destination.hash)
    }
    window.addEventListener('hashchange', update)
    document.addEventListener('click', returnLink)
    const priorRestoration = history.scrollRestoration
    history.scrollRestoration = 'manual'
    return () => { window.removeEventListener('hashchange', update); document.removeEventListener('click', returnLink); history.scrollRestoration = priorRestoration }
  }, [])
  useEffect(() => {
    document.title = sharedCase || project ? `${(sharedCase || project)!.title} · 余艾琳` : '余艾琳 Ailin Yu · AI Product Builder'
    const frame = requestAnimationFrame(() => {
      if (project || slug) window.scrollTo({ top: 0, behavior: 'auto' })
      else if (finishProjectReturn(hash)) sessionStorage.removeItem('portfolio-home-return')
      else if (previousProject.current && sessionStorage.getItem('portfolio-home-return') && !['#practice', '#experience', '#contact'].includes(hash)) {
        window.scrollTo({ top: Number(sessionStorage.getItem('portfolio-home-scroll') || 0), behavior: 'auto' })
        sessionStorage.removeItem('portfolio-home-return')
      }
      else if (['#works', '#practice', '#experience', '#contact'].includes(hash)) document.querySelector(hash === '#practice' ? '#works' : hash)?.scrollIntoView({ behavior: pendingHomeSection.current === hash && !matchMedia('(prefers-reduced-motion: reduce)').matches ? 'smooth' : 'instant' })
      else if (previousProject.current) window.scrollTo({ top: Number(sessionStorage.getItem('portfolio-home-scroll') || 0), behavior: 'auto' })
      else if (!hash) window.scrollTo({ top: 0, behavior: 'auto' })
      previousProject.current = !!project || !!sharedCase
      pendingHomeSection.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, project, slug, sharedCase])
  if (hash === '#foundation') return <Suspense fallback={<div className="shell">正在打开样式预览…</div>}><FoundationPage /></Suspense>
  return (
    <MotionConfig reducedMotion="user">
      <a href="#main-content" className="skip-link" onClick={event => {
        event.preventDefault()
        const main = document.getElementById('main-content')
        main?.focus()
        main?.scrollIntoView()
      }}>跳到主要内容</a>
      {slug && !sharedCase && <SiteHeader currentSlug={slug} />}
      <div className="route-surface" aria-busy={isNavigating}>
      <Suspense fallback={<CaseLoading />}>
      {sharedCase ? (
        <CaseArrival key={slug} hash={hash}><CaseFrame slug={slug!}>{sharedCase.state === 'custom' ? <DataAgentCasePage /> : <ProjectCasePage slug={slug!} />}</CaseFrame></CaseArrival>
      ) : project ? (
          <CaseArrival key={slug} hash={hash}>
            <CaseFrame slug={slug || project.slug}>{project.kind === 'student' ? <StudentCasePage slug={project.slug} /> : project.kind === 'developer' ? <DeveloperCasePage slug={project.slug as 'webide-notebook' | 'yaochi'} /> : null}</CaseFrame>
          </CaseArrival>
      ) : slug ? (
        <main className="shell missing-project" id="main-content" tabIndex={-1}>
          <h1 className="type-heading-h1">还没有这篇作品。</h1>
          <a className="text-link" href="#works">返回全部作品 →</a>
        </main>
      ) : <HomePage onSectionNavigate={navigateHomeSection} />}
      </Suspense>
      </div>
    </MotionConfig>
  )
}
