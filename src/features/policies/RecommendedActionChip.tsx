import type { Policy, Touchpoint, RiskLevel } from '../../types'
import { getRecommendedAction } from '../../lib/recommendedAction'
import styles from './RecommendedActionChip.module.css'

interface Props {
  policy: Policy
  touchpoints: Touchpoint[]
  riskLevel: RiskLevel
}

export function RecommendedActionChip({ policy, touchpoints, riskLevel }: Props) {
  const action = getRecommendedAction(policy, touchpoints, riskLevel)
  if (!action) return null

  return (
    <span className={`${styles.chip} ${styles[action.severity]}`}>
      {action.label}
    </span>
  )
}
