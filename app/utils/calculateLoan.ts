/**
 * Annuity loan calculation. See docs/credit-calculation.md.
 * Pure function: no rounding surprises are hidden in the UI layer.
 */

export interface LoanInput {
  /** Financed amount in whole so'm */
  amount: number
  termMonths: number
  /** Nominal annual rate as a plain number: 24 means 24% */
  annualRatePercent: number
}

export interface LoanResult {
  /** Equal monthly payment in whole so'm */
  monthlyPayment: number
  /** monthlyPayment x termMonths */
  totalPayment: number
  /** totalPayment - amount */
  totalInterest: number
}

export function calculateLoan({ amount, termMonths, annualRatePercent }: LoanInput): LoanResult {
  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RangeError('amount must be a positive number')
  }
  if (!Number.isInteger(termMonths) || termMonths < 1) {
    throw new RangeError('termMonths must be a positive integer')
  }
  if (!Number.isFinite(annualRatePercent) || annualRatePercent < 0) {
    throw new RangeError('annualRatePercent must not be negative')
  }

  const monthlyRate = annualRatePercent / 100 / 12

  // Annuity: P * r / (1 - (1 + r)^-n). With a zero rate it degenerates to P / n.
  const exactPayment =
    monthlyRate === 0
      ? amount / termMonths
      : (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -termMonths))

  // The payment is rounded once, to whole so'm; every other figure is derived from the
  // rounded payment in integer arithmetic, so the numbers shown always add up exactly.
  const monthlyPayment = Math.round(exactPayment)
  const totalPayment = monthlyPayment * termMonths
  const totalInterest = totalPayment - Math.round(amount)

  return { monthlyPayment, totalPayment, totalInterest }
}
