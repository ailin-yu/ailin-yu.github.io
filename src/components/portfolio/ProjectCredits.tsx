import type { CaseCredit } from '@/content/cases/types'

export function ProjectCredits({ credits }: { credits?: readonly CaseCredit[] }) {
  if (!credits?.length) return null
  return <div className="project-credits" aria-label="项目署名">
    {credits.map(credit => <p key={credit.label}>{credit.label}：{credit.names.join('、')}</p>)}
  </div>
}
