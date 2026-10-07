import { describe, expect, it } from 'vitest'
import {
  formatCurrency,
  formatDate,
  formatDateNumeric,
  formatNumber,
  formatPercent,
} from '~/utils/format'

// Digit groups are separated by non-breaking spaces; compare with plain spaces
const plain = (value: string) => value.replace(/\s/g, ' ')

describe('formatCurrency', () => {
  it('places the unit as each locale expects', () => {
    expect(plain(formatCurrency(12_000_000, 'uz'))).toBe('12 000 000 so‘m')
    expect(plain(formatCurrency(12_000_000, 'ru'))).toBe('12 000 000 сум')
    expect(plain(formatCurrency(12_000_000, 'en'))).toBe('UZS 12,000,000')
  })

  it('shows whole so‘m only', () => {
    expect(plain(formatCurrency(1_134_715.4, 'uz'))).toBe('1 134 715 so‘m')
  })

  it('never breaks the amount across lines', () => {
    expect(formatCurrency(12_000_000, 'uz')).not.toContain(' ')
  })
})

describe('formatNumber', () => {
  it('groups digits per locale', () => {
    expect(plain(formatNumber(50_000_000, 'uz'))).toBe('50 000 000')
    expect(formatNumber(50_000_000, 'en')).toBe('50,000,000')
    expect(formatNumber(999, 'uz')).toBe('999')
    expect(formatNumber(0, 'uz')).toBe('0')
  })

  it('rounds to the requested precision and drops trailing zeros', () => {
    expect(formatNumber(4.12, 'uz', 1)).toBe('4,1')
    expect(formatNumber(4.96, 'en', 1)).toBe('5')
    expect(plain(formatNumber(1234.5, 'ru', 2))).toBe('1 234,5')
  })

  it('handles negative values', () => {
    expect(plain(formatNumber(-1_500, 'uz'))).toBe('-1 500')
    expect(formatNumber(-0.2, 'uz')).toBe('0')
  })
})

describe('formatPercent', () => {
  it('formats whole and fractional rates', () => {
    expect(formatPercent(24, 'uz')).toBe('24%')
    expect(formatPercent(27.5, 'en')).toBe('27.5%')
    expect(formatPercent(27.5, 'ru')).toBe('27,5%')
  })
})

describe('formatDate', () => {
  it('formats a date for the locale', () => {
    expect(formatDate('2026-05-15T00:00:00Z', 'uz')).toBe('15 may 2026')
    expect(formatDate('2026-05-15T00:00:00Z', 'en')).toBe('May 15, 2026')
    expect(plain(formatDate('2026-05-15T00:00:00Z', 'ru'))).toBe('15 мая 2026 г.')
  })

  it('does not shift the day with the viewer time zone', () => {
    expect(formatDate('2026-01-01T00:30:00Z', 'uz')).toBe('1 yanvar 2026')
  })
})

describe('formatDateNumeric', () => {
  it('formats a compact date in UTC', () => {
    expect(formatDateNumeric('2026-11-10')).toBe('10.11.2026')
    expect(formatDateNumeric('2027-01-05T00:30:00Z')).toBe('05.01.2027')
  })
})
