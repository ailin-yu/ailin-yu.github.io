import { useId } from 'react'

const c = { paper: 'var(--surface)', ink: 'var(--foreground)', blue: 'var(--brand)', pale: 'var(--brand-2)', light: 'var(--brand-1)', line: 'var(--border)', gray: 'var(--muted-foreground)', soft: 'var(--muted)' }

function BrowserFrame({ dark = false }: { dark?: boolean }) {
  return <><rect x="66" y="66" width="868" height="508" rx="12" fill={dark ? c.ink : c.paper} stroke={c.line} /><path d="M66 110H934" stroke={c.line} />{[88, 104, 120].map(x => <circle key={x} cx={x} cy="89" r="4" fill={c.line} />)}<text x="150" y="95" fill={c.gray} fontSize="15">{dark ? 'CloudAI Design' : 'AIDBS / Data Agent'}</text></>
}

export function ProjectVisual({ slug, className = '' }: { slug: string; className?: string }) {
  const id = useId()
  const titles: Record<string, string> = { 'ai-database': '时间口径澄清交互的结构重绘', 'data-agent': '上下文、对话与产物三栏工作台结构示意', cloudai: 'CloudAI 生成式界面资产层级示意', cscw: '高、中、低透明度的信息范围概览' }
  return <svg className={`project-visual ${className}`} viewBox="0 0 1000 640" role="img" aria-labelledby={id} style={{ fontFamily: 'var(--font-reading-mixed)' }}>
    <title id={id}>{titles[slug]}</title>
    {slug === 'ai-database' && <>
      <rect width="1000" height="640" fill="var(--gray-3)" />
      <text x="40" y="194" fontSize="148" fill="var(--gray-4)" fontFamily="var(--font-display-en)">GenUI</text>
      <g transform="translate(28 30) scale(.94)"><BrowserFrame /><rect x="67" y="111" width="154" height="462" rx="7" fill={c.soft} /><text x="89" y="153" fontSize="17" fill={c.ink}>数据库服务</text>{['搜索', '新任务', '数据源', '知识库', '任务记录'].map((t, i) => <text key={t} x="90" y={204 + i * 45} fontSize="16" fill={c.gray}>{t}</text>)}<rect x="78" y="414" width="130" height="36" rx="4" fill={c.light} /><text x="90" y="438" fill={c.blue} fontSize="15">时间口径澄清</text>
      <rect x="321" y="152" width="509" height="64" rx="7" fill={c.light} /><text x="342" y="178" fill={c.blue} fontSize="15">Insight</text><text x="342" y="201" fill={c.ink} fontSize="16">需要确认的口径</text>
      <rect x="320" y="236" width="510" height="269" rx="10" fill={c.paper} stroke={c.line} /><text x="346" y="277" fill={c.ink} fontSize="23" fontWeight="600">计算的时间基准是什么？</text><text x="346" y="307" fill={c.gray} fontSize="16">选择分析使用的统计口径</text>
      <rect x="344" y="327" width="462" height="61" rx="6" fill={c.light} stroke={c.blue} /><circle cx="367" cy="357" r="8" fill="none" stroke={c.blue} strokeWidth="2" /><circle cx="367" cy="357" r="4" fill={c.blue} /><text x="390" y="353" fill={c.ink} fontSize="18">order_date</text><text x="390" y="376" fill={c.gray} fontSize="15">订单创建时间</text><circle cx="367" cy="416" r="8" fill="none" stroke={c.line} strokeWidth="2" /><text x="390" y="412" fill={c.ink} fontSize="18">pay_time</text><text x="390" y="436" fill={c.gray} fontSize="15">支付时间</text><rect x="737" y="457" width="67" height="31" rx="4" fill={c.ink} /><text x="755" y="478" fill={c.paper} fontSize="15">确认</text>
      <path d="M331 538H824" stroke={c.line} /><text x="341" y="558" fontSize="15" fill={c.gray}>将用户的选择，接回任务。</text></g>
    </>}
    {slug === 'data-agent' && <>
      <rect width="1000" height="640" fill={c.pale} /><circle cx="890" cy="10" r="255" fill={c.light} /><circle cx="-18" cy="642" r="210" fill={c.light} />
      <g transform="translate(-14 10) scale(1.025)"><BrowserFrame /><path d="M294 111V574M664 111V574" stroke={c.line} /><text x="88" y="152" fill={c.gray} fontSize="15">上下文</text><text x="320" y="152" fill={c.ink} fontSize="18" fontWeight="600">Data Agent</text><text x="687" y="152" fill={c.gray} fontSize="15">产物与过程</text>
      <rect x="85" y="175" width="191" height="37" rx="5" fill={c.soft} /><text x="101" y="199" fill={c.ink} fontSize="15">▤　数据与业务知识</text>{[0, 1, 2, 3, 4, 5, 6, 7].map(i => <g key={i}><path d={`M88 ${241 + i * 31}H272`} stroke={c.line} /><rect x="90" y={224 + i * 31} width={50 + i % 3 * 13} height="7" rx="2" fill={c.line} /><rect x="177" y={224 + i * 31} width="64" height="7" rx="2" fill={i % 3 ? c.line : c.pale} /></g>)}
      <rect x="351" y="182" width="279" height="40" rx="7" fill={c.light} /><text x="369" y="208" fill={c.ink} fontSize="16">Top 客户画像分析</text><text x="322" y="262" fill={c.blue} fontSize="17">✧　Data Agent</text><text x="323" y="297" fill={c.ink} fontSize="16">已生成分析计划</text>{['检索知识与数据', '执行分析任务', '整理阶段产物'].map((t, i) => <g key={t}><circle cx="332" cy={338 + 50 * i} r="8" fill={i < 2 ? c.light : c.soft} stroke={i < 2 ? c.blue : c.line} /><text x="353" y={343 + i * 50} fontSize="16" fill={c.ink}>{t}</text>{i < 2 && <path d={`M332 ${349 + i * 50}V${376 + i * 50}`} stroke={c.line} />}</g>)}<rect x="315" y="507" width="326" height="43" rx="7" fill={c.soft} /><text x="331" y="534" fontSize="15" fill={c.gray}>继续提问，或查看分析结果</text>
      <rect x="685" y="180" width="225" height="162" rx="7" fill={c.soft} /><text x="700" y="209" fill={c.ink} fontSize="17">分析报告</text><path d="M702 313H895M702 241V313" stroke={c.line} /><path d="M708 296L735 280L765 288L795 253L825 263L853 235L889 248" fill="none" stroke={c.blue} strokeWidth="3" /><path d="M708 306L735 292L765 297L795 275L825 281L853 261L889 276" fill="none" stroke="var(--gray-6)" strokeWidth="2" /><text x="688" y="382" fontSize="16" fill={c.gray}>阶段产物</text>{['分析依据', '任务总结', '数据结果'].map((t, i) => <g key={t}><rect x="686" y={400 + i * 43} width="224" height="33" rx="4" fill={i === 0 ? c.light : c.soft} /><text x="699" y={422 + i * 43} fill={c.ink} fontSize="15">▧　{t}</text></g>)}</g>
    </>}
    {slug === 'cloudai' && <>
      <rect width="1000" height="640" fill={c.ink} /><text x="56" y="93" fill={c.paper} fontSize="27">CloudAI</text><text x="56" y="135" fill="var(--gray-6)" fontSize="17">DESIGN FOR GENERATION</text><text x="56" y="257" fill={c.paper} fontSize="38" fontFamily="var(--font-heading-zh)">从设计判断</text><text x="56" y="313" fill={c.paper} fontSize="38" fontFamily="var(--font-heading-zh)">到动态界面</text><text x="56" y="531" fill="var(--gray-6)" fontSize="16">RULES · COMPONENTS · GENUI</text>
      {[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(610 ${145 + i * 78})`}><path d="M0 -28L204 22L0 72L-204 22Z" fill={i === 1 ? 'var(--brand-10)' : 'var(--gray-11)'} stroke={i === 1 ? 'var(--brand-5)' : 'var(--gray-8)'} /><path d="M-117 4L-33 -17L51 4L-33 24ZM-5 31L79 10L163 31L79 51Z" fill="none" stroke={i === 1 ? 'var(--brand-3)' : 'var(--gray-7)'} /><text x="228" y="27" fill={i === 1 ? 'var(--brand-3)' : 'var(--gray-6)'} fontSize="16">{['Template', 'Block', 'Rules', 'Renderer', 'Registry'][i]}</text></g>)}
    </>}
    {slug === 'cscw' && <>
      <rect width="1000" height="640" fill={c.light} /><text x="57" y="89" fill={c.ink} fontSize="19">CSCW COMPANION 2025</text><text x="57" y="151" fill={c.ink} fontSize="38" fontFamily="var(--font-heading-zh)">过程，应该被看见多少？</text>
      {['高透明度', '中透明度', '低透明度'].map((t, i) => <g key={t} transform={`translate(${57 + i * 304} 210)`}><text x="0" y="0" fill={c.blue} fontSize="24" fontFamily="var(--font-heading-zh)">{t}</text>{['规划', '执行', '总结'].map((phase, j) => <g key={phase}><rect x="0" y={30 + j * 68} width="266" height="50" rx="4" fill={(i < 2 || j === 2) ? c.paper : 'none'} stroke={c.line} strokeDasharray={i === 2 && j < 2 ? '4 5' : undefined} /><text x="18" y={61 + j * 68} fill={i === 2 && j < 2 ? 'var(--gray-6)' : c.ink} fontSize="17">{phase}</text>{(i < 2 || j === 2) && <g>{Array.from({ length: i === 0 ? 4 : i === 1 ? 2 : 1 }, (_, k) => <circle key={k} cx={147 + k * 24} cy={55 + j * 68} r="5" fill={c.blue} opacity={1 - k * .16} />)}</g>}</g>)}<text x="0" y="295" fill={c.gray} fontSize="17">{['全部已识别的过程信息', '关键进展与任务总结', '主要提供任务总结'][i]}</text></g>)}
      <path d="M57 550H943" stroke={c.line} /><text x="57" y="588" fill={c.gray} fontSize="16">研究条件概览 · 40 位参与者 · 被试内比较</text>
    </>}
  </svg>
}
