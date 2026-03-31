import { useEffect, useRef, useCallback } from 'react'
import { useStore, selectSelectedPolicy, selectSetSelectedPolicy } from '../../store'
import { PolicyDetail } from './PolicyDetail'
import { AssignExec } from './AssignExec'
import { RenewalEmailButton } from './RenewalEmailButton'
import { TouchpointTimeline } from './TouchpointTimeline'
import styles from './PolicyDrawer.module.css'

interface Props {
  /** Map from policy id → the table row that opened the drawer */
  triggerRefs: React.RefObject<Map<string, HTMLTableRowElement | null>>
}

export function PolicyDrawer({ triggerRefs }: Props) {
  const policy = useStore(selectSelectedPolicy)
  const setSelectedPolicy = useStore(selectSetSelectedPolicy)
  const panelRef = useRef<HTMLDivElement>(null)
  const isOpen = policy !== null

  // Focus the panel when drawer opens
  useEffect(() => {
    if (isOpen && panelRef.current) {
      panelRef.current.focus()
    }
  }, [isOpen, policy?.id])

  const close = useCallback(() => {
    const id = policy?.id
    setSelectedPolicy(null)
    // Return focus to the triggering row
    if (id) {
      const row = triggerRefs.current?.get(id)
      if (row) {
        // Delay slightly so the DOM has settled
        requestAnimationFrame(() => row.focus())
      }
    }
  }, [policy?.id, setSelectedPolicy, triggerRefs])

  // ESC closes the drawer
  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }

      // Focus trap: Tab / Shift+Tab cycles within panel
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((el) => !el.hasAttribute('disabled'))

        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [close]
  )

  return (
    <>
      {/* Overlay — only interactive when open */}
      <div
        className={styles.overlay}
        style={{ display: isOpen ? 'block' : 'none' }}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={policy ? `${policy.clientName} policy details` : 'Policy details'}
        tabIndex={-1}
        className={`${styles.panel} ${isOpen ? styles.open : ''}`}
        onKeyDown={onKeyDown}
      >
        {policy && (
          <div className={styles.content}>
            <header className={styles.header}>
              <h2 className={styles.title}>{policy.clientName}</h2>
              <button
                className={styles.closeBtn}
                onClick={close}
                aria-label="Close policy details"
              >
                ✕
              </button>
            </header>

            <section className={styles.section} aria-label="Policy details">
              <PolicyDetail policy={policy} />
            </section>

            <section className={styles.section} aria-label="Account exec">
              <h3 className={styles.sectionTitle}>Assign exec</h3>
              <AssignExec policy={policy} />
            </section>

            <section className={styles.section} aria-label="Actions">
              <h3 className={styles.sectionTitle}>Actions</h3>
              <RenewalEmailButton policy={policy} />
            </section>

            <section className={styles.section} aria-label="Touchpoint history">
              <h3 className={styles.sectionTitle}>Touchpoint history</h3>
              <TouchpointTimeline policyId={policy.id} />
            </section>
          </div>
        )}
      </div>
    </>
  )
}
