import { describe, it, expect } from 'vitest'
import { computeRiskScore, computeRiskLevel } from '../lib/riskScore'
import type { Policy, Touchpoint, PolicyWithRisk } from '../types'

// Replicate the pipeline logic from useFilteredPolicies so we can test it
// without needing a React/DOM environment.

const TODAY = '2026-04-01'

function isoDate(daysFromToday: number): string {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + daysFromToday)
  return d.toISOString().split('T')[0]
}

function makePolicy(id: string, overrides: Partial<Policy> = {}): Policy {
  return {
    id,
    clientName: `Client ${id}`,
    policyType: 'GL',
    carrier: 'Chubb',
    premium: 50000,
    renewalDate: isoDate(120),
    premiumChangePct: 0,
    accountExecId: 'exec-1',
    ...overrides,
  }
}

function pipeline(
  policies: Policy[],
  touchpoints: Touchpoint[],
  search: string
): PolicyWithRisk[] {
  return policies
    .map((p) => {
      const pts = touchpoints.filter((t) => t.policyId === p.id)
      const riskScore = computeRiskScore(p, pts)
      const riskLevel = computeRiskLevel(riskScore)
      return { ...p, riskScore, riskLevel } as PolicyWithRisk
    })
    .filter((p) => {
      if (search && !p.clientName.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    .sort((a, b) => b.riskScore - a.riskScore)
}

describe('useFilteredPolicies pipeline', () => {
  it('filtered results exclude non-matching policies', () => {
    const policies = [
      makePolicy('p-1', { clientName: 'Acme Corp' }),
      makePolicy('p-2', { clientName: 'Beta Ltd' }),
    ]
    const result = pipeline(policies, [], 'acme')
    expect(result).toHaveLength(1)
    expect(result[0].id).toBe('p-1')
  })

  it('results are sorted by riskScore descending', () => {
    // p-high: renewal in 10 days, no touchpoints, 15% premium increase → max score
    // p-low: renewal in 120 days, no premium change → low score
    const policies = [
      makePolicy('p-low', { renewalDate: isoDate(120), premiumChangePct: 0 }),
      makePolicy('p-high', { renewalDate: isoDate(10), premiumChangePct: 20 }),
    ]
    const result = pipeline(policies, [], '')
    expect(result[0].id).toBe('p-high')
    expect(result[0].riskScore).toBeGreaterThan(result[1].riskScore)
  })
})
