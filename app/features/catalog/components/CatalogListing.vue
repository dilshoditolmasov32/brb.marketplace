<script setup lang="ts">
import type { BreadcrumbItem } from '~/components/layout/AppBreadcrumbs.vue'
import type { CatalogFilters } from '~/features/catalog/utils/catalogFilters'

/**
 * Product listing shared by the catalog, a category and the search page.
 * Sorting, filters and the page number live in the URL, so every state can be linked.
 */
const props = defineProps<{
  title: string
  breadcrumbs: BreadcrumbItem[]
  category?: string
  search?: string
}>()

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const format = useFormat()
const catalog = useCatalogApi()

const PAGE_SIZE = 20

const SORTS = {
  popular: { sortBy: 'rating', order: 'desc' },
  priceAsc: { sortBy: 'price', order: 'asc' },
  priceDesc: { sortBy: 'price', order: 'desc' },
  discount: { sortBy: 'discountPercentage', order: 'desc' },
  title: { sortBy: 'title', order: 'asc' },
} as const

type SortKey = keyof typeof SORTS
const DEFAULT_SORT: SortKey = 'popular'

const isSortKey = (value: unknown): value is SortKey => typeof value === 'string' && value in SORTS

const page = computed(() => Math.max(1, Math.floor(Number(route.query.page)) || 1))

const sort = computed<SortKey>({
  get: () => (isSortKey(route.query.sort) ? route.query.sort : DEFAULT_SORT),
  // Changing the order restarts from the first page
  set: (value) =>
    navigateTo({
      query: { ...route.query, sort: value === DEFAULT_SORT ? undefined : value, page: undefined },
    }),
})

const sortOptions = computed(() =>
  (Object.keys(SORTS) as SortKey[]).map((value) => ({ value, label: t(`catalog.sort.${value}`) })),
)

// --- Filters ---------------------------------------------------------------------------
const filters = computed(() => parseCatalogFilters(route.query))

function applyFilters(next: CatalogFilters) {
  isPanelOpen.value = false
  return navigateTo({
    query: { ...route.query, ...catalogFiltersToQuery(next), page: undefined },
  })
}

const resetFilters = () => applyFilters(emptyCatalogFilters())

/** One removable chip per active filter value */
const chips = computed(() => {
  const current = filters.value
  const without = (patch: Partial<CatalogFilters>) => () => applyFilters({ ...current, ...patch })
  const list: { key: string; label: string; remove: () => unknown }[] = []

  if (current.priceMin) {
    list.push({
      key: 'priceMin',
      label: t('catalog.chips.priceFrom', { value: format.currency(current.priceMin) }),
      remove: without({ priceMin: null }),
    })
  }
  if (current.priceMax) {
    list.push({
      key: 'priceMax',
      label: t('catalog.chips.priceTo', { value: format.currency(current.priceMax) }),
      remove: without({ priceMax: null }),
    })
  }
  if (current.installmentOnly) {
    list.push({
      key: 'installment',
      label: t('catalog.filters.installmentOnly'),
      remove: without({ installmentOnly: false }),
    })
  }
  if (current.zeroInterestOnly) {
    list.push({
      key: 'zero',
      label: t('catalog.filters.zeroInterestOnly'),
      remove: without({ zeroInterestOnly: false }),
    })
  }
  if (current.termMonths) {
    list.push({
      key: 'term',
      label: t('catalog.chips.term', { value: t('finance.months', { count: current.termMonths }) }),
      remove: without({ termMonths: null }),
    })
  }
  if (current.monthlyPaymentMax) {
    list.push({
      key: 'monthlyMax',
      label: t('catalog.chips.monthlyTo', { value: format.currency(current.monthlyPaymentMax) }),
      remove: without({ monthlyPaymentMax: null }),
    })
  }
  for (const brand of current.brands) {
    list.push({
      key: `brand-${brand}`,
      label: brand,
      remove: without({ brands: current.brands.filter((item) => item !== brand) }),
    })
  }
  for (const size of current.memoryGb) {
    list.push({
      key: `memory-${size}`,
      label: `${size} GB`,
      remove: without({ memoryGb: current.memoryGb.filter((item) => item !== size) }),
    })
  }
  return list
})

// --- Data ------------------------------------------------------------------------------
const { data: categories } = await useCategories()

const { data, status, error, refresh } = await useAsyncData(
  () => `catalog-${props.category ?? ''}-${props.search ?? ''}-${sort.value}-${page.value}`,
  () => {
    // BACKEND HOOK: the mock API cannot filter, so `filters` is not sent yet.
    // When the real catalog endpoint exists, map filters.value to its parameters here
    // and add the filters to the cache key and the watch list below.
    const query = { limit: PAGE_SIZE, skip: (page.value - 1) * PAGE_SIZE, ...SORTS[sort.value] }
    if (props.search) return catalog.search(props.search, query)
    if (props.category) return catalog.byCategory(props.category, query)
    return catalog.list(query)
  },
  { watch: [page, sort, () => props.category, () => props.search] },
)

