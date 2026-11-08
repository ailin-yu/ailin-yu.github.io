export type StudentImage = {
  src: string
  width: number
  height: number
  alt: string
  caption: string
  sourcePage: number
}

export type StudentSection = {
  id: string
  title: string
  description?: string
  images?: StudentImage[]
  process?: { original: StudentImage; frames: StudentImage[] }
  layout?: 'stack' | 'pair'
  comparison?: { before: StudentImage; after: StudentImage; note: string }
  observations?: { title: string; detail: string }[]
}

export type StudentProject = {
  slug: string
  title: string
  subtitle: string
  summary: string
  role: string
  category: '学生作品'
  discipline: string
  year?: string
  period?: string
  stage: string
  cover: string
  coverAlt: string
  hero: StudentImage
  sections: StudentSection[]
  sourcePages: string
  sourceNotes: string[]
}

const image = (slug: string, file: string, width: number, height: number, alt: string, caption: string, sourcePage: number): StudentImage => ({
  src: `/cases/student/${slug}/${file}.webp`, width, height, alt, caption, sourcePage,
})

const eraSample = image('era-planet', 'sample', 1800, 766, 'Éra-Planet 实体样品的三处细节：地形模块、拼接木盘和简化后的底盘。', '实体样品照片', 39)
const bubblePrototype = image('elevator-bubble', 'prototype', 1800, 1089, 'Elevator Bubble 原型运行照片，参与者脚下投射出彩色气泡。', '投影原型运行现场', 56)
const heroConcept = image('hero-identity', 'concept', 1500, 951, 'Hero Identity 模块化镜面装置的概念效果图，展示儿童与虚拟角色互动的设想。', '装置概念，非医院部署', 41)

