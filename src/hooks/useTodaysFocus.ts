import { useMemo } from 'react'
import { useStore, selectPolicies, selectTouchpoints } from '../store'
import { computeRiskScore, computeRiskLevel } from '../lib/riskScore'
import type { PolicyWithRisk } from '../types'

export function useTodaysFocus(): PolicyWithRisk[] {
  const policies = useStore(selectPolicies)
  const touchpoints = useStore(selectTouchpoints)

  return useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    return policies
      .map((p) => {
        const policyTouchpoints = touchpoints.filter((t) => t.policyId === p.id)
        const riskScore = computeRiskScore(p, policyTouchpoints)
        const riskLevel = computeRiskLevel(riskScore)

        // Days since last touchpoint (Infinity if never)
        const daysSinceTouch = (() => {
          if (policyTouchpoints.length === 0) return Infinity
          const last = policyTouchpoints.reduce((latest, t) =>
            new Date(t.date) > new Date(latest.date) ? t : latest
          )
          const lastDate = new Date(last.date)
          lastDate.setHours(0, 0, 0, 0)
          return Math.ceil((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
        })()

        return { ...p, riskScore, riskLevel, daysSinceTouch }
      })
      .filter((p) => (p.riskLevel === 'critical' || p.riskLevel === 'high') && p.daysSinceTouch > 30)
      .sort((a, b) => b.riskScore - a.riskScore)
      .slice(0, 5)
  }, [policies, touchpoints])
}
