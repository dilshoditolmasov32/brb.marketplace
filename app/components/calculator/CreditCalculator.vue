<script setup lang="ts">
const props = defineProps<{ initialAmount?: number }>()

const { t } = useI18n()
const localePath = useLocalePath()
const format = useFormat()

const { amount, termMonths, annualRatePercent, result, setAmount, setTerm } = useCreditCalculator(
  props.initialAmount,
)

// Text fields show formatted values and commit on change, so typing is never interrupted
const amountText = ref('')
const termText = ref('')
watch(amount, (value) => (amountText.value = format.number(value)), { immediate: true })
watch(termMonths, (value) => (termText.value = String(value)), { immediate: true })

const digitsOf = (value: string) => Number(value.replace(/\D/g, ''))

function commitAmount() {
  setAmount(digitsOf(amountText.value))
  amountText.value = format.number(amount.value)
}

function commitTerm() {
  setTerm(digitsOf(termText.value))
  termText.value = String(termMonths.value)
}

const rows = computed(() => [
  { label: t('calculator.amount'), value: format.currency(amount.value) },
  { label: t('finance.annualRate'), value: format.percent(annualRatePercent) },
  { label: t('finance.term'), value: t('finance.months', { count: termMonths.value }) },
  { label: t('finance.totalInterest'), value: format.currency(result.value.totalInterest) },
  { label: t('finance.totalPayment'), value: format.currency(result.value.totalPayment) },
])
</script>

<template>
  <div class="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
    <form
      class="flex flex-col gap-6 rounded-lg border border-border bg-surface p-4 md:p-6"
      @submit.prevent
    >
      <div>
        <h3 class="text-xl font-semibold text-text">{{ $t('calculator.title') }}</h3>
        <p class="mt-1 text-compact text-text-secondary">{{ $t('calculator.subtitle') }}</p>
      </div>

      <div class="flex flex-col gap-1 md:max-w-sm">
        <UiInput
          v-model="amountText"
          :label="$t('calculator.amount')"
          :hint="$t('calculator.amountStep', { step: format.currency(LOAN_AMOUNT_STEP) })"
          inputmode="numeric"
          autocomplete="off"
          @change="commitAmount"
        >
          <template #suffix><span class="text-xs text-text-secondary">UZS</span></template>
        </UiInput>
        <UiSlider
          v-model="amount"
          :min="LOAN_AMOUNT_MIN"
          :max="LOAN_AMOUNT_MAX"
          :step="LOAN_AMOUNT_STEP"
          :label="$t('calculator.amount')"
          :value-text="format.currency(amount)"
          :min-label="format.currency(LOAN_AMOUNT_MIN)"
          :max-label="format.currency(LOAN_AMOUNT_MAX)"
        />
      </div>

      <div class="flex flex-col gap-1 md:max-w-sm">
        <UiInput
          v-model="termText"
          :label="$t('finance.term')"
          :hint="$t('calculator.termStep')"
          inputmode="numeric"
          autocomplete="off"
          @change="commitTerm"
        >
          <template #suffix>
            <span class="text-xs text-text-secondary">{{ $t('finance.monthUnit') }}</span>
          </template>
        </UiInput>
        <UiSlider
          v-model="termMonths"
          :min="LOAN_TERM_MIN_MONTHS"
          :max="LOAN_TERM_MAX_MONTHS"
          :step="1"
          :label="$t('finance.term')"
          :value-text="$t('finance.months', { count: termMonths })"
          :min-label="$t('finance.months', { count: LOAN_TERM_MIN_MONTHS })"
          :max-label="$t('finance.months', { count: LOAN_TERM_MAX_MONTHS })"
        />
      </div>

      <UiAlert class="md:max-w-sm">
        {{ $t('calculator.rateNote', { rate: format.percent(annualRatePercent) }) }}
      </UiAlert>
    </form>

    <FinanceSummary
      :monthly-payment="format.currency(result.monthlyPayment)"
      :rows="rows"
      :disclaimer="$t('calculator.disclaimer')"
    >
      <template #action>
        <UiButton block :to="localePath(ROUTES.application)">{{ $t('common.apply') }}</UiButton>
      </template>
    </FinanceSummary>
  </div>
</template>
