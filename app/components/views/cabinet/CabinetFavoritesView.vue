<script setup lang="ts">
const localePath = useLocalePath()
const favorites = useFavoritesStore()
const { product } = useCabinetSample()

const { ids } = storeToRefs(favorites)
const { data: products, status, error, refresh } = useProductsByIds('favorite-products', ids)

// Hide a product as soon as it is removed from favorites
const visible = computed(() => products.value.filter((item) => favorites.has(item.id)))
const isLoading = computed(() => status.value === 'pending' || status.value === 'idle')
</script>

<template>
  <CabinetShell section="favorites">
    <UiFeedback
      v-if="!favorites.count"
      type="empty"
      :title="$t('favorites.empty.title')"
      :description="$t('favorites.empty.description')"
    >
      <template #action>
        <UiButton :to="localePath(ROUTES.catalog)">{{ $t('home.hero.catalog') }}</UiButton>
      </template>
    </UiFeedback>

    <UiFeedback
      v-else-if="error"
      type="error"
      :title="$t('errors.loadFailed')"
      :description="$t('errors.tryAgain')"
    >
      <template #action>
        <UiButton variant="outline" @click="refresh()">{{ $t('common.retry') }}</UiButton>
      </template>
    </UiFeedback>

    <ul
      v-else-if="isLoading && !visible.length"
      class="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4"
      aria-busy="true"
    >
      <li v-for="n in 4" :key="n"><UiSkeleton variant="card" /></li>
    </ul>

    <template v-else>
      <p class="text-compact text-text-secondary">
        {{ $t('favorites.count', { count: visible.length }) }} ·
        {{ $t('cabinet.favorites.samplePrices') }}
      </p>
      <ul class="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        <li v-for="item in visible" :key="item.id" class="flex flex-col gap-2">
          <ProductCard :product="item" class="flex-1" />
          <UiButton size="sm" variant="ghost" block @click="favorites.toggle(item.id)">
            {{ $t('favorites.remove') }}
          </UiButton>
        </li>
      </ul>
    </template>

    <CabinetCard v-if="product" :title="$t('cabinet.favorites.continue.title')">
      <p class="text-compact text-text-secondary">
        {{ $t('cabinet.favorites.continue.description', { product: product.title }) }}
      </p>
      <UiButton
        block
        :to="{ path: localePath(ROUTES.application), query: { product: product.id } }"
      >
        {{ $t('cabinet.favorites.continue.action') }}
      </UiButton>
    </CabinetCard>
  </CabinetShell>
</template>
