import type { Policy, AccountExec, Touchpoint, PolicyType, TouchpointType } from '../types'

// Seeded PRNG — mulberry32
function mulberry32(seed: number) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rand = mulberry32(42)

function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min
}

function randItem<T>(arr: T[]): T {
  return arr[Math.floor(rand() * arr.length)]
}

// Domain-accurate data
const POLICY_TYPES: PolicyType[] = ['D&O', 'GL', 'EPLI', 'WC', 'Umbrella', 'Package', 'BOP']

const CARRIERS = [
  'Great American',
  'Crum & Foster',
  'Chubb',
  'Hanover',
  'The Hartford',
  'Philadelphia',
  'SAIF Corp',
]

const CLIENT_NAMES = [
  'Cascade Brewing Co.',
  'Powell Books LLC',
  'Oregon Steel Works',
  'Pacific NW Logistics',
  'Rose City Roasters',
  'Willamette Dental Group',
  'Portland Gear Hub',
  'Tualatin Valley Fire',
  'Multnomah County Credit Union',
  'Sellwood Bridge Consulting',
  'Beaverton Honda',
  'Lake Oswego Properties',
  'Eastside Pediatrics',
  'NW Natural Gas',
  'Columbia Sportswear Retail',
  'Tigard Plumbing Supply',
  'Gresham Auto Center',
  'Oregon Health Sciences Partners',
  'Mt. Hood Meadows Resort',
  'Vancouver WA Builders',
  'Hillsboro Semiconductor',
  'Forest Grove Nursery',
  'Clackamas County Contractors',
  'Sandy River Outfitters',
  'Astoria Marine Services',
  'Bend Outdoor Collective',
  'Medford Orchards Co.',
  'Corvallis Biotech Inc.',
  'Eugene Coffee Roasters',
  'Salem Industrial Supply',
  'Albany Steel Fabricators',
  'Grants Pass Timber',
  'Klamath Falls Irrigation',
  'Hood River Fruit Exchange',
  'Pendleton Woolen Mills',
  'The Dalles Energy Partners',
  'Cannon Beach Hospitality',
  'Newport Seafood Distributors',
  'Lincoln City Resorts',
  'Coos Bay Lumber Co.',
  'Roseburg Building Supply',
  'Grants Pass Auto Group',
  'Medford Heating & Cooling',
  'Ashland Theater Arts',
  'Crater Lake Adventures',
  'Klamath Basin Growers',
  'Brookings Harbor Fisheries',
  'Gold Beach Marina',
  'Bandon Cheese Works',
  'Port Orford Cedar Co.',
  'Tillamook Creamery Partners',
  'Seaside Hotel Group',
  'Pacific City Surf Co.',
  'Waldport Oyster Farm',
  'Toledo Manufacturing',
  'Dallas Fabrication Works',
  'Independence Hop Farm',
  'Monmouth College Properties',
  'McMinnville Aviation',
  'Newberg Automotive',
  'Sherwood Landscaping',
  'Tualatin Logistics Park',
  'Lake Oswego Medical',
  'West Linn Builders',
  'Oregon City Properties',
  'Canby Flower Growers',
  'Molalla Iron Works',
  'Estacada Timber',
  'Sandy Valley Farms',
  'Troutdale Distribution',
  'Wood Village Auto',
  'Fairview Storage Solutions',
  'Gresham Steel',
  'Boring Construction',
  'Damascus Properties',
  'Eagle Creek Resort',
  'Zigzag Mountain Guides',
  'Government Camp Lodging',
  'Rhododendron Nursery',
  'Welches Conference Center',
  'Brightwood Timber',
  'Wemme River Properties',
  'Hoodland Electric',
  'Zigzag Inn',
  'Mt. Hood Railroad',
  'Parkdale Farm Supply',
  'Odell Apple Orchards',
  'Mosier Wine Cellars',
  'Rowena Plateau Farms',
  'Memaloose Properties',
  'Lyle River Ranch',
  'Wishram Grain Elevator',
  'Klickitat Valley Orchards',
  'White Salmon Sports',
  'Bingen Lumber',
  'Underwood Farm Supply',
  'Stevenson Marina',
  'Cascade Locks Ferry',
  'Bonneville Power Contractors',
  'Multnomah Falls Lodge',
  'Crown Point Properties',
]

export const ACCOUNT_EXECS: AccountExec[] = [
  { id: 'exec-1', name: 'Jordan Reyes' },
  { id: 'exec-2', name: 'Morgan Stiles' },
  { id: 'exec-3', name: 'Casey Nguyen' },
  { id: 'exec-4', name: 'Alex Farber' },
  { id: 'exec-5', name: 'Dana Kowalski' },
]

const TOUCHPOINT_TYPES: TouchpointType[] = ['email', 'call', 'note', 'renewal_email']

const TOUCHPOINT_NOTES: Record<TouchpointType, string[]> = {
  email: [
    'Sent renewal overview email',
    'Followed up on coverage questions',
    'Emailed updated quote',
    'Sent coverage comparison document',
  ],
  call: [
    'Discussed upcoming renewal',
    'Reviewed coverage needs',
    'Called to check in on claims',
    'Phone review of policy terms',
  ],
  note: [
    'Client requested additional coverage',
    'Noted premium sensitivity',
    'Client traveling — follow up next week',
    'Left voicemail',
  ],
  renewal_email: ['Renewal email sent'],
}

function isoDate(daysFromNow: number): string {
  const d = new Date('2026-04-01')
  d.setDate(d.getDate() + daysFromNow)
  return d.toISOString().split('T')[0]
}

function pastIsoDate(daysAgo: number): string {
  return isoDate(-daysAgo)
}

export function generateSeedData(): {
  policies: Policy[]
  touchpoints: Touchpoint[]
  accountExecs: AccountExec[]
} {
  const policies: Policy[] = []
  const touchpoints: Touchpoint[] = []

  for (let i = 0; i < 200; i++) {
    const clientName = CLIENT_NAMES[i % CLIENT_NAMES.length]
    const policyType = randItem(POLICY_TYPES)
    const carrier = randItem(CARRIERS)
    const execId = ACCOUNT_EXECS[randInt(0, 4)].id

    // Renewal dates: skewed toward <30 days
    const renewalDays =
      rand() < 0.45 ? randInt(1, 30) : rand() < 0.75 ? randInt(31, 60) : randInt(61, 90)

    // Premium: $10k–$250k
    const premium = randInt(10, 250) * 1000

    // Premium change: -5% to +20%, skewed positive
    const premiumChangePct = rand() < 0.15 ? randInt(-5, 0) : randInt(1, 20)

    const policy: Policy = {
      id: `policy-${i + 1}`,
      clientName,
      policyType,
      carrier,
      premium,
      renewalDate: isoDate(renewalDays),
      premiumChangePct,
      accountExecId: execId,
    }
    policies.push(policy)

    // ~40% of policies have at least one touchpoint
    if (rand() < 0.4) {
      const numTouchpoints = randInt(1, 3)
      for (let j = 0; j < numTouchpoints; j++) {
        const daysAgo = randInt(1, 120)
        const type = randItem(TOUCHPOINT_TYPES)
        const note = randItem(TOUCHPOINT_NOTES[type])
        touchpoints.push({
          id: `tp-${i + 1}-${j + 1}`,
          policyId: policy.id,
          type,
          date: pastIsoDate(daysAgo),
          note,
        })
      }
    }
  }

  return { policies, touchpoints, accountExecs: ACCOUNT_EXECS }
}
