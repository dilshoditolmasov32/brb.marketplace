/** Formatting helpers bound to the current locale. */
export function useFormat() {
  const { locale } = useI18n()
  const current = computed(() => locale.value as AppLocale)

  return {
    currency: (value: number) => formatCurrency(value, current.value),
    number: (value: number, maximumFractionDigits?: number) =>
      formatNumber(value, current.value, maximumFractionDigits),
    percent: (value: number) => formatPercent(value, current.value),
    date: (value: Date | string | number) => formatDate(value, current.value),
    dateNumeric: formatDateNumeric,
  }
}
