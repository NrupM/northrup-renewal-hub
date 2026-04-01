import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  { icon: '◈', label: 'Dashboard', active: true },
  { icon: '⬡', label: 'Renewals', active: false },
  { icon: '◎', label: 'Clients', active: false },
  { icon: '△', label: 'Reports', active: false },
  { icon: '◻', label: 'Settings', active: false },
]

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>◈</span>
        <span className={styles.logoText}>Renewal<br />Hub</span>
      </div>

      <nav className={styles.nav} aria-label="Main navigation">
        <ul className={styles.navList} role="list">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <button
                className={`${styles.navItem} ${item.active ? styles.active : ''}`}
                aria-current={item.active ? 'page' : undefined}
              >
                <span className={styles.navIcon} aria-hidden="true">{item.icon}</span>
                <span className={styles.navLabel}>{item.label}</span>
                {item.active && <span className={styles.activeBar} aria-hidden="true" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className={styles.footer}>
        <div className={styles.statusDot} aria-label="System online" />
        <span className={styles.statusText}>Live</span>
      </div>
    </aside>
  )
}
