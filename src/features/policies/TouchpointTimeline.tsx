import { useStore, selectTouchpoints } from '../../store'
import type { TouchpointType } from '../../types'
import styles from './TouchpointTimeline.module.css'

const TYPE_ICONS: Record<TouchpointType, string> = {
  email: '✉',
  call: '📞',
  note: '📝',
  renewal_email: '🔄',
}

const TYPE_LABELS: Record<TouchpointType, string> = {
  email: 'Email',
  call: 'Call',
  note: 'Note',
  renewal_email: 'Renewal email',
}

interface Props {
  policyId: string
}

export function TouchpointTimeline({ policyId }: Props) {
  const touchpoints = useStore(selectTouchpoints)
    .filter((t) => t.policyId === policyId)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (touchpoints.length === 0) {
    return (
      <p className={styles.empty}>
        No touchpoints yet — send the first email to get started.
      </p>
    )
  }

  return (
    <ol className={styles.list} aria-label="Touchpoint history">
      {touchpoints.map((t) => (
        <li key={t.id} className={styles.item}>
          <span className={styles.icon} aria-hidden="true">{TYPE_ICONS[t.type]}</span>
          <div className={styles.body}>
            <span className={styles.type}>{TYPE_LABELS[t.type]}</span>
            <span className={styles.date}>{t.date}</span>
            <span className={styles.note}>{t.note}</span>
          </div>
        </li>
      ))}
    </ol>
  )
}
