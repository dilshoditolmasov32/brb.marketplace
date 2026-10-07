/**
 * Demonstration filter options from the design.
 * The mock API cannot filter by any of these; the real backend should provide the
 * available brands, memory sizes and terms per category.
 */
export const FILTER_BRANDS = [
  'Samsung',
  'Apple',
  'Xiaomi',
  'Huawei',
  'TECNO',
  'Nokia',
  'Realme',
  'Infinix',
] as const

export const FILTER_MEMORY_GB = [64, 128, 256, 512] as const

export const FILTER_TERMS_MONTHS = [3, 6, 12, 24, 36] as const

export const FILTER_MONTHLY_PAYMENT_MIN = 50_000
export const FILTER_MONTHLY_PAYMENT_MAX = 2_000_000
export const FILTER_MONTHLY_PAYMENT_STEP = 50_000

/** Demonstration product variants shown on the product page */
export const PRODUCT_COLOR_OPTIONS = ['Blue', 'Black', 'Natural Titanium'] as const
export const PRODUCT_MEMORY_OPTIONS_GB = [128, 256, 512] as const
