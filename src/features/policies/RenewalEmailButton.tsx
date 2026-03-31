import { useRef } from 'react'
import { useStore, selectSendRenewalEmail } from '../../store'
import type { Policy } from '../../types'

interface Props {
  policy: Policy
}

export function RenewalEmailButton({ policy }: Props) {
  const sendRenewalEmail = useStore(selectSendRenewalEmail)
  const liveRef = useRef<HTMLSpanElement>(null)

  const handleClick = () => {
    sendRenewalEmail(policy.id)
    if (liveRef.current) {
      liveRef.current.textContent = ''
      // Force re-announcement by briefly clearing then setting
      requestAnimationFrame(() => {
        if (liveRef.current) {
          liveRef.current.textContent = `Renewal email logged for ${policy.clientName} ${policy.policyType} policy.`
        }
      })
    }
  }

  return (
    <>
      <button onClick={handleClick}>
        Send renewal email
      </button>
      <span
        ref={liveRef}
        aria-live="polite"
        aria-atomic="true"
        style={{ position: 'absolute', width: 1, height: 1, overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap' }}
      />
    </>
  )
}
