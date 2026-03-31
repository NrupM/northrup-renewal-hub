import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RecommendedActionChip } from './RecommendedActionChip'
import type { Policy } from '../../types'

function isoDate(daysFromToday: number): string {
  const d = new Date('2026-04-01')
  d.setDate(d.getDate() + daysFromToday)
  return d.toISOString().split('T')[0]
}

const policy: Policy = {
  id: 'p-1',
  clientName: 'Test Co.',
  policyType: 'GL',
  carrier: 'Chubb',
  premium: 50000,
  renewalDate: isoDate(10),   // ≤14d → "Renewal imminent"
  premiumChangePct: 0,
  accountExecId: 'exec-1',
}

describe('RecommendedActionChip', () => {
  it('renders chip label when action exists', () => {
    render(
      <RecommendedActionChip
        policy={policy}
        touchpoints={[]}
        riskLevel="high"
      />
    )
    expect(screen.getByText('Renewal imminent')).toBeTruthy()
  })
})
