import { useEffect } from 'react'
import { useStore, selectInitializeIfEmpty } from '../../store'
import { StatCards } from './StatCards'
import { ExecWorkloadPanel } from './ExecWorkloadPanel'
import { TodaysFocus } from './TodaysFocus'
import { FilterBar } from './FilterBar'
import { PolicyTable } from '../policies/PolicyTable'
import { PolicyDrawer } from '../policies/PolicyDrawer'
import styles from './DashboardLayout.module.css'

export function DashboardLayout() {
  const initializeIfEmpty = useStore(selectInitializeIfEmpty)

  useEffect(() => {
    initializeIfEmpty()
  }, [initializeIfEmpty])

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <h1 className={styles.title}>Renewal Hub</h1>
      </header>

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
          <PolicyTable />
        </section>
      </main>

      <PolicyDrawer />
    </div>
  )
}
