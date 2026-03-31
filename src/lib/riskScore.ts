import type { Policy, Touchpoint, RiskLevel } from '../types'

export function computeRiskScore(policy: Policy, touchpoints: Touchpoint[]): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Urgency: days until renewal
  const renewalDate = new Date(policy.renewalDate)
  renewalDate.setHours(0, 0, 0, 0)
  const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  let urgencyScore = 0
  if (daysUntilRenewal <= 30) urgencyScore = 40
  else if (daysUntilRenewal <= 60) urgencyScore = 25
  else if (daysUntilRenewal <= 90) urgencyScore = 10
  else urgencyScore = 0

  // Engagement gap: days since last touchpoint
  let engagementScore = 0
  if (touchpoints.length === 0) {
    engagementScore = 35
  } else {
    const lastTouchpoint = touchpoints.reduce((latest, t) => {
      return new Date(t.date) > new Date(latest.date) ? t : latest
    })
    const lastDate = new Date(lastTouchpoint.date)
    lastDate.setHours(0, 0, 0, 0)
    const daysSinceTouch = Math.ceil((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))

    if (daysSinceTouch >= 90) engagementScore = 35
    else if (daysSinceTouch >= 60) engagementScore = 25
    else if (daysSinceTouch >= 30) engagementScore = 15
    else engagementScore = 0
  }

  // Price pressure: premium change %
  let priceScore = 0
  const pct = policy.premiumChangePct
  if (pct >= 15) priceScore = 25
  else if (pct >= 10) priceScore = 18
  else if (pct >= 5) priceScore = 10
  else if (pct >= 1) priceScore = 5
  else priceScore = 0

  return urgencyScore + engagementScore + priceScore
}

export function computeRiskLevel(score: number): RiskLevel {
  if (score >= 75) return 'critical'
  if (score >= 50) return 'high'
  if (score >= 25) return 'medium'
  return 'low'
}
