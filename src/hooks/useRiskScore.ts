import { useMemo } from 'react'
import { useStore, selectTouchpoints } from '../store'
import { computeRiskScore, computeRiskLevel } from '../lib/riskScore'
import type { Policy, RiskLevel } from '../types'

export function useRiskScore(policy: Policy): { riskScore: number; riskLevel: RiskLevel } {
  const touchpoints = useStore(selectTouchpoints)

  return useMemo(() => {
    const policyTouchpoints = touchpoints.filter((t) => t.policyId === policy.id)
    const riskScore = computeRiskScore(policy, policyTouchpoints)
    const riskLevel = computeRiskLevel(riskScore)
    return { riskScore, riskLevel }
  }, [policy, touchpoints])
}
