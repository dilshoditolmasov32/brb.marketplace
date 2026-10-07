import { describe, expect, it } from 'vitest'
import {
  catalogFiltersToQuery,
  countActiveCatalogFilters,
  emptyCatalogFilters,
  parseCatalogFilters,
} from '~/utils/catalogFilters'

describe('catalog filters', () => {
  it('returns empty filters for an empty URL', () => {
    expect(parseCatalogFilters({})).toEqual(emptyCatalogFilters())
    expect(countActiveCatalogFilters(emptyCatalogFilters())).toBe(0)
  })

  it('round-trips through the URL', () => {
    const filters = {
      priceMin: 50_000,
      priceMax: 5_000_000,
      installmentOnly: true,
      zeroInterestOnly: false,
      termMonths: 12,
      monthlyPaymentMax: 500_000,
      brands: ['Samsung', 'Apple'],
      memoryGb: [128, 256],
    }
    const query = catalogFiltersToQuery(filters)

    expect(query).toEqual({
      priceMin: '50000',
      priceMax: '5000000',
      installment: '1',
      zero: undefined,
      term: '12',
      monthlyMax: '500000',
      brand: 'Samsung,Apple',
      memory: '128,256',
    })
    expect(parseCatalogFilters(query)).toEqual(filters)
    expect(countActiveCatalogFilters(filters)).toBe(7)
  })

  it('ignores malformed and unknown values', () => {
    expect(
      parseCatalogFilters({
        priceMin: '-5',
        priceMax: 'abc',
        installment: 'yes',
        term: '7',
        monthlyMax: '999999999',
        brand: 'Samsung,<script>,Unknown',
        memory: '128,13,x',
      }),
    ).toEqual({ ...emptyCatalogFilters(), brands: ['Samsung'], memoryGb: [128] })
  })

  it('uses the first value when a parameter is repeated', () => {
    expect(parseCatalogFilters({ term: ['24', '3'] }).termMonths).toBe(24)
  })
})
