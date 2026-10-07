<script setup lang="ts">
/** Financial summary of the application: a sample loan for the amount on the default terms. */
const props = defineProps<{
  /** Financed amount in whole so'm */
  amount: number
}>()

const { t } = useI18n()
const format = useFormat()

const loan = computed(() =>
  calculateLoan({
    amount: Math.max(1, props.amount),
    termMonths: DEFAULT_TERM_MONTHS,
    annualRatePercent: DEFAULT_ANNUAL_RATE_PERCENT,
  }),
)

const term = computed(() => t('finance.months', { count: DEFAULT_TERM_MONTHS }))

const rows = computed(() => [
  { label: t('application.summary.loanAmount'), value: format.currency(props.amount) },
  { label: t('finance.annualRate'), value: format.percent(DEFAULT_ANNUAL_RATE_PERCENT) },
  { label: t('application.summary.term'), value: term.value },
  { label: t('finance.totalInterest'), value: format.currency(loan.value.totalInterest) },
  { label: t('finance.totalPayment'), value: format.currency(loan.value.totalPayment) },
])
</script>

<template>
  <div class="flex flex-col gap-3">
    <section
      class="flex flex-col gap-4 rounded-lg border border-border bg-surface p-4 md:p-6"
      aria-live="polite"
    >
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-base font-semibold text-text">{{ $t('application.summary.title') }}</h2>
        <Icon name="lucide:calculator" size="18" class="shrink-0 text-text-secondary" />
      </div>
      <div>
        <p class="text-compact text-text-secondary">{{ $t('finance.monthlyPayment') }}</p>
        <p class="mt-1 text-2xl font-semibold text-text tabular-nums md:text-3xl">
          {{ format.currency(loan.monthlyPayment) }}
        </p>
      </div>
      <dl class="flex flex-col text-compact">
        <div
          v-for="row in rows"
          :key="row.label"
          class="flex items-baseline justify-between gap-4 border-t border-border py-2.5"
        >
          <dt class="text-text-secondary">{{ row.label }}</dt>
          <dd class="text-right font-semibold text-text tabular-nums">{{ row.value }}</dd>
        </div>
      </dl>
      <p class="text-2xs text-text-secondary">{{ $t('calculator.disclaimer') }}</p>
    </section>

    <div class="flex items-baseline justify-between gap-4 px-1 text-compact">
      <span class="text-text-secondary">{{ $t('productPage.installment.downPayment') }}</span>
      <span class="font-semibold text-text tabular-nums">
        {{ format.currency(0) }} · {{ $t('application.summary.sample') }}
      </span>
    </div>
    <p class="px-1 text-2xs text-text-secondary">
      {{
        $t('application.summary.formula', {
          term,
          monthly: format.currency(loan.monthlyPayment),
          total: format.currency(loan.totalPayment),
        })
      }}
    </p>
  </div>
</template>
