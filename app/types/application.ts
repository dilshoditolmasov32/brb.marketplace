import type { CatalogProduct } from '~/types/catalog'

/** Personal details collected on the second step of the installment application */
export interface ApplicationPersonalData {
  fullName: string
  documentNumber: string
  phone: string
  email: string
  document: File | null
  consent: boolean
}


export interface ApplicationItem {
  product: CatalogProduct
  quantity: number
}
