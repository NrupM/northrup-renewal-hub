export type RiskLevel = 'critical' | 'high' | 'medium' | 'low'
export type PolicyType = 'D&O' | 'GL' | 'EPLI' | 'WC' | 'Umbrella' | 'Package' | 'BOP'
export type TouchpointType = 'email' | 'call' | 'note' | 'renewal_email'

export interface Policy {
  id: string
  clientName: string
  policyType: PolicyType
  carrier: string
  premium: number
  renewalDate: string        // ISO date string
  premiumChangePct: number   // signed — negative = premium decrease
  accountExecId: string
}

export interface AccountExec {
  id: string
  name: string
}

export interface Touchpoint {
  id: string
  policyId: string
  type: TouchpointType
  date: string               // ISO date string
  note: string
}

export interface PolicyWithRisk extends Policy {
  riskScore: number
  riskLevel: RiskLevel
}
