import { useMemo } from 'react'
import { useStore, selectSendRenewalEmail } from '../../store'
import { useTodaysFocus } from '../../hooks/useTodaysFocus'
import styles from './TodaysFocus.module.css'

export function TodaysFocus() {
  const policies = useTodaysFocus()
  const sendRenewalEmail = useStore(selectSendRenewalEmail)

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Today's Focus</h2>
      {policies.length === 0 ? (
        <p className={styles.empty}>No high-priority policies need outreach today.</p>
      ) : (
        <ul className={styles.list} role="list">
          {policies.map((p) => {
            const renewalDate = new Date(p.renewalDate)
            renewalDate.setHours(0, 0, 0, 0)
            const daysUntilRenewal = Math.ceil((renewalDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

            return (
              <li key={p.id} className={styles.row}>
                <span className={styles.client}>{p.clientName}</span>
                <span className={styles.type}>{p.policyType}</span>
                <span className={styles.days}>{daysUntilRenewal}d</span>
                <span
                  className={styles.badge}
                  style={{ color: `var(--risk-${p.riskLevel})` }}
                  aria-label={`Risk level: ${p.riskLevel}`}
                >
                  {p.riskLevel}
                </span>
                <button
                  className={styles.emailBtn}
                  onClick={() => sendRenewalEmail(p.id)}
                >
                  Send email
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
