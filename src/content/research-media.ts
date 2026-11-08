/** Figures extracted without redrawing from the author's local publication PDF.
 * Captions match the paper and ACM's public full-text index.
 * File paths and pixel verification are recorded in docs/reviews/2026-11-03-research-figures.md.
 */
export const researchPaper = {
  title: 'Exploring the Impact of Process Transparency on User Experience in AI Design Agents',
  authors: [
    { name: 'Ailin Yu', marker: '*' },
    { name: 'Zehui Jin', marker: '*' },
    { name: 'Yan Zhu', marker: '*' },
    { name: 'Yue He', marker: '*' },
    { name: 'Tao Yang', marker: '†' },
    { name: 'Luping Wang', marker: '†' },
  ],
  affiliation: 'Alibaba Cloud Computing · Hangzhou, China',
  venue: 'CSCW Companion 2025 · Poster',
  doi: '10.1145/3715070.3749256',
  href: 'https://doi.org/10.1145/3715070.3749256',
  citation: 'Ailin Yu et al. · CSCW Companion 2025 · Poster · pp. 379–384',
} as const

export const researchFigures = [
  {
    number: 1,
    title: '过程信息项与重要性',
    src: '/cases/research/figure-01.webp',
    width: 2149,
    height: 1273,
    pdfPage: 2,
    caption: 'Critical information identified with varying levels of importance during the task execution of an AI agent.',
    alt: '论文图 1：规划、执行、总结三个阶段的十项过程信息，以及必要、高、中、低四种重要性标记。',
  },
  {
    number: 2,
    title: '三种透明度条件的原型示例',
    src: '/cases/research/figure-02.webp',
    width: 2130,
    height: 1636,
    pdfPage: 3,
    caption: 'Examples of Level of Process Transparency',
    alt: '论文图 2：海报生成模拟中的低、中、高透明度条件，保留原实验界面与各条件的信息组成。',
  },
] as const

/** Homepage cover: resized only from the author's supplied Thumbnail Image.jpg.
 * This is Figure 1, not a generated cover or a reconstruction of the research UI.
 */
export const researchCover = {
  src: '/cases/research/research-cover.webp',
  originalSrc: '/cases/research/author-thumbnail.jpg',
  width: 1600,
  height: 948,
  figureNumber: 1,
  alt: researchFigures[0].alt,
  caption: researchFigures[0].caption,
  sourceHref: researchPaper.href,
  objectFit: 'contain',
  objectPosition: 'center',
} as const
