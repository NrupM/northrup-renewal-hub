import { useEffect, useRef } from 'react'
import { useStore, selectInitializeIfEmpty } from '../../store'
import { Sidebar } from './Sidebar'
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

  const now = new Date()
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })

  return (
    <div className={styles.shell}>
      <Sidebar />

      <div className={styles.content}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Policy Renewals</h1>
            <span className={styles.subtitle}>Commercial Insurance Portfolio</span>
          </div>
          <div className={styles.headerRight}>{dateStr}</div>
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
    </div>
  )
}
