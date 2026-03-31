import { useEffect, useRef } from 'react'
import { useStore, selectInitializeIfEmpty } from '../../store'
import { StatCards } from './StatCards'
import { ExecWorkloadPanel } from './ExecWorkloadPanel'
import { TodaysFocus } from './TodaysFocus'
import { FilterBar } from './FilterBar'
import { PolicyTable } from '../policies/PolicyTable'
import { PolicyDrawer } from '../policies/PolicyDrawer'
import { ErrorBoundary } from '../../components/ErrorBoundary'
import styles from './DashboardLayout.module.css'

export function DashboardLayout() {
  const initializeIfEmpty = useStore(selectInitializeIfEmpty)
  const triggerRef = useRef<Map<string, HTMLTableRowElement | null>>(new Map())

  useEffect(() => {
    initializeIfEmpty()
  }, [initializeIfEmpty])

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Renewal Hub</h1>
      </header>

      <ErrorBoundary>
        <main className={styles.main}>
          <section className={styles.topRow}>
            <StatCards />
            <ExecWorkloadPanel />
          </section>

          <section className={styles.focus}>
            <TodaysFocus />
          </section>

          <section className={styles.tableSection}>
            <FilterBar />
            <PolicyTable triggerRef={triggerRef} />
          </section>
        </main>
      </ErrorBoundary>

      <ErrorBoundary>
        <PolicyDrawer triggerRefs={triggerRef} />
      </ErrorBoundary>
    </div>
  )
}
