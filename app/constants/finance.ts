/**
 * Demonstration finance parameters.
 * Real limits, rates and terms must come from the backend; these values only
 * drive the mock catalog and the default state of the calculator.
 */

/** Fixed sample rate used to convert the mock API's USD prices into so'm */
export const USD_TO_UZS = 12_500

/** Converted prices are rounded to this step so they read like shelf prices */
export const PRICE_ROUNDING_STEP = 1_000

export const DEFAULT_ANNUAL_RATE_PERCENT = 24
export const DEFAULT_TERM_MONTHS = 12

export const LOAN_AMOUNT_MIN = 1_000_000
export const LOAN_AMOUNT_MAX = 30_000_000
export const LOAN_AMOUNT_STEP = 100_000

export const LOAN_TERM_MIN_MONTHS = 1
export const LOAN_TERM_MAX_MONTHS = 24
export const LOAN_TERM_OPTIONS = [3, 6, 12, 24] as const
