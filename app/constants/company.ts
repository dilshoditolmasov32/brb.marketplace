/**
 * Demonstration company data for the information pages (about, contacts, branches,
 * careers, FAQ). Every value is a placeholder: the real contacts, branch network and
 * vacancies come from the backend or the content team.
 */
export const COMPANY_SAMPLE = {
  phone: '+998 71 000 00 00',
  email: 'info@example.com',
} as const

/** Regions that have a branch. Labels: branches.regions.<key> */
export const BRANCH_REGIONS = [
  'tashkent',
  'samarkand',
  'bukhara',
  'fergana',
  'andijan',
  'namangan',
] as const

export type BranchRegion = (typeof BRANCH_REGIONS)[number]

/** Labels: branches.services.<key> */
export type BranchService = 'applications' | 'payments' | 'consulting'

export interface Branch {
  /** Texts: branches.items.<key>.name / .address */
  key: string
  region: BranchRegion
  phone: string
  services: BranchService[]
}

export const BRANCHES: Branch[] = [
  {
    key: 'tashkentCenter',
    region: 'tashkent',
    phone: '+998 71 000 00 01',
    services: ['applications', 'payments', 'consulting'],
  },
  {
    key: 'tashkentChilanzar',
    region: 'tashkent',
    phone: '+998 71 000 00 02',
    services: ['applications', 'consulting'],
  },
  {
    key: 'samarkand',
    region: 'samarkand',
    phone: '+998 66 000 00 00',
    services: ['applications', 'payments', 'consulting'],
  },
  {
    key: 'bukhara',
    region: 'bukhara',
    phone: '+998 65 000 00 00',
    services: ['applications', 'payments'],
  },
  {
    key: 'fergana',
    region: 'fergana',
    phone: '+998 73 000 00 00',
    services: ['applications', 'payments', 'consulting'],
  },
  {
    key: 'andijan',
    region: 'andijan',
    phone: '+998 74 000 00 00',
    services: ['applications', 'consulting'],
  },
  {
    key: 'namangan',
    region: 'namangan',
    phone: '+998 69 000 00 00',
    services: ['applications', 'payments'],
  },
]

/** Labels: careers.departments.<key> */
export type VacancyDepartment = 'credit' | 'support' | 'it' | 'branches'
/** Labels: careers.employment.<key> */
export type VacancyEmployment = 'fullTime' | 'hybrid'

export interface Vacancy {
  /** Texts: careers.items.<key>.title / .duties / .requirements */
  key: string
  department: VacancyDepartment
  region: BranchRegion
  employment: VacancyEmployment
}

export const VACANCIES: Vacancy[] = [
  { key: 'creditSpecialist', department: 'credit', region: 'tashkent', employment: 'fullTime' },
  { key: 'supportOperator', department: 'support', region: 'tashkent', employment: 'hybrid' },
  { key: 'frontendDeveloper', department: 'it', region: 'tashkent', employment: 'hybrid' },
  { key: 'branchManager', department: 'branches', region: 'samarkand', employment: 'fullTime' },
]

/** FAQ topics in page order. Labels: faq.groups.<key>, texts: faq.items.<item> */
export const FAQ_GROUPS = [
  { key: 'installment', items: ['documents', 'limits', 'accuracy', 'early'] },
  { key: 'application', items: ['howToApply', 'decisionTime', 'status', 'cancel'] },
  { key: 'payments', items: ['methods', 'schedule', 'late'] },
  { key: 'delivery', items: ['shipping', 'returns', 'warranty'] },
] as const

export type FaqGroup = (typeof FAQ_GROUPS)[number]['key']

/** Questions repeated on the home page */
export const HOME_FAQ_ITEMS = ['documents', 'limits', 'accuracy', 'early', 'returns'] as const

/** Feedback form topics. Labels: contacts.form.topics.<key> */
export const CONTACT_TOPICS = ['installment', 'payment', 'order', 'partnership', 'other'] as const

/** Partner application business types. Labels: partners.form.categories.<key> */
export const PARTNER_CATEGORIES = [
  'electronics',
  'appliances',
  'furniture',
  'fashion',
  'other',
] as const

/** Section order of the legal documents. Texts: legal.<document>.sections.<key> */
export const LEGAL_SECTIONS = {
  privacy: ['general', 'data', 'purposes', 'storage', 'sharing', 'rights', 'cookies'],
  terms: ['general', 'account', 'orders', 'installment', 'payments', 'delivery', 'liability'],
} as const

export type LegalDocument = keyof typeof LEGAL_SECTIONS