export const studentProjects: StudentProject[] = [
  {
    slug: 'era-planet', title: 'Éra-Planet', subtitle: 'AR 智能木玩',
    summary: '实体地形拼接，连接 AR 生物探索。',
    role: '项目管理（PM）· 交互与视觉设计', category: '学生作品', discipline: '软硬件产品设计', year: '2022', period: '2022.02—2022.08',
    stage: '实体样品 · 部分 AR 功能原型', cover: eraSample.src, coverAlt: eraSample.alt, hero: eraSample,
    sourcePages: '27—40',
    sections: [
      {
        id: 'experience', title: '从实体拼接，进入 AR 探索',
        process: {
          original: image('era-planet', 'experience', 1800, 335, '原方案的四步使用示意：选择时期、模块拼接、AR 扫描、查看生物详情。', '四步体验方案', 34),
          frames: [
            image('era-planet', 'experience-step-1', 450, 335, '原方案第一步：选择时期卡片。', '选择时期', 34),
            image('era-planet', 'experience-step-2', 450, 335, '原方案第二步：拼接实体地形模块。', '拼接地形', 34),
            image('era-planet', 'experience-step-3', 450, 335, '原方案第三步：用手机扫描地形。', 'AR 扫描', 34),
            image('era-planet', 'experience-step-4', 450, 335, '原方案第四步：查看生物详情。', '查看生物', 34),
          ],
        },
        images: [
          image('era-planet', 'interface', 1800, 886, 'Éra-Planet App 的时期选择、地形与生物介绍、AR 扫描等界面方案。', 'App 方案 · 部分 AR 功能原型', 37),
        ],
      },
      {
        id: 'manufacture', title: '把连接结构做简单',
        comparison: {
          before: image('era-planet', 'base-original', 1100, 638, '原版底盘方案包含木质底盘、塑料限位件和用于吸附地形模块的磁铁。', '原方案：限位件与磁铁', 38),
          after: image('era-planet', 'base-simplified', 1100, 628, '简化后的木质底盘，利用底盘和地形模块的形状限位。', '简化方案：利用形状限位', 38),
          note: '与木玩厂沟通后，移除塑料件与磁铁，改用形状限位。',
        },
      },
      {
        id: 'trial', title: '带到亲子体验中',
        images: [image('era-planet', 'family-trial', 1800, 684, '原作品集记录的亲子体验照片，儿童操作实体地形与手机界面；原稿已对部分脸部作遮挡。', '原稿记录的亲子体验', 39)],
        observations: [
          { title: '做到哪里', detail: '实体样品、App 交互原型与部分 AR；6 组线下亲子体验。' },
          { title: '反馈与边界', detail: '部分家长顾虑过早接触屏幕；不证明长期学习收益。' },
        ],
      },
    ],
    sourceNotes: [
      '用户2026-11-08澄清：本人承担项目管理（PM）、整体协调推进与交互/视觉设计；Sheng Yang 主要负责 3D 设计、硬件与视频动画渲染。木玩厂加工实体样品，技术同学使用 Unity 搭建 App；不将全部软硬件开发归为个人。',
      '第39页明确 AR 为部分功能原型，记录6组线下亲子体验与线上问卷。问卷规模未完整保留，不展示满意率、购买率或长期教育成效。',
      '本页仅使用原稿中的静态图片；原稿中的视频入口不是已取得的视频文件。',
    ],
  },
  {
    slug: 'elevator-bubble', title: 'Elevator Bubble', subtitle: '电梯地面交互装置',
    summary: '脚下的投影气泡，回应站位与距离。',
    role: '交互设计 · 原型测试 · 项目协调', category: '学生作品', discipline: '空间交互',
    stage: '学生团队作业 · 运行原型', cover: bubblePrototype.src, coverAlt: bubblePrototype.alt, hero: bubblePrototype,
    sourcePages: '56',
    sections: [
      {
        id: 'interaction', title: '让距离变成可见的气泡',
        process: {
          original: image('elevator-bubble', 'interaction', 1400, 443, '原方案的三种交互形式：站位引导、过近时边缘泛红提示，以及气泡相互融合。', '气泡交互规则示意', 56),
          frames: [
            image('elevator-bubble', 'interaction-step-1', 467, 443, '原方案的站位引导：在乘客脚下生成气泡。', '站位引导', 56),
            image('elevator-bubble', 'interaction-step-2', 466, 443, '原方案的距离提示：乘客过近时，气泡边缘泛红。', '过近时提示', 56),
            image('elevator-bubble', 'interaction-step-3', 467, 443, '原方案的气泡融合：持续接近时两个气泡相融合。', '持续接近时融合', 56),
          ],
        },
      },
      {
        id: 'prototype', title: '用投影原型试一试', layout: 'pair',
        images: [
          image('elevator-bubble', 'system', 1400, 790, '原技术方案图：红外边框采集乘员位置信息，传给计算机并由投影仪输出地面图像。', '原技术方案', 56),
          image('elevator-bubble', 'setup', 900, 1279, '实验原型的现场布置，标注投影仪、电脑、测试人员和地面红外边框。', '实验现场布置，非真实电梯长期部署', 56),
        ],
      },
      {
        id: 'feedback', title: '哪些提示还不够清楚',
        observations: [
          { title: '配色混淆', detail: '红色气泡与距离警示容易混淆。' },
          { title: '提示可见性', detail: '泛红提示有方向性，融合效果也需更明显。' },
          { title: '4 人体验', detail: '当次体验与访谈，未复测；识别误差与遮挡待解决。' },
        ],
      },
    ],
    sourceNotes: [
      '原作品集第56页“个人贡献”记录：全程参与桌面研究、交互方式与技术路线确定、设计输出和用户测试，并协调交互、设计和开发同学。未据此声称独立完成代码或硬件。',
      '同页明确邀请4名被试体验原型并访谈。项目展示的是实验原型，不是已在真实电梯长期部署的系统；不将4人的当次反馈推广为普遍效果。',
      '原稿没有明确项目起止日期，本页不填推测年份。未取得独立视频文件，因此不放播放入口。',
    ],
  },
  {
    slug: 'hero-identity', title: 'Hero Identity', subtitle: '儿童住院服务概念',
    summary: '镜面互动与 App，连接角色、活动与陪伴。',
    role: '交互与部分界面设计', category: '学生作品', discipline: '服务与交互概念', year: '2022',
    stage: '学生团队概念 · 未实地验证', cover: heroConcept.src, coverAlt: heroConcept.alt, hero: heroConcept,
    sourcePages: '41—53',
    sections: [
      {
        id: 'service', title: '把镜面装置和陪伴联系起来',
        images: [image('hero-identity', 'system', 1800, 910, 'Hero Identity 的服务概念图，将镜面交互装置、住院儿童和家长 App 场景联系起来。', '服务与装置概念示意', 42)],
      },
      {
        id: 'interface', title: '用 App 延续角色与活动',
        images: [image('hero-identity', 'interface', 1800, 900, 'Hero Identity 原界面方案，包括角色形象、活动、日程等 App 画面。', 'App 概念方案，非临床运行截图', 52)],
      },
      {
        id: 'boundary', title: '验证边界',
        observations: [
          { title: '个人工作', detail: '需求与竞品分析、交互及部分界面，辅助项目管理。' },
          { title: '未实地验证', detail: '未实地调研，可实现性待验证；无医院部署或临床验证。' },
        ],
      },
    ],
    sourceNotes: [
      '原作品集第41页说明团队主要成员身份、交互与部分界面设计，以及辅助项目进度规划与管理。本页不将其写为本人独立主导。',
      '第53页明确“缺乏实地调研”“方案较为理想化”“可实现性待进一步验证”。效果图与 App 方案不作为真实医院使用或临床验证的证据。',
      '项目年份为2022；原作品集与旧简历的月份范围不一致，本页不展示未经对齐的起止月份。本项目与被排除的腾讯合作幼儿治疗项目分开。',
    ],
  },
]

export type StudentOutlineItem = { id: string; label: string }
export const studentOutlines: Record<string, StudentOutlineItem[]> = Object.fromEntries(studentProjects.map(project => [project.slug, [
  { id: 'main-content', label: '项目概览' },
  ...project.sections.map(section => ({ id: `student-${project.slug}-${section.id}`, label: section.title })),
  { id: `student-${project.slug}-sources`, label: '角色与来源' },
]]))
