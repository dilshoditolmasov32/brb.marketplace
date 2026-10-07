import { describe, expect, it } from 'vitest'
import { convertUsdToUzs, mapProduct } from '~/features/catalog/utils/mapProduct'

describe('convertUsdToUzs', () => {
  it('converts at the sample rate and rounds to the price step', () => {
    expect(convertUsdToUzs(9.99)).toBe(125_000)
    expect(convertUsdToUzs(1_499.99)).toBe(18_750_000)
  })

  it('never returns a zero price', () => {
    expect(convertUsdToUzs(0.01)).toBe(1_000)
  })
})

describe('mapProduct', () => {
  it('maps prices, discount and installment', () => {
    const product = mapProduct({
      id: 1,
      title: 'Phone',
      price: 960,
      discountPercentage: 20.4,
      rating: 4.5,
      stock: 3,
      reviews: [],
      thumbnail: 'https://cdn.dummyjson.com/phone.webp',
    })

    expect(product.price).toBe(12_000_000)
    expect(product.discountPercent).toBe(20)
    expect(product.oldPrice).toBe(15_000_000)
    expect(product.inStock).toBe(true)
    expect(product.installment).toEqual({
      termMonths: 12,
      annualRatePercent: 24,
      monthlyPayment: 1_134_715,
    })
  })

  it('omits the old price when there is no real discount', () => {
    const product = mapProduct({ id: 2, price: 100, discountPercentage: 0.3 })
    expect(product.oldPrice).toBeNull()
    expect(product.discountPercent).toBeNull()
  })

  it('tolerates partial responses requested with select', () => {
    const product = mapProduct({ id: 3, price: 10 })
    expect(product.title).toBe('')
    expect(product.images).toEqual([])
    expect(product.inStock).toBe(false)
  })
})
