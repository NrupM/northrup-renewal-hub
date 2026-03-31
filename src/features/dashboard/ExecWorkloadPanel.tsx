import { useMemo } from 'react'
import { useStore, selectPolicies, selectTouchpoints, selectAccountExecs } from '../../store'
import { computeRiskScore, computeRiskLevel } from '../../lib/riskScore'
import styles from './ExecWorkloadPanel.module.css'

export function ExecWorkloadPanel() {
  const policies = useStore(selectPolicies)
  const touchpoints = useStore(selectTouchpoints)
  const accountExecs = useStore(selectAccountExecs)

  const rows = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const exec of accountExecs) {
      counts[exec.id] = 0
    }
    for (const p of policies) {
      const policyTouchpoints = touchpoints.filter((t) => t.policyId === p.id)
      const score = computeRiskScore(p, policyTouchpoints)
      const level = computeRiskLevel(score)
      if (level === 'critical' || level === 'high') {
        counts[p.accountExecId] = (counts[p.accountExecId] ?? 0) + 1
      }
    }
    const maxCount = Math.max(1, ...Object.values(counts))
    return accountExecs.map((exec) => ({
      exec,
      count: counts[exec.id] ?? 0,
      pct: Math.round(((counts[exec.id] ?? 0) / maxCount) * 100),
    }))
  }, [policies, touchpoints, accountExecs])

  return (
    <div className={styles.panel}>
      <h2 className={styles.heading}>Account Exec Workload</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Exec</th>
            <th className={styles.th}>At-risk</th>
            <th className={styles.th} aria-label="Relative workload"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ exec, count, pct }) => (
            <tr key={exec.id} className={styles.row}>
              <td className={styles.td}>{exec.name}</td>
              <td className={styles.tdCount}>{count}</td>
              <td className={styles.tdBar}>
                <div className={styles.barTrack}>
                  <div className={styles.barFill} style={{ width: `${pct}%` }} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
