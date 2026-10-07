const RECOMMENDED_LIMIT = 3

/**
 * Demonstration data shared by the cabinet pages: the customer name, the product behind the
 * sample contract and its loan. Replaced by real endpoints once the backend is connected.
 * Client-only: the cabinet is rendered after the session is read from the browser.
 */
export function useCabinetSample() {
  const { t } = useI18n()
  const catalog = useCatalogApi()
  const auth = useAuthStore()

  const { data: products } = useLazyAsyncData(
    'cabinet-products',
    async () =>
      (await catalog.byCategory(CABINET_SAMPLE.productCategory, { limit: RECOMMENDED_LIMIT + 1 }))
        .items,
    { server: false, default: () => [] },
  )

  const product = computed(() => products.value[0])
  const recommended = computed(() => products.value.slice(1, RECOMMENDED_LIMIT + 1))

  const loan = computed(() =>
    calculateLoan({
      amount: Math.max(1, product.value?.price ?? 0),
      termMonths: DEFAULT_TERM_MONTHS,
      annualRatePercent: DEFAULT_ANNUAL_RATE_PERCENT,
    }),
  )

  // A sign-in knows only the phone number, so the sample name is shown instead
  const name = computed(() => auth.user?.fullName ?? t('cabinet.sampleName'))

  return { name, product, recommended, loan }
}
