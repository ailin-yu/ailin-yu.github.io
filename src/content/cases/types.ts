export type CaseMedia = {
  src: string
  backgroundSrc?: string
  darkSrc?: string
  reducedMotionSrc?: string
  alt: string
  width?: number
  height?: number
  kind?: 'image' | 'video'
  poster?: string
  caption?: string
  layout?: 'wide-diagram'
  interactive?: 'aidbs-silos' | 'aidbs-gap'
}
export type CaseHighlight = {
  id: string
  title: string
  outlineLabel?: string
  credit?: string
  paragraphs: string[]
  media?: CaseMedia[]
  columns?: boolean
  comparisonNotes?: { title: string; copy: string }[]
  subsections?: CaseHighlight[]
}
export type CaseOutlineItem = { id: string; label: string; english?: string; children?: CaseOutlineItem[] }
export type CaseCredit = { label: string; names: readonly string[] }
export type CasePublication = {
  title: string
  authors: readonly { name: string; marker?: string }[]
  affiliation?: string
  venue: string
  notes?: readonly string[]
  href: string
  doi: string
}
export type CaseChapter = {
  id: string
  label: string
  english: string
  numbered?: boolean
  layout?: 'columns'
  paragraphConnector?: boolean
  paragraphs?: string[]
  media?: CaseMedia[]
  items?: CaseHighlight[]
  note?: string
}
export type ProjectCase = {
  slug: string
  title: string
  role?: string
  state: 'draft' | 'empty' | 'custom'
  source?: string
  hero?: CaseMedia | null
  publication?: CasePublication
  overview?: string[]
  reflection?: string
  teamMembers?: string[]
  credits?: CaseCredit[]
  chapters?: CaseChapter[]
  chaptersBeforeHighlights?: boolean
  preview?: { label: string; english: string; items: { id: string; title: string; media: CaseMedia }[] }
  strategy?: { label: string; english: string; summary: string; items: { title: string; copy: string }[] }
  highlights?: { label: string; english: string; items: CaseHighlight[] }
  results?: { numbered?: boolean; label?: string; english?: string; summary?: string; content?: ({ kind: 'paragraph'; text: string } | { kind: 'code'; code: string; label: string })[]; awards?: { title: string; year: string }[]; items?: { title: string; outlineLabel?: string; copy: string; media?: CaseMedia }[]; table?: { headers: string[]; rows: string[][]; caption: string } }
  links?: { label: string; href: string }[]
  linksPosition?: 'overview' | 'end'
}
