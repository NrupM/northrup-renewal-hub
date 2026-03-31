import { useStore, selectAccountExecs } from '../../store'
import { useRiskScore } from '../../hooks/useRiskScore'
import type { Policy } from '../../types'
import styles from './PolicyDetail.module.css'

interface Props {
  policy: Policy
}

function formatPremium(n: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function PolicyDetail({ policy }: Props) {
  const accountExecs = useStore(selectAccountExecs)
  const exec = accountExecs.find((e) => e.id === policy.accountExecId)
  const { riskScore, riskLevel } = useRiskScore(policy)

  const premiumSign = policy.premiumChangePct > 0 ? '+' : ''

  return (
    <dl className={styles.grid}>
      <div className={styles.field}>
        <dt className={styles.label}>Client</dt>
        <dd className={styles.value}>{policy.clientName}</dd>
      </div>
      <div className={styles.field}>
        <dt className={styles.label}>Policy type</dt>
        <dd className={styles.value}>{policy.policyType}</dd>
      </div>
      <div className={styles.field}>
        <dt className={styles.label}>Carrier</dt>
        <dd className={styles.value}>{policy.carrier}</dd>
      </div>
      <div className={styles.field}>
        <dt className={styles.label}>Premium</dt>
        <dd className={styles.value}>{formatPremium(policy.premium)}</dd>
      </div>
      <div className={styles.field}>
        <dt className={styles.label}>Renewal date</dt>
        <dd className={styles.value}>{policy.renewalDate}</dd>
      </div>
      <div className={styles.field}>
        <dt className={styles.label}>Premium change</dt>
        <dd className={styles.value}>
          {premiumSign}{policy.premiumChangePct}%
        </dd>
      </div>
      <div className={styles.field}>
        <dt className={styles.label}>Risk score</dt>
        <dd className={styles.value}>
          <span
            className={styles.riskBadge}
            style={{ color: `var(--risk-${riskLevel})` }}
            aria-label={`Risk level: ${riskLevel}`}
          >
            {riskScore} — {riskLevel}
          </span>
        </dd>
      </div>
      <div className={styles.field}>
        <dt className={styles.label}>Account exec</dt>
        <dd className={styles.value}>{exec?.name ?? '—'}</dd>
      </div>
    </dl>
  )
}
