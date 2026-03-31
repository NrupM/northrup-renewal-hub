import { useStore, selectAccountExecs, selectAssignExec } from '../../store'
import type { Policy } from '../../types'

interface Props {
  policy: Policy
}

export function AssignExec({ policy }: Props) {
  const accountExecs = useStore(selectAccountExecs)
  const assignExec = useStore(selectAssignExec)

  return (
    <label>
      <span>Account exec</span>
      <select
        value={policy.accountExecId}
        onChange={(e) => assignExec(policy.id, e.target.value)}
        aria-label="Assign account exec"
      >
        {accountExecs.map((exec) => (
          <option key={exec.id} value={exec.id}>
            {exec.name}
          </option>
        ))}
      </select>
    </label>
  )
}
