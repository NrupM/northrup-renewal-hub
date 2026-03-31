import { useStore, selectFilters, selectSetFilters, selectAccountExecs } from '../../store'
import type { RiskLevel, PolicyType } from '../../types'
import styles from './FilterBar.module.css'

const RISK_LEVELS: (RiskLevel | 'all')[] = ['all', 'critical', 'high', 'medium', 'low']
const POLICY_TYPES: (PolicyType | 'all')[] = ['all', 'D&O', 'GL', 'EPLI', 'WC', 'Umbrella', 'Package', 'BOP']

export function FilterBar() {
  const filters = useStore(selectFilters)
  const setFilters = useStore(selectSetFilters)
  const accountExecs = useStore(selectAccountExecs)

  return (
    <div className={styles.bar} role="search" aria-label="Filter policies">
      <select
        className={styles.select}
        value={filters.riskLevel}
        onChange={(e) => setFilters({ riskLevel: e.target.value as RiskLevel | 'all' })}
        aria-label="Filter by risk level"
      >
        {RISK_LEVELS.map((level) => (
          <option key={level} value={level}>
            {level === 'all' ? 'All risk levels' : level.charAt(0).toUpperCase() + level.slice(1)}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={filters.policyType}
        onChange={(e) => setFilters({ policyType: e.target.value as PolicyType | 'all' })}
        aria-label="Filter by policy type"
      >
        {POLICY_TYPES.map((type) => (
          <option key={type} value={type}>
            {type === 'all' ? 'All policy types' : type}
          </option>
        ))}
      </select>

      <select
        className={styles.select}
        value={filters.accountExecId}
        onChange={(e) => setFilters({ accountExecId: e.target.value })}
        aria-label="Filter by account exec"
      >
        <option value="all">All account execs</option>
        {accountExecs.map((exec) => (
          <option key={exec.id} value={exec.id}>
            {exec.name}
          </option>
        ))}
      </select>

      <input
        className={styles.search}
        type="search"
        placeholder="Search client name…"
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value })}
        aria-label="Search by client name"
      />
    </div>
  )
}
