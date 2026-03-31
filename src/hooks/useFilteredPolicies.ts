import { useMemo, useDeferredValue } from 'react'
import { useStore, selectPolicies, selectTouchpoints, selectFilters } from '../store'
import { computeRiskScore, computeRiskLevel } from '../lib/riskScore'
import type { PolicyWithRisk } from '../types'

export function useFilteredPolicies(): PolicyWithRisk[] {
  const policies = useStore(selectPolicies)
  const touchpoints = useStore(selectTouchpoints)
  const filters = useStore(selectFilters)
  const deferredSearch = useDeferredValue(filters.search)

  return useMemo(() => {
    return policies
      .map((p) => {
        const policyTouchpoints = touchpoints.filter((t) => t.policyId === p.id)
        const riskScore = computeRiskScore(p, policyTouchpoints)
        const riskLevel = computeRiskLevel(riskScore)
        return { ...p, riskScore, riskLevel } as PolicyWithRisk
      })
      .filter((p) => {
        if (filters.riskLevel !== 'all' && p.riskLevel !== filters.riskLevel) return false
        if (filters.policyType !== 'all' && p.policyType !== filters.policyType) return false
        if (filters.accountExecId !== 'all' && p.accountExecId !== filters.accountExecId) return false
        if (deferredSearch && !p.clientName.toLowerCase().includes(deferredSearch.toLowerCase())) return false
        return true
      })
      .sort((a, b) => b.riskScore - a.riskScore)
  }, [policies, touchpoints, filters.riskLevel, filters.policyType, filters.accountExecId, deferredSearch])
}