const pageCount = computed(() => Math.ceil((data.value?.total ?? 0) / PAGE_SIZE))
const isPanelOpen = ref(false)

watch(
  () => route.path,
  () => (isPanelOpen.value = false),
)
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="breadcrumbs" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ title }}</h1>

    <div class="mt-6 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
      <aside class="hidden flex-col gap-4 lg:flex">
        <div class="rounded-lg border border-border bg-surface p-3">
          <h2 class="px-3 py-2 text-sm font-semibold text-text">{{ $t('catalog.categories') }}</h2>
          <!-- Capped height keeps the filters below within reach -->
          <div class="max-h-72 overflow-y-auto">
            <CatalogCategoryNav :categories="categories" :active="category" />
          </div>
        </div>
        <div class="rounded-lg border border-border bg-surface">
          <CatalogFilters :filters="filters" @apply="applyFilters" @reset="resetFilters" />
        </div>
      </aside>

      <div class="min-w-0">
        <div class="flex flex-wrap items-end justify-between gap-3">
          <p class="text-sm text-text-secondary" aria-live="polite">
            <template v-if="data">
              {{ $t('catalog.total') }}:
              <span class="font-semibold text-text">
                {{ $t('catalog.products', { count: format.number(data.total) }) }}
              </span>
            </template>
          </p>
          <div class="flex w-full items-end gap-3 sm:w-auto">
            <UiButton variant="outline" class="min-w-0 lg:hidden" @click="isPanelOpen = true">
              <Icon name="lucide:sliders-horizontal" size="16" />
              {{ $t('catalog.filters.title') }}
              <span v-if="chips.length" class="tabular-nums">({{ chips.length }})</span>
            </UiButton>
            <UiSelect
              v-model="sort"
              :options="sortOptions"
              :label="$t('catalog.sort.label')"
              class="min-w-0 flex-1 sm:w-60 sm:flex-none"
            />
          </div>
        </div>

        <ul v-if="chips.length" class="mt-4 flex flex-wrap items-center gap-2">
          <li v-for="chip in chips" :key="chip.key">
            <button
              type="button"
              class="flex min-h-8 items-center gap-1.5 rounded-full border border-primary bg-primary-soft px-3 text-xs font-semibold text-primary-hover"
              :aria-label="$t('catalog.chips.remove', { label: chip.label })"
              @click="chip.remove()"
            >
              {{ chip.label }}
              <Icon name="lucide:x" size="14" />
            </button>
          </li>
          <li>
            <button
              type="button"
              class="min-h-8 px-1 text-xs font-semibold text-primary-hover"
              @click="resetFilters"
            >
              {{ $t('catalog.chips.clearAll') }}
            </button>
          </li>
        </ul>

        <UiFeedback
          v-if="error"
          type="error"
          class="mt-6"
          :title="$t('errors.loadFailed')"
          :description="$t('errors.tryAgain')"
        >
          <template #action>
            <UiButton variant="outline" @click="refresh()">{{ $t('common.retry') }}</UiButton>
          </template>
        </UiFeedback>

        <ul
          v-else-if="status === 'pending'"
          class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4"
          aria-busy="true"
        >
          <li v-for="n in 8" :key="n"><UiSkeleton variant="card" /></li>
        </ul>

        <UiFeedback
          v-else-if="!data?.items.length"
          type="empty"
          class="mt-6"
          :title="$t('catalog.empty.title')"
          :description="$t('catalog.empty.description')"
        >
          <template #action>
            <UiButton variant="outline" :to="localePath(ROUTES.catalog)">
              {{ $t('catalog.all') }}
            </UiButton>
          </template>
        </UiFeedback>

        <template v-else>
          <ul class="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
            <li v-for="product in data.items" :key="product.id">
              <ProductCard :product="product" class="h-full" />
            </li>
          </ul>

          <section
            class="mt-6 flex flex-col gap-4 rounded-xl bg-primary p-6 text-on-primary sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h2 class="text-lg font-semibold">{{ $t('home.financing.title') }}</h2>
              <p class="mt-1 text-compact">
                {{
                  $t('home.financing.description', {
                    min: format.currency(LOAN_AMOUNT_MIN),
                    max: format.currency(LOAN_AMOUNT_MAX),
                  })
                }}
              </p>
            </div>
            <UiButton variant="secondary" class="shrink-0" :to="localePath(ROUTES.calculator)">
              {{ $t('catalog.calculate') }}
            </UiButton>
          </section>

          <UiPagination class="mt-6" :page="page" :page-count="pageCount" />
        </template>
      </div>
    </div>

    <ClientOnly>
      <UiDrawer v-model="isPanelOpen" :title="$t('catalog.filters.title')" direction="btt">
        <div class="-mx-2 text-text">
          <h3 class="px-3 py-2 text-sm font-semibold">{{ $t('catalog.categories') }}</h3>
          <CatalogCategoryNav :categories="categories" :active="category" />
          <CatalogFilters
            class="mt-2 border-t border-border"
            :filters="filters"
            @apply="applyFilters"
            @reset="resetFilters"
          />
        </div>
      </UiDrawer>
    </ClientOnly>
  </main>
</template>
