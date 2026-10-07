import { describe, expect, it } from 'vitest'
import { calculateLoan } from '~/features/calculator/utils/calculateLoan'

describe('calculateLoan', () => {
  it('matches the reference figures from the design', () => {
    // 12 000 000 so'm, 24% a year, 12 months
    expect(calculateLoan({ amount: 12_000_000, termMonths: 12, annualRatePercent: 24 })).toEqual({
      monthlyPayment: 1_134_715,
      totalPayment: 13_616_580,
      totalInterest: 1_616_580,
    })
  })

  it('splits the amount evenly at a zero rate', () => {
    expect(calculateLoan({ amount: 12_000_000, termMonths: 12, annualRatePercent: 0 })).toEqual({
      monthlyPayment: 1_000_000,
      totalPayment: 12_000_000,
      totalInterest: 0,
    })
  })

  it('keeps the derived figures consistent with the rounded payment', () => {
    const result = calculateLoan({ amount: 4_999_000, termMonths: 7, annualRatePercent: 27.5 })
    expect(Number.isInteger(result.monthlyPayment)).toBe(true)
    expect(result.totalPayment).toBe(result.monthlyPayment * 7)
    expect(result.totalInterest).toBe(result.totalPayment - 4_999_000)
  })

  it('charges one month of interest on a one-month loan', () => {
    expect(
      calculateLoan({ amount: 1_000_000, termMonths: 1, annualRatePercent: 24 }).monthlyPayment,
    ).toBe(1_020_000)
  })

  it('rejects invalid input', () => {
    expect(() => calculateLoan({ amount: 0, termMonths: 12, annualRatePercent: 24 })).toThrow(
      RangeError,
    )
    expect(() =>
      calculateLoan({ amount: 1_000_000, termMonths: 0, annualRatePercent: 24 }),
    ).toThrow(RangeError)
    expect(() =>
      calculateLoan({ amount: 1_000_000, termMonths: 1.5, annualRatePercent: 24 }),
    ).toThrow(RangeError)
    expect(() =>
      calculateLoan({ amount: 1_000_000, termMonths: 12, annualRatePercent: -1 }),
    ).toThrow(RangeError)
    expect(() =>
      calculateLoan({ amount: Number.NaN, termMonths: 12, annualRatePercent: 24 }),
    ).toThrow(RangeError)
  })
})
