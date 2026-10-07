import {
  FILTER_BRANDS,
  FILTER_MEMORY_GB,
  FILTER_MONTHLY_PAYMENT_MAX,
  FILTER_MONTHLY_PAYMENT_MIN,
  FILTER_TERMS_MONTHS,
} from '~/constants/catalog'

/**
 * Catalog filter state and its URL representation.
 * The URL is the single source of truth, so a filtered listing can be linked and reloaded.
 */
export interface CatalogFilters {
  priceMin: number | null
  priceMax: number | null
  installmentOnly: boolean
  zeroInterestOnly: boolean
  termMonths: number | null
  /** Upper bound of the monthly payment; null means no limit */
  monthlyPaymentMax: number | null
  brands: string[]
  memoryGb: number[]
}

type QueryValue = string | null | (string | null)[] | undefined
export type FilterQuery = Record<string, string | undefined>

/** Query keys owned by the filters; everything else in the URL is left alone */
export const FILTER_QUERY_KEYS = [
  'priceMin',
  'priceMax',
  'installment',
  'zero',
  'term',
  'monthlyMax',
  'brand',
  'memory',
] as const

export function emptyCatalogFilters(): CatalogFilters {
  return {
    priceMin: null,
    priceMax: null,
    installmentOnly: false,
    zeroInterestOnly: false,
    termMonths: null,
    monthlyPaymentMax: null,
    brands: [],
    memoryGb: [],
  }
}

const first = (value: QueryValue) => (Array.isArray(value) ? value[0] : value) ?? ''

function toPositiveInt(value: QueryValue): number | null {
  const text = first(value)
  if (!/^\d+$/.test(text)) return null
  const number = Number(text)
  return number > 0 ? number : null
}

const toList = (value: QueryValue) => first(value).split(',').filter(Boolean)

/** Reads filters from the URL; anything unknown or malformed is ignored. */
export function parseCatalogFilters(query: Record<string, QueryValue>): CatalogFilters {
  const term = toPositiveInt(query.term)
  const monthlyMax = toPositiveInt(query.monthlyMax)
  const knownBrands: readonly string[] = FILTER_BRANDS
  const knownMemory: readonly number[] = FILTER_MEMORY_GB
  const knownTerms: readonly number[] = FILTER_TERMS_MONTHS

  return {
    priceMin: toPositiveInt(query.priceMin),
    priceMax: toPositiveInt(query.priceMax),
    installmentOnly: first(query.installment) === '1',
    zeroInterestOnly: first(query.zero) === '1',
    termMonths: term !== null && knownTerms.includes(term) ? term : null,
    monthlyPaymentMax:
      monthlyMax !== null &&
      monthlyMax >= FILTER_MONTHLY_PAYMENT_MIN &&
      monthlyMax < FILTER_MONTHLY_PAYMENT_MAX
        ? monthlyMax
        : null,
    brands: toList(query.brand).filter((brand) => knownBrands.includes(brand)),
    memoryGb: toList(query.memory)
      .map(Number)
      .filter((size) => knownMemory.includes(size)),
  }
}

/** Writes filters to query parameters; inactive filters become undefined (removed). */
export function catalogFiltersToQuery(filters: CatalogFilters): FilterQuery {
  return {
    priceMin: filters.priceMin ? String(filters.priceMin) : undefined,
    priceMax: filters.priceMax ? String(filters.priceMax) : undefined,
    installment: filters.installmentOnly ? '1' : undefined,
    zero: filters.zeroInterestOnly ? '1' : undefined,
    term: filters.termMonths ? String(filters.termMonths) : undefined,
    monthlyMax: filters.monthlyPaymentMax ? String(filters.monthlyPaymentMax) : undefined,
    brand: filters.brands.length ? filters.brands.join(',') : undefined,
    memory: filters.memoryGb.length ? filters.memoryGb.join(',') : undefined,
  }
}

export function countActiveCatalogFilters(filters: CatalogFilters): number {
  return Object.values(catalogFiltersToQuery(filters)).filter(Boolean).length
}
