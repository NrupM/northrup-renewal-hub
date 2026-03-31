import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Policy, AccountExec, Touchpoint, RiskLevel, PolicyType } from '../types'
import { generateSeedData } from '../lib/seed'

interface Filters {
  riskLevel: RiskLevel | 'all'
  policyType: PolicyType | 'all'
  accountExecId: string | 'all'
  search: string
}

interface State {
  policies: Policy[]
  accountExecs: AccountExec[]
  touchpoints: Touchpoint[]
  filters: Filters
  selectedPolicyId: string | null

  // Actions
  assignExec: (policyId: string, execId: string) => void
  sendRenewalEmail: (policyId: string) => void
  addTouchpoint: (touchpoint: Omit<Touchpoint, 'id'>) => void
  setFilters: (filters: Partial<Filters>) => void
  setSelectedPolicy: (id: string | null) => void
  initializeIfEmpty: () => void
}

export const useStore = create<State>()(
  persist(
    (set, get) => ({
      policies: [],
      accountExecs: [],
      touchpoints: [],
      filters: {
        riskLevel: 'all',
        policyType: 'all',
        accountExecId: 'all',
        search: '',
      },
      selectedPolicyId: null,

      assignExec: (policyId, execId) =>
        set((s) => ({
          policies: s.policies.map((p) =>
            p.id === policyId ? { ...p, accountExecId: execId } : p
          ),
        })),

      sendRenewalEmail: (policyId) => {
        const policy = get().policies.find((p) => p.id === policyId)
        if (!policy) return
        const touchpoint: Touchpoint = {
          id: `tp-email-${Date.now()}-${policyId}`,
          policyId,
          type: 'renewal_email',
          date: new Date().toISOString().split('T')[0],
          note: 'Renewal email sent',
        }
        set((s) => ({ touchpoints: [touchpoint, ...s.touchpoints] }))
      },

      addTouchpoint: (touchpoint) => {
        const newTouchpoint: Touchpoint = {
          ...touchpoint,
          id: `tp-${Date.now()}-${touchpoint.policyId}`,
        }
        set((s) => ({ touchpoints: [newTouchpoint, ...s.touchpoints] }))
      },

      setFilters: (filters) =>
        set((s) => ({ filters: { ...s.filters, ...filters } })),

      setSelectedPolicy: (id) => set({ selectedPolicyId: id }),

      initializeIfEmpty: () => {
        try {
          const { policies } = get()
          if (policies.length === 0) {
            const { policies: seedPolicies, touchpoints: seedTouchpoints, accountExecs } =
              generateSeedData()
            set({ policies: seedPolicies, touchpoints: seedTouchpoints, accountExecs })
          }
        } catch (err) {
          console.warn('Failed to initialize store from seed data:', err)
          const { policies: seedPolicies, touchpoints: seedTouchpoints, accountExecs } =
            generateSeedData()
          set({ policies: seedPolicies, touchpoints: seedTouchpoints, accountExecs })
        }
      },
    }),
    {
      name: 'northrup-renewal-hub',
    }
  )
)

// Named selectors — centralized, imported by name in components
export const selectPolicies = (s: State) => s.policies
export const selectTouchpoints = (s: State) => s.touchpoints
export const selectFilters = (s: State) => s.filters
export const selectAccountExecs = (s: State) => s.accountExecs
export const selectSelectedPolicy = (s: State) =>
  s.policies.find((p) => p.id === s.selectedPolicyId) ?? null
export const selectSetFilters = (s: State) => s.setFilters
export const selectSetSelectedPolicy = (s: State) => s.setSelectedPolicy
export const selectAssignExec = (s: State) => s.assignExec
export const selectSendRenewalEmail = (s: State) => s.sendRenewalEmail
export const selectInitializeIfEmpty = (s: State) => s.initializeIfEmpty
