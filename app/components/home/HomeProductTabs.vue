<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const catalog = useCatalogApi()

const PAGE_SIZE = 10

// Each tab is the same list in a different order; the API has no dedicated collections
const QUERIES = {
  popular: { sortBy: 'rating', order: 'desc' },
  new: { sortBy: 'id', order: 'desc' },
  recommended: { skip: 30 },
} as const

type TabValue = keyof typeof QUERIES

const tab = ref<TabValue>('popular')
const tabs = computed(() => [
  { value: 'popular' as const, label: t('home.tabs.popular') },
  { value: 'new' as const, label: t('home.tabs.new') },
  { value: 'recommended' as const, label: t('home.tabs.recommended') },
])

const {
  data: products,
  status,
  error,
  refresh,
} = await useAsyncData(
  () => `home-products-${tab.value}`,
  async () => (await catalog.list({ limit: PAGE_SIZE, ...QUERIES[tab.value] })).items,
  { watch: [tab], default: () => [] },
)
</script>

<template>
  <section class="bg-surface py-8 md:py-10">
    <div class="container-page">
      <div class="flex flex-col gap-3 md:flex-row md:items-center">
        <h2 class="sr-only">{{ $t('home.tabs.title') }}</h2>
        <UiTabs v-model="tab" :tabs="tabs" :label="$t('home.tabs.title')" class="md:flex-1" />
        <UiButton variant="ghost" :to="localePath(ROUTES.catalog)">
          {{ $t('common.viewAll') }}
          <Icon name="lucide:arrow-right" size="16" class="shrink-0" />
        </UiButton>
      </div>

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
        v-else
        class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        :aria-busy="status === 'pending'"
      >
        <template v-if="status === 'pending'">
          <li v-for="n in PAGE_SIZE" :key="n"><UiSkeleton variant="card" /></li>
        </template>
        <template v-else>
          <li v-for="product in products" :key="product.id">
            <ProductCard :product="product" class="h-full" />
          </li>
        </template>
      </ul>
    </div>
  </section>
</template>
