import { describe, it, expect } from 'vitest'
import { getRecommendedAction } from './recommendedAction'
import type { Policy, Touchpoint } from '../types'

const TODAY = '2026-04-01'

function isoDate(daysFromToday: number): string {
  const d = new Date(TODAY)
  d.setDate(d.getDate() + daysFromToday)
  return d.toISOString().split('T')[0]
}

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  return {
    id: 'p-1',
    clientName: 'Test Co.',
    policyType: 'GL',
    carrier: 'Chubb',
    premium: 50000,
    renewalDate: isoDate(60),
    premiumChangePct: 0,
    accountExecId: 'exec-1',
    ...overrides,
  }
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

describe('getRecommendedAction', () => {
  it('returns chip when renewal imminent condition matches', () => {
    // renewal in 10 days, last touch 20 days ago
    const policy = makePolicy({ renewalDate: isoDate(10) })
    const result = getRecommendedAction(policy, [touchpointDaysAgo(20)], 'high')
    expect(result).toEqual({ label: 'Renewal imminent', severity: 'red' })
  })

  it('returns chip for overdue outreach on critical policy with no touchpoints', () => {
    const policy = makePolicy({ renewalDate: isoDate(45) })
    const result = getRecommendedAction(policy, [], 'critical')
    expect(result).toEqual({ label: 'Overdue outreach', severity: 'orange' })
  })

  it('returns null when no condition matches', () => {
    // renewal in 60 days, recent touchpoint, low premium change
    const policy = makePolicy({ premiumChangePct: 2 })
    const result = getRecommendedAction(policy, [touchpointDaysAgo(5)], 'low')
    expect(result).toBeNull()
  })

  it('first matching condition wins (renewal imminent takes priority over overdue outreach)', () => {
    // Both could match: renewal ≤14d + no touch ≥14d, AND critical with no touch ≥30d
    const policy = makePolicy({ renewalDate: isoDate(10) })
    const result = getRecommendedAction(policy, [], 'critical')
    expect(result?.label).toBe('Renewal imminent')
  })
})
