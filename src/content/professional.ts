// Dates and roles follow the supplied résumé. Undated talks were confirmed by
// the user on 2026-11-05; do not infer talk titles or dates.
export const careerStops = [
  { id: 'tencent', company: '腾讯光子', date: '2022.06—2022.12', role: '交互设计实习', note: '参与跨端游戏系统交互，与视觉和研发协作推进实现。', logo: '/brands/tencent-blue.png', darkLogo: '/brands/tencent-white.png' },
  { id: 'aliyun-intern', company: '阿里云', date: '2023.06—2023.10', role: '体验设计实习', note: '进入企业级产品设计，理解技术能力与用户任务之间的关系。', logo: '/brands/alibaba-cloud-orange.svg' },
  { id: 'aliyun', company: '阿里云', date: '2024.04—至今', role: '体验设计师 · 数据库工具线设计负责人', note: '负责 AIDBS、Data Agent 体验设计；作为 CloudAI 核心成员主导 GenUI。', logo: '/brands/alibaba-cloud-orange.svg' },
] as const

export const playbookLinks = { read: 'https://alibaba-cloud-design.github.io/vibe-designing-playbook/', source: 'https://github.com/Alibaba-Cloud-Design/vibe-designing-playbook' }
export const speakingRecords = [
  { venue: 'D20 工作坊', format: '工作坊 · 2026', note: '与 Playbook 作者共同举办 Vibe Designing 工作坊，并分享工作中的方法与实践。' },
  { venue: '云栖大会', format: '行业分享', note: '分享产品与设计实践。' },
  { venue: '浙江大学 · 同济大学', format: '高校交流', note: '将工作中的专业实践带到高校，与师生交流。' },
] as const
