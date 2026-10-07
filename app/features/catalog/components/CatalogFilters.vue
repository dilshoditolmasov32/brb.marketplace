<script setup lang="ts">
import {
  FILTER_BRANDS,
  FILTER_MEMORY_GB,
  FILTER_MONTHLY_PAYMENT_MAX,
  FILTER_MONTHLY_PAYMENT_MIN,
  FILTER_MONTHLY_PAYMENT_STEP,
  FILTER_TERMS_MONTHS,
} from '~/constants/catalog'
import type { CatalogFilters } from '~/features/catalog/utils/catalogFilters'

/**
 * Filter panel from the design. Edits a draft and emits it on "apply", so the listing
 * is not reloaded on every keystroke.
 */
const props = defineProps<{ filters: CatalogFilters }>()
const emit = defineEmits<{ apply: [filters: CatalogFilters]; reset: [] }>()

const format = useFormat()

const clone = (filters: CatalogFilters): CatalogFilters => ({
  ...filters,
  brands: [...filters.brands],
  memoryGb: [...filters.memoryGb],
})

const draft = ref(clone(props.filters))
watch(
  () => props.filters,
  (filters) => (draft.value = clone(filters)),
)

// Number fields are edited as text so an empty field means "no limit"
const digitsOrNull = (value: string | number | undefined) => {
  const number = Number(String(value ?? '').replace(/\D/g, ''))
  return number > 0 ? number : null
}
const priceMin = computed({
  get: () => (draft.value.priceMin ? format.number(draft.value.priceMin) : ''),
  set: (value) => (draft.value.priceMin = digitsOrNull(value)),
})
const priceMax = computed({
  get: () => (draft.value.priceMax ? format.number(draft.value.priceMax) : ''),
  set: (value) => (draft.value.priceMax = digitsOrNull(value)),
})

// 0 stands for "any term" in the radio group
const term = computed({
  get: () => draft.value.termMonths ?? 0,
  set: (value) => (draft.value.termMonths = value || null),
})

// The slider's right edge means "no limit"
const monthlyMax = computed({
  get: () => draft.value.monthlyPaymentMax ?? FILTER_MONTHLY_PAYMENT_MAX,
  set: (value) =>
    (draft.value.monthlyPaymentMax = value >= FILTER_MONTHLY_PAYMENT_MAX ? null : value),
})

const brandSearch = ref('')
const visibleBrands = computed(() => {
  const needle = brandSearch.value.trim().toLowerCase()
  return FILTER_BRANDS.filter((brand) => brand.toLowerCase().includes(needle))
})

function toggle<T>(list: T[], value: T, checked: boolean): T[] {
  return checked ? [...new Set([...list, value])] : list.filter((item) => item !== value)
}

// min-w-0: a fieldset otherwise refuses to shrink below its content width
const SECTION = 'flex min-w-0 flex-col gap-2 border-t border-border px-4 py-4'
const HEADING = 'text-sm font-semibold text-text'
</script>

<template>
  <form class="flex flex-col" @submit.prevent="emit('apply', clone(draft))">
    <div class="flex items-center justify-between px-4 py-3">
      <h2 class="text-base font-semibold text-text">{{ $t('catalog.filters.title') }}</h2>
      <button
        type="button"
        class="min-h-11 text-sm font-semibold text-primary-hover"
        @click="emit('reset')"
      >
        {{ $t('catalog.filters.reset') }}
      </button>
    </div>

    <fieldset :class="SECTION">
      <legend :class="[HEADING, 'float-left w-full']">{{ $t('catalog.filters.price') }}</legend>
      <p class="text-compact text-text-secondary">{{ $t('catalog.filters.priceHint') }}</p>
      <div class="grid grid-cols-2 gap-2">
        <UiInput v-model="priceMin" :label="$t('catalog.filters.min')" inputmode="numeric" />
        <UiInput v-model="priceMax" :label="$t('catalog.filters.max')" inputmode="numeric" />
      </div>
    </fieldset>

    <fieldset :class="SECTION">
      <legend :class="[HEADING, 'float-left w-full']">
        {{ $t('catalog.filters.financing') }}
      </legend>
      <UiSwitch
        v-model="draft.installmentOnly"
        :label="$t('catalog.filters.installmentOnly')"
        label-position="start"
      />
      <UiSwitch
        v-model="draft.zeroInterestOnly"
        :label="$t('catalog.filters.zeroInterestOnly')"
        label-position="start"
      />
    </fieldset>

    <fieldset :class="SECTION">
      <legend :class="[HEADING, 'float-left w-full']">{{ $t('catalog.filters.term') }}</legend>
      <UiRadio
        v-model="term"
        name="filter-term"
        :value="0"
        :label="$t('catalog.filters.anyTerm')"
      />
      <UiRadio
        v-for="months in FILTER_TERMS_MONTHS"
        :key="months"
        v-model="term"
        name="filter-term"
        :value="months"
        :label="$t('finance.months', { count: months })"
      />
    </fieldset>

    <fieldset :class="SECTION">
      <legend :class="[HEADING, 'float-left w-full']">
        {{ $t('catalog.filters.monthlyPayment') }}
      </legend>
      <UiSlider
        v-model="monthlyMax"
        :min="FILTER_MONTHLY_PAYMENT_MIN"
        :max="FILTER_MONTHLY_PAYMENT_MAX"
        :step="FILTER_MONTHLY_PAYMENT_STEP"
        :label="$t('catalog.filters.monthlyPayment')"
        :value-text="format.currency(monthlyMax)"
        :min-label="format.currency(FILTER_MONTHLY_PAYMENT_MIN)"
        :max-label="format.currency(monthlyMax)"
      />
    </fieldset>

    <fieldset :class="SECTION">
      <legend :class="[HEADING, 'float-left w-full']">{{ $t('catalog.filters.brand') }}</legend>
      <UiInput
        v-model="brandSearch"
        type="search"
        :placeholder="$t('catalog.filters.brandSearch')"
        :aria-label="$t('catalog.filters.brandSearch')"
      >
        <template #prefix><Icon name="brb:search" size="18" /></template>
      </UiInput>
      <UiCheckbox
        v-for="brand in visibleBrands"
        :key="brand"
        :label="brand"
        :model-value="draft.brands.includes(brand)"
        @update:model-value="draft.brands = toggle(draft.brands, brand, $event)"
      />
    </fieldset>

    <fieldset :class="SECTION">
      <legend :class="[HEADING, 'float-left w-full']">{{ $t('catalog.filters.memory') }}</legend>
      <UiCheckbox
        v-for="size in FILTER_MEMORY_GB"
        :key="size"
        :label="`${size} GB`"
        :model-value="draft.memoryGb.includes(size)"
        @update:model-value="draft.memoryGb = toggle(draft.memoryGb, size, $event)"
      />
    </fieldset>

    <div class="border-t border-border p-4">
      <UiButton type="submit" block>{{ $t('catalog.filters.apply') }}</UiButton>
    </div>
  </form>
</template>
