import { describe, it, expect } from 'vitest'
import { computeRiskScore, computeRiskLevel } from './riskScore'
import type { Policy, Touchpoint } from '../types'

// Use a fixed "today" by controlling the renewal date relative to 2026-04-01
const TODAY = '2026-04-01'

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    id: 'p-1',
    clientName: 'Test Co.',
    policyType: 'GL',
    carrier: 'Chubb',
    premium: 50000,
    renewalDate: TODAY, // defaults to today — will be overridden per test
    premiumChangePct: 0,
    accountExecId: 'exec-1',
    ...overrides,
  }
}

function isoDate(daysFromToday: number): string {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + daysFromToday)
  return d.toISOString().split('T')[0]
}

function touchpointDaysAgo(daysAgo: number): Touchpoint {
  return {
    id: 'tp-1',
    policyId: 'p-1',
    type: 'email',
    date: isoDate(-daysAgo),
    note: 'test',
  }
}

describe('computeRiskScore', () => {
  it('returns 100 for max risk: renewal ≤30d, no touchpoints, premium change ≥15%', () => {
    const policy = makePolicy({ renewalDate: isoDate(15), premiumChangePct: 20 })
    const score = computeRiskScore(policy, [])
    expect(score).toBe(100) // 40 urgency + 35 engagement + 25 price
  })

  it('returns 0 for zero risk: renewal >90d, recent touchpoint, no premium increase', () => {
    const policy = makePolicy({ renewalDate: isoDate(120), premiumChangePct: -2 })
    const score = computeRiskScore(policy, [touchpointDaysAgo(5)])
    expect(score).toBe(0) // 0 urgency + 0 engagement + 0 price
  })
})

describe('computeRiskLevel', () => {
  it('returns critical for score ≥75', () => {
    expect(computeRiskLevel(75)).toBe('critical')
    expect(computeRiskLevel(100)).toBe('critical')
  })

  it('returns high for score 50–74', () => {
    expect(computeRiskLevel(50)).toBe('high')
    expect(computeRiskLevel(74)).toBe('high')
  })

  it('returns medium for score 25–49', () => {
    expect(computeRiskLevel(25)).toBe('medium')
    expect(computeRiskLevel(49)).toBe('medium')
  })

  it('returns low for score 0–24', () => {
    expect(computeRiskLevel(0)).toBe('low')
    expect(computeRiskLevel(24)).toBe('low')
  })
})
