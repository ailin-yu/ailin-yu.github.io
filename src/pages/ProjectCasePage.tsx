import { Fragment } from 'react'
import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { AidbsChallengeIllustration } from '@/components/portfolio/AidbsChallengeIllustration'
import { useReducedMotion } from 'motion/react'
import { ProjectCaseLayout } from '@/components/portfolio/ProjectCaseLayout'
import { ProjectCredits } from '@/components/portfolio/ProjectCredits'
import { ProjectCodeBlock } from '@/components/portfolio/ProjectCodeBlock'
import { ZoomableCaseImage } from '@/components/portfolio/ZoomableCaseImage'
import { useTheme } from '@/components/portfolio/ThemeProvider'
import { MediaSlot, SectionTitle, DesignTitle, BulletTitle, ProjectVideo } from '@/components/portfolio/ProjectCaseMedia'
import { caseSectionId, getProjectCase, type CaseMedia } from '@/content/cases'
import type { CaseChapter } from '@/content/cases/types'

function CaseFigure({ media, hero = false }: { media: CaseMedia; hero?: boolean }) {
  const { theme } = useTheme()
  const reducedMotion = useReducedMotion()
  const src = reducedMotion && media.reducedMotionSrc ? media.reducedMotionSrc : theme === 'dark' && media.darkSrc ? media.darkSrc : media.src
  if (media.interactive) return <figure className="project-figure"><AidbsChallengeIllustration kind={media.interactive === 'aidbs-silos' ? 'silos' : 'gap'} src={src} alt={media.alt} />{media.caption && <figcaption>{media.caption}</figcaption>}</figure>
  if (hero && media.kind === 'video') return <ProjectVideo src={media.src} poster={media.poster} label={media.alt} />
  const visual = media.kind === 'video' ? <video controls muted playsInline preload="none" src={media.src} poster={media.poster} width={media.width} height={media.height} aria-label={media.alt} /> : <ZoomableCaseImage src={src} alt={media.alt} width={media.width} height={media.height} eager={hero} />
  return <figure className={hero ? `da-hero-video project-hero-image${media.backgroundSrc ? ' project-hero-framed' : ''}` : 'project-figure'} style={hero && media.backgroundSrc ? { backgroundImage: `url("${media.backgroundSrc}")` } : undefined} data-project-entry-target={hero || undefined}>
    {media.layout === 'wide-diagram' ? <div className="project-diagram-scroll" tabIndex={0} role="region" aria-label="用户旅程图，可左右滚动查看">{visual}</div> : visual}
    {media.layout === 'wide-diagram' ? <figcaption className="project-diagram-caption">
      {media.caption}
      <span className="project-diagram-hint">左右滑动，或点击放大查看完整旅程。</span>
    </figcaption> : media.caption && <figcaption>{media.caption}</figcaption>}
  </figure>
}

function ProjectChapter({ chapter }: { chapter: CaseChapter }) {
  return <section className="project-chapter" id={chapter.id} aria-label={chapter.label}>
    <SectionTitle>{chapter.english}</SectionTitle>
    {!!chapter.paragraphs?.length && <div className="da-design-copy">{chapter.paragraphs.map(copy => <p key={copy}>{copy}</p>)}</div>}
    {!!chapter.media?.length && <div className="project-media-stack">{chapter.media.map(media => <CaseFigure key={media.src} media={media} />)}</div>}
    {!!chapter.items?.length && <div className={chapter.layout === 'columns' ? 'project-chapter-items project-chapter-items-columns' : 'project-chapter-items'}>{chapter.items.map((item, index) => <section className="project-insight" id={item.id} key={item.id}>
      {chapter.numbered ? <DesignTitle number={String(index + 1).padStart(2, '0')}>{item.title}</DesignTitle> : <h3 className="project-insight-title">{item.title}</h3>}
      <div className="da-design-copy">{item.paragraphs.map((copy, paragraphIndex) => <Fragment key={copy}>{chapter.paragraphConnector && paragraphIndex > 0 && <ArrowDown className="project-copy-connector" aria-hidden="true" />}<p>{copy}</p></Fragment>)}</div>
      {!!item.media?.length && <div className={`project-media-stack${item.columns ? ' project-media-columns' : ''}`}>{item.media.map(media => <CaseFigure key={media.src} media={media} />)}</div>}
    </section>)}</div>}
    {chapter.note && <p className="project-chapter-note">{chapter.note}</p>}
  </section>
}

function ProjectLinks({ links }: { links?: { label: string; href: string }[] }) {
  if (!links?.length) return null
  return <nav className="project-links" aria-label="项目链接">{links.map(link => <a href={link.href} key={link.href} target={link.href.startsWith('#') ? undefined : '_blank'} rel={link.href.startsWith('#') ? undefined : 'noreferrer'}>{link.label}<ArrowUpRight size={16} aria-hidden="true" /></a>)}</nav>
}

