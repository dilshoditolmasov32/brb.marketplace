<script setup lang="ts">
const { t } = useI18n()
const format = useFormat()
const { name, product, loan } = useCabinetSample()

const term = computed(() => t('finance.months', { count: DEFAULT_TERM_MONTHS }))

const rows = computed(() => [
  { label: t('cabinet.contracts.financed'), value: format.currency(product.value?.price ?? 0) },
  { label: t('productPage.installment.downPayment'), value: format.currency(0) },
  { label: t('finance.totalPayment'), value: format.currency(loan.value.totalPayment) },
])

// One payment a month starting from the first due date, counted in UTC like the formatter
const schedule = computed(() => {
  const first = new Date(CABINET_SAMPLE.nextPaymentDate)
  return Array.from({ length: DEFAULT_TERM_MONTHS }, (_, index) => {
    const date = new Date(first)
    date.setUTCMonth(first.getUTCMonth() + index)
    return { date, amount: loan.value.monthlyPayment }
  })
})
</script>

<template>
  <CabinetShell section="contracts">
    <template v-if="product">
      <ApplicationProductList :items="[{ product, quantity: 1 }]" />

      <CabinetCard :title="CABINET_SAMPLE.contractNumber">
        <UiBadge tone="success" class="self-start">{{ $t('cabinet.contracts.status') }}</UiBadge>
        <p class="text-compact text-text">
          {{ name }} · {{ CABINET_SAMPLE.applicationNumber }} ·
          {{ format.dateNumeric(CABINET_SAMPLE.date) }}
        </p>
        <dl class="flex flex-col text-compact">
          <div
            v-for="row in rows"
            :key="row.label"
            class="flex justify-between gap-4 border-t border-border py-2"
          >
            <dt class="text-text-secondary">{{ row.label }}</dt>
            <dd class="font-semibold text-text tabular-nums">{{ row.value }}</dd>
          </div>
        </dl>
        <p class="text-2xs text-text-secondary">
          {{
            $t('cabinet.contracts.terms', {
              rate: format.percent(DEFAULT_ANNUAL_RATE_PERCENT),
              term,
              interest: format.currency(loan.totalInterest),
            })
          }}
        </p>
        <UiButton variant="outline" block disabled>{{ $t('cabinet.contracts.pdf') }}</UiButton>
      </CabinetCard>

      <CabinetCard :title="$t('cabinet.contracts.schedule.title')">
        <p class="text-2xs text-text-secondary">
          {{
            $t('cabinet.contracts.schedule.summary', {
              count: DEFAULT_TERM_MONTHS,
              monthly: format.currency(loan.monthlyPayment),
              total: format.currency(loan.totalPayment),
            })
          }}
        </p>
        <div class="overflow-x-auto">
          <table class="w-full min-w-96 text-left text-compact">
            <thead class="bg-surface-muted text-text">
              <tr>
                <th scope="col" class="px-3 py-2.5 font-semibold">
                  {{ $t('cabinet.contracts.schedule.date') }}
                </th>
                <th scope="col" class="px-3 py-2.5 font-semibold">
                  {{ $t('cabinet.contracts.schedule.payment') }}
                </th>
                <th scope="col" class="px-3 py-2.5 font-semibold">
                  {{ $t('cabinet.contracts.schedule.state') }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in schedule" :key="row.date.getTime()" class="border-b border-border">
                <td class="px-3 py-3 text-text tabular-nums">
                  {{ format.dateNumeric(row.date) }}
                </td>
                <td class="px-3 py-3 font-semibold text-text tabular-nums">
                  {{ format.currency(row.amount) }}
                </td>
                <td class="px-3 py-3 text-text-secondary">
                  {{ $t('cabinet.contracts.schedule.pending') }}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th scope="row" class="px-3 py-3 font-normal text-text-secondary">
                  {{ $t('cabinet.contracts.schedule.total') }}
                </th>
                <td class="px-3 py-3 font-semibold text-text tabular-nums" colspan="2">
                  {{ format.currency(loan.totalPayment) }}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <p class="text-2xs text-text-secondary">{{ $t('cabinet.contracts.schedule.note') }}</p>
      </CabinetCard>
    </template>
  </CabinetShell>
</template>
