<script setup lang="ts">
import type { CabinetApplicationStatus } from '~/constants/cabinet'

const { t } = useI18n()
const localePath = useLocalePath()
const format = useFormat()
const { name, product, loan } = useCabinetSample()

type Filter = 'all' | 'active' | 'drafts'

const filter = ref<Filter>('all')

// Which of the other sample applications each tab shows
const FILTER_STATUSES: Record<Filter, CabinetApplicationStatus[]> = {
  all: ['draft', 'documents', 'cancelled'],
  active: ['documents'],
  drafts: ['draft'],
}

const others = computed(() =>
  CABINET_OTHER_APPLICATIONS.filter((item) => FILTER_STATUSES[filter.value].includes(item.status)),
)

// The approved application is an active one, so it is hidden only among the drafts
const showsMain = computed(() => filter.value !== 'drafts')

const tabs = computed(() => [
  {
    value: 'all' as const,
    label: t('cabinet.applications.tabs.all', { count: CABINET_OTHER_APPLICATIONS.length + 1 }),
  },
  { value: 'active' as const, label: t('cabinet.applications.tabs.active') },
  { value: 'drafts' as const, label: t('cabinet.applications.tabs.drafts') },
])

// Timeline dates are shown without the year: 06.10
const dayAndMonth = (date: string) => format.dateNumeric(date).slice(0, 5)
</script>

<template>
  <CabinetShell section="applications">
    <template v-if="product">
      <ApplicationProductList :items="[{ product, quantity: 1 }]" />

      <UiTabs v-model="filter" :tabs="tabs" :label="$t('cabinet.titles.applications')" />

      <CabinetCard v-if="showsMain">
        <h2 class="text-base font-semibold text-text">
          {{ CABINET_SAMPLE.applicationNumber }} · {{ $t('cabinet.applications.main') }}
        </h2>
        <UiBadge tone="success" class="self-start">{{ $t('cabinet.application.status') }}</UiBadge>
        <p class="text-compact text-text">
          {{ name }} · {{ product.title }} · {{ format.currency(product.price) }}
        </p>
        <div class="flex justify-between gap-4 text-compact">
          <span class="text-text-secondary">{{ $t('cabinet.applications.monthlyAndTerm') }}</span>
          <span class="font-semibold text-text tabular-nums">
            {{ format.currency(loan.monthlyPayment) }} /
            {{ $t('finance.months', { count: DEFAULT_TERM_MONTHS }) }}
          </span>
        </div>
        <ol class="flex flex-col gap-2 border-t border-border pt-3 text-compact text-text">
          <li
            v-for="step in CABINET_APPLICATION_TIMELINE"
            :key="step.key"
            class="flex items-start gap-2"
          >
            <Icon name="lucide:check" size="14" class="mt-0.5 shrink-0 text-success" />
            <span>
              <span class="tabular-nums">{{ dayAndMonth(step.date) }}</span>
              ·
              {{
                $t(`cabinet.applications.timeline.${step.key}`, {
                  contract: CABINET_SAMPLE.contractNumber,
                })
              }}
            </span>
          </li>
        </ol>
        <p class="text-2xs text-text-secondary">{{ $t('cabinet.applications.note') }}</p>
        <UiButton block :to="localePath(ROUTES.cabinetContracts)">
          {{ $t('cabinet.applications.openContract') }}
        </UiButton>
      </CabinetCard>

      <CabinetCard v-if="others.length" :title="$t('cabinet.applications.others')">
        <ul class="flex flex-col">
          <li
            v-for="item in others"
            :key="item.number"
            class="flex flex-col gap-1 border-t border-border py-3 first:border-t-0 first:pt-0 last:pb-0"
          >
            <div class="flex items-baseline justify-between gap-3 text-compact">
              <p class="text-text-secondary">{{ item.number }} · {{ product.title }}</p>
              <p class="shrink-0 font-semibold text-text">
                {{ $t(`cabinet.applications.statuses.${item.status}.label`) }}
              </p>
            </div>
            <p class="text-2xs text-text-secondary">
              {{ $t(`cabinet.applications.statuses.${item.status}.note`) }}
              <template v-if="item.status !== 'cancelled'">
                ·
                <NuxtLink
                  :to="{ path: localePath(ROUTES.application), query: { product: product.id } }"
                  class="font-semibold text-primary-hover"
                >
                  {{ $t(`cabinet.applications.statuses.${item.status}.action`) }} →
                </NuxtLink>
              </template>
            </p>
          </li>
        </ul>
      </CabinetCard>
    </template>
  </CabinetShell>
</template>
