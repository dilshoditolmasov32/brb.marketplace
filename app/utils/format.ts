/**
 * Locale-aware formatting of money, numbers, percentages and dates.
 * Pure functions (no Nuxt context) so they can be unit-tested and used on the server.
 * In components prefer the useFormat() composable, which binds the current locale.
 *
 * Numbers and Uzbek dates are formatted by hand instead of with Intl: browsers ship
 * incomplete data for "uz" and silently fall back to English, which made the server
 * and the client render different text (hydration mismatch, "13,750,000 so‘m").
 */

export type AppLocale = 'uz' | 'ru' | 'en'

// Non-breaking space, written by code point so it stays visible in the source
const NBSP = String.fromCharCode(0xa0)

const NUMBER_SEPARATORS: Record<AppLocale, { group: string; decimal: string }> = {
  uz: { group: NBSP, decimal: ',' },
  ru: { group: NBSP, decimal: ',' },
  en: { group: ',', decimal: '.' },
}

// uz "12 000 000 so‘m", ru "12 000 000 сум", en "UZS 12,000,000"
const CURRENCY_PATTERNS: Record<AppLocale, (amount: string) => string> = {
  uz: (amount) => `${amount}${NBSP}so‘m`,
  ru: (amount) => `${amount}${NBSP}сум`,
  en: (amount) => `UZS${NBSP}${amount}`,
}

const UZ_MONTHS = [
  'yanvar',
  'fevral',
  'mart',
  'aprel',
  'may',
  'iyun',
  'iyul',
  'avgust',
  'sentabr',
  'oktabr',
  'noyabr',
  'dekabr',
]

const DATE_LOCALE_TAGS: Record<Exclude<AppLocale, 'uz'>, string> = {
  ru: 'ru-RU',
  en: 'en-US',
}

export function formatNumber(value: number, locale: AppLocale, maximumFractionDigits = 0): string {
  const { group, decimal } = NUMBER_SEPARATORS[locale]
  const fixed = Math.abs(value).toFixed(maximumFractionDigits)
  const [integer = '0', fraction = ''] = fixed.split('.')
  const grouped = integer.replace(/\B(?=(\d{3})+(?!\d))/g, group)
  const trimmedFraction = fraction.replace(/0+$/, '')
  const sign = value < 0 && Number(fixed) !== 0 ? '-' : ''
  return sign + grouped + (trimmedFraction ? decimal + trimmedFraction : '')
}

/** Formats an amount in so'm. Amounts are whole so'm; tiyin are not shown. */
export function formatCurrency(value: number, locale: AppLocale): string {
  return CURRENCY_PATTERNS[locale](formatNumber(value, locale))
}

/** Formats a percentage given as a plain number: 24 -> "24%" */
export function formatPercent(value: number, locale: AppLocale): string {
  return `${formatNumber(value, locale, 2)}%`
}

/** Formats a calendar date in UTC so the server and the client always agree. */
export function formatDate(value: Date | string | number, locale: AppLocale): string {
  const date = new Date(value)
  if (locale === 'uz') {
    return `${date.getUTCDate()} ${UZ_MONTHS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
  }
  return new Intl.DateTimeFormat(DATE_LOCALE_TAGS[locale], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}
