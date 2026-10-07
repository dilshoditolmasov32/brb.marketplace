import { ROUTES } from '~/constants/navigation'

/**
 * Demonstration cabinet data. Everything here is replaced by the backend response
 * once the customer, application and contract endpoints exist.
 */
export const CABINET_SAMPLE = {
  /** The day the sample state describes */
  date: '2026-10-10',
  nextPaymentDate: '2026-11-10',
  contractNumber: 'MZ-2026-001',
  applicationNumber: 'APP-2026-001',
  ticketNumber: 'SUP-2026-014',
  documentNumber: 'AA 0000000',
  activeContracts: 1,
  /** Category the sample contract product and the recommendations are taken from */
  productCategory: 'smartphones',
} as const

/** Cabinet sections, in menu order. Labels: cabinet.nav.<key> */
export const CABINET_NAV = [
  { key: 'overview', to: ROUTES.cabinet },
  { key: 'applications', to: ROUTES.cabinetApplications },
  { key: 'contracts', to: ROUTES.cabinetContracts },
  { key: 'profile', to: ROUTES.cabinetProfile },
  { key: 'notifications', to: ROUTES.cabinetNotifications },
  { key: 'favorites', to: ROUTES.cabinetFavorites },
  { key: 'support', to: ROUTES.cabinetSupport },
] as const

export type CabinetSection = (typeof CABINET_NAV)[number]['key']

/** Milestones of the sample application. Labels: cabinet.applications.timeline.<key> */
export const CABINET_APPLICATION_TIMELINE = [
  { key: 'received', date: '2026-10-06' },
  { key: 'documents', date: '2026-10-07' },
  { key: 'decision', date: '2026-10-08' },
  { key: 'signed', date: '2026-10-10' },
] as const

export type CabinetApplicationStatus = 'draft' | 'documents' | 'cancelled'

/** Other sample applications. Texts: cabinet.applications.statuses.<status> */
export const CABINET_OTHER_APPLICATIONS: { number: string; status: CabinetApplicationStatus }[] = [
  { number: 'APP-2026-002', status: 'draft' },
  { number: 'APP-2026-003', status: 'documents' },
  { number: 'APP-2026-004', status: 'cancelled' },
]

/** Sample uploaded files. Notes: cabinet.profile.fileNotes.<note> */
export const CABINET_DOCUMENT_FILES = [
  { name: 'id-old.jpg', size: '1,2 MB', note: 'uploaded' },
  { name: 'id-orqa.jpg', size: '1,0 MB', note: 'uploaded' },
  { name: 'MZ-2026-001.pdf', size: null, note: 'contract' },
  { name: 'tolov-jadvali.pdf', size: null, note: 'schedule' },
] as const

/** Sample notifications, newest first. Texts: cabinet.notifications.items.<key> */
export const CABINET_NOTIFICATIONS = [
  { key: 'contractReady', date: '2026-10-10', unread: true },
  { key: 'statusUpdated', date: '2026-10-08', unread: true },
  { key: 'documentsAccepted', date: '2026-10-07', unread: false },
] as const
