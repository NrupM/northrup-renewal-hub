import { describe, it, expect } from 'vitest'
import { computeRiskScore, computeRiskLevel } from '../lib/riskScore'
import type { Policy, Touchpoint, PolicyWithRisk } from '../types'

// Replicate the pipeline logic from useTodaysFocus without needing React/store.

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
    renewalDate: isoDate(20),   // ≤30d renewal → urgency score
    premiumChangePct: 20,        // ≥15% → max price score
    accountExecId: 'exec-1',
    ...overrides,
  }
}

function todaysFocus(policies: Policy[], touchpoints: Touchpoint[]): PolicyWithRisk[] {
  const today = new Date(TODAY)
  today.setHours(0, 0, 0, 0)

  return policies
    .map((p) => {
      const pts = touchpoints.filter((t) => t.policyId === p.id)
      const riskScore = computeRiskScore(p, pts)
      const riskLevel = computeRiskLevel(riskScore)

      const daysSinceTouch = (() => {
        if (pts.length === 0) return Infinity
        const last = pts.reduce((latest, t) =>
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
}

describe('useTodaysFocus pipeline', () => {
  it('returns at most 5 results, all critical or high risk', () => {
    // Build 8 high-risk policies with no touchpoints (daysSinceTouch = Infinity)
    const policies = Array.from({ length: 8 }, (_, i) => makePolicy(`p-${i}`))
    const result = todaysFocus(policies, [])
    expect(result.length).toBeLessThanOrEqual(5)
    result.forEach((p) => {
      expect(['critical', 'high']).toContain(p.riskLevel)
    })
  })
})
