import { describe, it } from 'vitest'
import { render } from '@testing-library/react'
import { useRef } from 'react'
import { PolicyRow } from './PolicyRow'
import type { PolicyWithRisk } from '../../types'

const policy: PolicyWithRisk = {
  id: 'p-1',
  clientName: 'Test Co.',
  policyType: 'GL',
  carrier: 'Chubb',
  premium: 50000,
  renewalDate: '2026-05-01',
  premiumChangePct: 5,
  accountExecId: 'exec-1',
  riskScore: 55,
  riskLevel: 'high',
}

function Wrapper() {
  const triggerRef = useRef<Map<string, HTMLTableRowElement | null>>(new Map())
  return (
    <table>
      <tbody>
        <PolicyRow policy={policy} triggerRef={triggerRef} />
      </tbody>
    </table>
  )
}

describe('PolicyRow', () => {
  it('renders without throwing', () => {
    render(<Wrapper />)
  })
})
