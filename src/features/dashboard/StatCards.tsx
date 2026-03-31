import { useMemo } from 'react'
import { useStore, selectPolicies, selectTouchpoints } from '../../store'
import { computeRiskScore, computeRiskLevel } from '../../lib/riskScore'
import styles from './StatCards.module.css'

export function StatCards() {
  const policies = useStore(selectPolicies)
  const touchpoints = useStore(selectTouchpoints)

  const stats = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    let renewalsDue30 = 0
    let criticalCount = 0
    let contactedLast30 = 0

    for (const p of policies) {
      const policyTouchpoints = touchpoints.filter((t) => t.policyId === p.id)
      const riskScore = computeRiskScore(p, policyTouchpoints)
      const riskLevel = computeRiskLevel(riskScore)

      const renewalDate = new Date(p.renewalDate)
      renewalDate.setHours(0, 0, 0, 0)
      const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntilRenewal <= 30) renewalsDue30++
      if (riskLevel === 'critical') criticalCount++

      const hasRecentTouch = policyTouchpoints.some((t) => {
        const d = new Date(t.date)
        d.setHours(0, 0, 0, 0)
        return Math.ceil((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24)) <= 30
      })
      if (hasRecentTouch) contactedLast30++
    }

    const pctContacted = policies.length > 0
      ? Math.round((contactedLast30 / policies.length) * 100)
      : 0

    return { renewalsDue30, criticalCount, pctContacted }
  }, [policies, touchpoints])

  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <span className={styles.value}>{stats.renewalsDue30}</span>
        <span className={styles.label}>Renewals due in ≤30 days</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value} style={{ color: 'var(--risk-critical)' }}>{stats.criticalCount}</span>
        <span className={styles.label}>Critical risk policies</span>
      </div>
      <div className={styles.card}>
        <span className={styles.value}>{stats.pctContacted}%</span>
        <span className={styles.label}>Contacted in last 30 days</span>
      </div>
    </div>
  )
}
