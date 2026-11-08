import type { ProjectCase } from './types'

export const futureVehiclesCase: ProjectCase = {
  slug: 'future-vehicles', title: 'Future Vehicles', state: 'draft', source: 'docs/projects/Future-Vehicles-项目Spec.md',
  hero: null,
  overview: [
    '我本科就读于重庆大学机械与运载工程学院工业设计专业。汽车工程、座舱交互等课程的学习，让我从工程与体验的双重视角探索未来出行。以下两件概念作品创作于 2019-2020 年。',
  ],
  highlights: { label: '概念作品', english: 'Concepts', items: [
    { id: 'future-vehicles-opal', title: 'THE OPAL', credit: '个人作品', paragraphs: [
      '借鉴建筑师 André Broessel 的 Beta Ray 球体太阳能发电原理，将球形集能结构融入交通工具，探索为车辆与城市共享供能的绿色循环。希望在赛博朋克的未来，人与地球仍能和谐共生。',
    ], media: [
      { src: '/cases/future-vehicles/the-opal-energy.webp', alt: 'THE OPAL：球体太阳能集能原理、能源循环与未来城市中的车辆概念', width: 3840, height: 1974 },
      { src: '/cases/future-vehicles/the-opal-scenarios.webp', alt: 'THE OPAL：球形座舱、车辆结构与城市行驶场景', width: 3840, height: 1964 },
    ] },
    { id: 'future-vehicles-origami', title: 'Infiniti Origami', credit: '团队作品 · 作者：Ailin Yu、Yayuan Shen', paragraphs: [
      '通过折叠结构赋予车辆二次生命，构想连接高层建筑的快速通道，以缓解地面交通拥堵，实践 Upcycle（升级再造）理念。',
      '项目获 Michelin Challenge Design 评委奖（Judges’ Award）。这是由米其林发起、具有国际影响力的汽车设计赛事，评委多为全球主要车企的设计负责人，现名为 Movin’On Challenge Design。',
    ], media: [
      { src: '/cases/future-vehicles/infiniti-origami-city.webp', alt: 'Infiniti Origami：折叠车辆形态与高层建筑之间的快速通道', width: 3840, height: 1964 },
      { src: '/cases/future-vehicles/infiniti-origami-folding.webp', alt: 'Infiniti Origami：车辆折叠过程、座舱与座椅结构概念', width: 3840, height: 1964 },
    ] },
  ] },
}
