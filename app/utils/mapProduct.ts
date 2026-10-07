import {
  DEFAULT_ANNUAL_RATE_PERCENT,
  DEFAULT_TERM_MONTHS,
  PRICE_ROUNDING_STEP,
  USD_TO_UZS,
} from '~/constants/finance'
import { calculateLoan } from '~/utils/calculateLoan'
import type { CatalogProduct, PartialProductDto, ProductDetails, ProductDto } from '~/types/catalog'

/** Discounts below this are noise in the mock data and are not shown as a sale */
const MIN_DISCOUNT_PERCENT = 1

function roundToStep(value: number, step: number): number {
  return Math.max(step, Math.round(value / step) * step)
}

/** Converts a mock USD price into a rounded so'm price */
export function convertUsdToUzs(usd: number): number {
  return roundToStep(usd * USD_TO_UZS, PRICE_ROUNDING_STEP)
}

/**
 * Maps an API product to the shape the UI uses.
 * The mock API has no so'm prices or installment terms, so both are derived here;
 * when the real backend provides them, only this function changes.
 */
export function mapProduct(dto: PartialProductDto): CatalogProduct {
  const price = convertUsdToUzs(dto.price ?? 0)
  const discount = Math.round(dto.discountPercentage ?? 0)
  const hasDiscount = discount >= MIN_DISCOUNT_PERCENT

  return {
    id: dto.id,
    title: dto.title ?? '',
    description: dto.description ?? '',
    brand: dto.brand ?? null,
    categorySlug: dto.category ?? '',
    price,
    oldPrice: hasDiscount ? roundToStep(price / (1 - discount / 100), PRICE_ROUNDING_STEP) : null,
    discountPercent: hasDiscount ? discount : null,
    rating: dto.rating ?? 0,
    reviewCount: dto.reviews?.length ?? 0,
    inStock: (dto.stock ?? 0) > 0,
    thumbnail: dto.thumbnail ?? '',
    images: dto.images ?? [],
    installment: {
      termMonths: DEFAULT_TERM_MONTHS,
      annualRatePercent: DEFAULT_ANNUAL_RATE_PERCENT,
      monthlyPayment: calculateLoan({
        amount: price,
        termMonths: DEFAULT_TERM_MONTHS,
        annualRatePercent: DEFAULT_ANNUAL_RATE_PERCENT,
      }).monthlyPayment,
    },
  }
}

/** Maps a full API product for the product page. */
export function mapProductDetails(dto: ProductDto): ProductDetails {
  return {
    ...mapProduct(dto),
    sku: dto.sku,
    stock: dto.stock,
    availabilityStatus: dto.availabilityStatus,
    shippingInformation: dto.shippingInformation ?? null,
    warrantyInformation: dto.warrantyInformation ?? null,
    returnPolicy: dto.returnPolicy ?? null,
    minimumOrderQuantity: dto.minimumOrderQuantity ?? null,
    weight: dto.weight ?? null,
    dimensions: dto.dimensions ?? null,
    // The reviewer's e-mail is deliberately dropped: it is personal data the page never shows
    reviews: dto.reviews.map((review) => ({
      rating: review.rating,
      comment: review.comment,
      date: review.date,
      author: review.reviewerName,
    })),
  }
}
