import type { CatalogProduct } from '~/types/catalog'

/** Personal details collected on the second step of the installment application */
export interface ApplicationPersonalData {
  fullName: string
  documentNumber: string
  phone: string
  email: string
  /** Copy of the identity document; kept in memory only */
  document: File | null
  consent: boolean
}

/** A product being financed together with its quantity */
export interface ApplicationItem {
  product: CatalogProduct
  quantity: number
}
