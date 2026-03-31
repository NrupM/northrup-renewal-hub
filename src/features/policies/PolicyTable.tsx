import { useMemo, useRef, useCallback } from 'react'
import { List } from 'react-window'
import type { RowComponentProps } from 'react-window'
import { useStore, selectSetFilters } from '../../store'
import { useFilteredPolicies } from '../../hooks/useFilteredPolicies'
import { PolicyRow } from './PolicyRow'
import type { PolicyWithRisk } from '../../types'
import styles from './PolicyTable.module.css'

const ROW_HEIGHT = 48

interface SharedRowProps {
  policies: PolicyWithRisk[]
  triggerRef: React.RefObject<Map<string, HTMLTableRowElement | null>>
}

function TableRow({
  ariaAttributes,
  index,
  style,
  policies,
  triggerRef,
}: RowComponentProps<SharedRowProps>) {
  const policy = policies[index]
  return (
    <div style={style} {...ariaAttributes}>
      <table className={styles.rowTable}>
        <tbody>
          <PolicyRow policy={policy} triggerRef={triggerRef} />
        </tbody>
      </table>
    </div>
  )
}

export function PolicyTable() {
  const policies = useFilteredPolicies()
  const setFilters = useStore(selectSetFilters)
  const triggerRef = useRef<Map<string, HTMLTableRowElement | null>>(new Map())

  const rowProps = useMemo<SharedRowProps>(
    () => ({ policies, triggerRef }),
    [policies]
  )

  const clearFilters = useCallback(() => {
    setFilters({ riskLevel: 'all', policyType: 'all', accountExecId: 'all', search: '' })
  }, [setFilters])

  return (
    <div className={styles.container}>
      <table
        className={styles.table}
        role="grid"
        aria-rowcount={policies.length}
        aria-label="Policy table"
      >
        <thead>
          <tr role="row">
            <th className={styles.th} scope="col">Client</th>
            <th className={styles.th} scope="col">Type</th>
            <th className={styles.th} scope="col">Carrier</th>
            <th className={`${styles.th} ${styles.numeric}`} scope="col">Premium</th>
            <th className={styles.th} scope="col">Renewal date</th>
            <th className={`${styles.th} ${styles.numeric}`} scope="col">Days left</th>
            <th className={styles.th} scope="col">Risk</th>
            <th className={styles.th} scope="col">Action</th>
          </tr>
        </thead>
      </table>

      {policies.length === 0 ? (
        <div className={styles.empty} role="status">
          <p>No policies match your filters.</p>
          <button className={styles.clearBtn} onClick={clearFilters}>
            Clear filters
          </button>
        </div>
      ) : (
        <List
          rowHeight={ROW_HEIGHT}
          rowCount={policies.length}
          rowComponent={TableRow}
          rowProps={rowProps}
          defaultHeight={600}
          style={{ width: '100%' }}
        />
      )}
    </div>
  )
}
