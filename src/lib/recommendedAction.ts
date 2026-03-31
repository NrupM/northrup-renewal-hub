import type { Policy, Touchpoint, RiskLevel } from '../types'

interface RecommendedAction {
  label: string
  severity: 'red' | 'orange' | 'yellow'
}

export function getRecommendedAction(
  policy: Policy,
  touchpoints: Touchpoint[],
  riskLevel: RiskLevel
): RecommendedAction | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const renewalDate = new Date(policy.renewalDate)
  renewalDate.setHours(0, 0, 0, 0)
  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  const daysSinceLastTouch = (() => {
    if (touchpoints.length === 0) return Infinity
    const last = touchpoints.reduce((latest, t) =>
      new Date(t.date) > new Date(latest.date) ? t : latest
    )
    const lastDate = new Date(last.date)
    lastDate.setHours(0, 0, 0, 0)
    return Math.ceil((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
  })()

  // Priority order: first matching condition wins
  if (daysUntilRenewal <= 14 && daysSinceLastTouch >= 14) {
    return { label: 'Renewal imminent', severity: 'red' }
  }
  if (riskLevel === 'critical' && daysSinceLastTouch >= 30) {
    return { label: 'Overdue outreach', severity: 'orange' }
  }
  if (riskLevel === 'high' && daysSinceLastTouch >= 45) {
    return { label: 'Follow up due', severity: 'yellow' }
  }
  if (policy.premiumChangePct >= 10 && daysSinceLastTouch >= 30) {
    return { label: 'Discuss premium', severity: 'yellow' }
  }

  return null
}
