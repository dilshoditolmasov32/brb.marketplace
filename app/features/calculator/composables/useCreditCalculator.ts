/**
 * Reactive state of the installment calculator.
 * The maths lives in calculateLoan(); this only holds inputs and keeps them in range.
 */
export function useCreditCalculator(initialAmount = 12_000_000) {
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

  const normalizeAmount = (value: number) =>
    clamp(Math.round(value / LOAN_AMOUNT_STEP) * LOAN_AMOUNT_STEP, LOAN_AMOUNT_MIN, LOAN_AMOUNT_MAX)

  const normalizeTerm = (value: number) =>
    clamp(Math.round(value), LOAN_TERM_MIN_MONTHS, LOAN_TERM_MAX_MONTHS)

  const amount = ref(normalizeAmount(initialAmount))
  const termMonths = ref(DEFAULT_TERM_MONTHS)
  const annualRatePercent = DEFAULT_ANNUAL_RATE_PERCENT

  function setAmount(value: number) {
    if (Number.isFinite(value)) amount.value = normalizeAmount(value)
  }

  function setTerm(value: number) {
    if (Number.isFinite(value)) termMonths.value = normalizeTerm(value)
  }

  const result = computed(() =>
    calculateLoan({ amount: amount.value, termMonths: termMonths.value, annualRatePercent }),
  )

  return { amount, termMonths, annualRatePercent, result, setAmount, setTerm }
}
