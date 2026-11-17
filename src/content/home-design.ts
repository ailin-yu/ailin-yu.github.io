/** Measured from Figma QVjaUsoQt69LeMckHJnz4Q / 95:740, 2026-11-06.
 * The hero's independent Chinese and Latin baselines are intentional.
 * Do not collapse them into a paragraph or align them to one shared baseline.
 */
export const homeHeroText = [
  { text: 'Hi', x: 200, y: 312.769, face: 'latin' },
  { text: '，', x: 232, y: 310.58, face: 'latin' },
  { text: '我是艾琳', x: 260.56, y: 310.58, face: 'chinese' },
  { text: '我', x: 200, y: 365.58, face: 'chinese' },
  { text: 'Build', x: 234, y: 367.769, face: 'latin' },
  // User spacing correction after enlarging the bubble to 39.6px (2026-11-07).
  { text: '产品，连接技术与体验', x: 363, y: 365.58, face: 'chinese' },
  { text: '目前在', x: 200, y: 420.58, face: 'chinese' },
  { text: '，做', x: 409, y: 420.58, face: 'chinese' },
  { text: 'Agent', x: 482, y: 422.769, face: 'latin' },
  { text: '与数据库产品，探索', x: 574, y: 420.58, face: 'chinese' },
  { text: 'AI Native', x: 847, y: 422.769, face: 'latin' },
  { text: '设计工程', x: 985, y: 420.58, face: 'chinese' },
  { text: 'Nice to meet you :)', x: 200, y: 507.769, face: 'latin' },
] as const

type WorkImage = { src: string; width: number; height: number; position?: string }
type WorkOverlay = WorkImage & { placement: { x: number; y: number; width: number } }
export type HomeWorkCover = ((WorkImage & { background?: WorkImage }) | { src?: never; width?: never; height?: never; background: WorkImage }) & { overlay?: WorkOverlay }

export const homeDesignProjects = [
  { slug: 'data-agent', menuDescription: '企业数据分析与持续探索', title: 'Data Agent', subtitle: 'Web & Mobile, Product', cover: { src: '01.webp', width: 2048, height: 1456, background: { src: 'BG-01.webp', width: 733, height: 637 }, overlay: { src: 'data-agent-phone-running.png', width: 856, height: 1776, placement: { x: 20, y: 166.859375, width: 135 } } }, kind: 'data-agent' },
  { slug: 'aidbs', menuDescription: '面向数据库任务的 AI 工作台', title: 'AI Database Service', subtitle: 'Web, Product', cover: { src: '02.webp', width: 2048, height: 1456, background: { src: 'BG-02.webp', width: 1346, height: 1168 } }, kind: 'template' },
  { slug: 'cloudai', menuDescription: '面向 Agent 的设计工程基座', title: 'CloudAI Design', subtitle: 'A Design Toolkit to Build With', cover: { src: '03.webp', width: 1600, height: 1720 }, kind: 'template' },
  { slug: 'playbook', menuDescription: 'AI 协作与 AI 产品设计指南', title: 'Vibe Designing Playbook', subtitle: 'Practical Guide', cover: { src: '04.webp', width: 1600, height: 1720 }, kind: 'template' },
  { slug: 'cscw', menuDescription: 'Agent 过程透明度的体验研究', title: 'AI Agents Experience Research', subtitle: 'CSCW 2025', cover: { src: 'cscw-conference.webp', width: 1600, height: 2133, position: 'center 30%' }, kind: 'template' },
  { slug: 'webide-notebook', menuDescription: '开发者体验', title: 'DMS WebIDE', subtitle: 'Web, Product', cover: { src: 'webide.webp', width: 2880, height: 2048, background: { src: 'BG-06.webp', width: 1346, height: 1168 } }, kind: 'template' },
  { slug: 'era-planet', menuDescription: 'AR & 软硬件交互', title: 'Éra-Planet', subtitle: 'AR, Software & Hardware', cover: { src: '06.webp', width: 2132, height: 1600 }, kind: 'template' },
  { slug: 'future-vehicles', menuDescription: '未来交通工具概念设计', title: 'Future Vehicles', subtitle: 'Concept Design', cover: { src: '07.webp', width: 2448, height: 1728, position: '35% center' }, kind: 'template' },
] as const

// Rebalanced for the shorter public role: equal intervals and similar end margins.
// Labels, timeline nodes and plant roots share these anchors.
export const homeExperienceAnchors = [120, 396, 672, 948, 1224] as const

export const homeDesignPlants = [
  { x: homeExperienceAnchors[0] - 27, width: 73, scaleX: .00464624, offsetX: -.00757576, name: '小苗' },
  { x: homeExperienceAnchors[1] - 29, width: 92, scaleX: .0036946, offsetX: -.789157, name: '花苞' },
  { x: homeExperienceAnchors[2] - 50, width: 126, scaleX: .00268993, offsetX: -1.14474, name: '初开' },
  { x: homeExperienceAnchors[3] - 51, width: 135, scaleX: .00251354, offsetX: -1.93033, name: '舒展' },
  { x: homeExperienceAnchors[4] - 75, width: 205, scaleX: .00164866, offsetX: -1.92204, name: '成丛' },
] as const

