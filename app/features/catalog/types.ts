import type { components } from '~/api/apiMethods.types'

/** Product exactly as the API returns it */
export type ProductDto = components['schemas']['Product']

/** List endpoints may be called with `select`, so every field can be missing */
export type PartialProductDto = Partial<ProductDto> & Pick<ProductDto, 'id'>

export interface ProductInstallment {
  monthlyPayment: number
  termMonths: number
  annualRatePercent: number
}

/** Product as the UI consumes it: prices in so'm, installment precomputed */
export interface CatalogProduct {
  id: number
  title: string
  description: string
  brand: string | null
  categorySlug: string
  /** Current price in whole so'm */
  price: number
  /** Price before the discount, when there is a meaningful discount */
  oldPrice: number | null
  discountPercent: number | null
  rating: number
  reviewCount: number
  inStock: boolean
  thumbnail: string
  images: string[]
  installment: ProductInstallment
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  author: string
}

/** Everything the product page shows on top of the card data */
export interface ProductDetails extends CatalogProduct {
  sku: string
  stock: number
  availabilityStatus: string
  shippingInformation: string | null
  warrantyInformation: string | null
  returnPolicy: string | null
  minimumOrderQuantity: number | null
  /** Weight as reported by the API (unit not specified by the mock API) */
  weight: number | null
  dimensions: { width: number; height: number; depth: number } | null
  reviews: ProductReview[]
}