export default function ProjectCasePage({ slug }: { slug: string }) {
  const project = getProjectCase(slug)
  if (!project) return null
  const id = (name: string) => caseSectionId(project.slug, name)
  return <ProjectCaseLayout slug={project.slug} title={project.title} role={project.role} publication={project.publication} hero={project.hero === null ? null : project.hero ? <CaseFigure media={project.hero} hero /> : <div className="da-hero-video project-hero-empty"><MediaSlot name={`${project.title} 项目首屏`} /></div>}>
    {!!project.overview?.length && <section className="da-overview" id={id('overview')} aria-label="项目介绍">
      {project.overview.map(copy => <p key={copy}>{copy}</p>)}
      <ProjectCredits credits={project.credits} />
      {!!project.teamMembers?.length && <p className="project-team">团队成员：{project.teamMembers.join('、')}。</p>}
    </section>}
    {project.linksPosition === 'overview' && <ProjectLinks links={project.links} />}
    {project.preview && <section className="project-preview" id={id('preview')}>
      <SectionTitle>{project.preview.english}</SectionTitle>
      <div className="project-preview-stack">{project.preview.items.map(item => <section className="project-preview-item" id={item.id} key={item.id} aria-label={item.title}><CaseFigure media={item.media} /></section>)}</div>
    </section>}
    {project.strategy && <section className="da-strategy" id={id('strategy')}>
      <SectionTitle>{project.strategy.english}</SectionTitle><p className="da-strategy-summary">{project.strategy.summary}</p>
      <div className="da-strategy-grid">{project.strategy.items.map((item, index) => <div className="da-strategy-item" key={item.title}><span className="da-strategy-number" lang="en">{String(index + 1).padStart(2, '0')}</span><h3>{item.title}</h3><p>{item.copy}</p></div>)}</div>
    </section>}
    {project.chaptersBeforeHighlights && project.chapters?.map(chapter => <ProjectChapter chapter={chapter} key={chapter.id} />)}
    {project.highlights && <section className="da-highlights" id={id('highlights')}>
      <SectionTitle>{project.highlights.english}</SectionTitle>
      {project.highlights.items.map((item, index) => <section className="da-design project-design" id={item.id} key={item.id}>
        {item.credit ? <div className="project-design-heading">
          <DesignTitle number={String(index + 1).padStart(2, '0')}>{item.title}</DesignTitle>
          <p className="project-design-credit">{item.credit}</p>
        </div> : <DesignTitle number={String(index + 1).padStart(2, '0')}>{item.title}</DesignTitle>}
        <div className="da-design-copy">{item.paragraphs.map(copy => <p key={copy}>{copy}</p>)}</div>
        {item.media?.length ? <div className={`project-media-stack${item.columns ? ' project-media-columns' : ''}`}>{item.media.map(media => <CaseFigure key={media.src} media={media} />)}</div> : !item.subsections?.length && <div className="project-media-stack"><MediaSlot name={item.title} /></div>}
        {item.subsections?.map(subsection => <section className="project-design-subsection" id={subsection.id} key={subsection.id}>
          <BulletTitle>{subsection.title}</BulletTitle>
          <div className="da-design-copy">{subsection.paragraphs.map(copy => <p key={copy}>{copy}</p>)}</div>
          {!!subsection.comparisonNotes?.length && <ol className="project-comparison-notes" aria-label="对比观察点">{subsection.comparisonNotes.map((note, noteIndex) => <li key={note.title}>
            <p className="project-comparison-note-title"><span aria-hidden="true">{String(noteIndex + 1).padStart(2, '0')}</span>{note.title}</p>
            <p>{note.copy}</p>
          </li>)}</ol>}
          {!!subsection.media?.length && <div className={`project-media-stack${subsection.columns ? ' project-media-columns' : ''}`}>{subsection.media.map(media => <CaseFigure key={media.src} media={media} />)}</div>}
        </section>)}
      </section>)}
    </section>}
    {!project.chaptersBeforeHighlights && project.chapters?.map(chapter => <ProjectChapter chapter={chapter} key={chapter.id} />)}
    {project.results && <section className="da-results" id={id('results')}>
      <SectionTitle>{project.results.english || 'Results'}</SectionTitle>{project.results.summary && <p className="da-design-copy">{project.results.summary}</p>}
      {!!project.results.content?.length && <div className="da-design-copy">{project.results.content.map((block, index) => block.kind === 'paragraph'
        ? <p key={index}>{block.text}</p>
        : <ProjectCodeBlock code={block.code} label={block.label} key={index} />)}</div>}
      {!!project.results.awards?.length && <ul className="project-awards" aria-label="获奖清单">{project.results.awards.map(award => <li key={award.title}>{award.title}</li>)}</ul>}
      {project.results.items?.map((item, index) => <div className="da-result-row" id={project.results?.numbered ? id(`result-${index + 1}`) : undefined} key={item.title}><div className="da-result-copy">{project.results?.numbered ? <DesignTitle number={String(index + 1).padStart(2, '0')}>{item.title}</DesignTitle> : <BulletTitle>{item.title}</BulletTitle>}<p>{item.copy}</p></div>{item.media && <CaseFigure media={item.media} />}</div>)}
      {project.results.table && <figure className="project-results-table"><table><thead><tr>{project.results.table.headers.map(header => <th key={header} scope="col">{header}</th>)}</tr></thead><tbody>{project.results.table.rows.map(row => <tr key={row[0]}>{row.map((cell, i) => i === 0 ? <th key={i} scope="row">{cell}</th> : <td key={i} lang="en">{cell}</td>)}</tr>)}</tbody></table><figcaption>{project.results.table.caption}</figcaption></figure>}
    </section>}
    {project.reflection && <section className="project-chapter" id={id('reflection')} aria-label="项目总结"><SectionTitle>Reflection</SectionTitle><div className="da-design-copy"><p>{project.reflection}</p></div></section>}
    {project.linksPosition !== 'overview' && <ProjectLinks links={project.links} />}
  </ProjectCaseLayout>
}
