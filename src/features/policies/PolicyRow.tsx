import { memo, useCallback } from 'react'
import { useStore, selectTouchpoints, selectSetSelectedPolicy } from '../../store'
import { RecommendedActionChip } from './RecommendedActionChip'
import type { PolicyWithRisk } from '../../types'
import styles from './PolicyRow.module.css'

interface Props {
  policy: PolicyWithRisk
  triggerRef?: React.RefObject<Map<string, HTMLTableRowElement | null>>
}

const TODAY = new Date()
TODAY.setHours(0, 0, 0, 0)

function daysUntil(isoDate: string): number {
  const d = new Date(isoDate)
  d.setHours(0, 0, 0, 0)
  return Math.ceil((d.getTime() - TODAY.getTime()) / (1000 * 60 * 60 * 24))
}

function formatPremium(n: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n)
}

export const PolicyRow = memo(function PolicyRow({ policy, triggerRef }: Props) {
  const touchpoints = useStore(selectTouchpoints).filter((t) => t.policyId === policy.id)
  const setSelectedPolicy = useStore(selectSetSelectedPolicy)
  const days = daysUntil(policy.renewalDate)

  const open = useCallback(() => {
    setSelectedPolicy(policy.id)
  }, [policy.id, setSelectedPolicy])

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      open()
    }
  }, [open])

  return (
    <tr
      className={styles.row}
      role="row"
      tabIndex={0}
      onClick={open}
      onKeyDown={onKeyDown}
      ref={(el) => { triggerRef?.current?.set(policy.id, el) }}
      aria-label={`${policy.clientName} — ${policy.policyType}`}
    >
      <td className={styles.td}>{policy.clientName}</td>
      <td className={styles.td}>{policy.policyType}</td>
      <td className={styles.td}>{policy.carrier}</td>
      <td className={`${styles.td} ${styles.numeric}`}>{formatPremium(policy.premium)}</td>
      <td className={styles.td}>{policy.renewalDate}</td>
      <td className={`${styles.td} ${styles.numeric} ${days <= 14 ? styles.urgent : ''}`}>{days}d</td>
      <td className={styles.td}>
        <span
          className={styles.badge}
          style={{ color: `var(--risk-${policy.riskLevel})` }}
          aria-label={`Risk level: ${policy.riskLevel}`}
        >
          {policy.riskLevel}
        </span>
      </td>
      <td className={styles.td}>
        <RecommendedActionChip
          policy={policy}
          touchpoints={touchpoints}
          riskLevel={policy.riskLevel}
        />
      </td>
    </tr>
  )
})
