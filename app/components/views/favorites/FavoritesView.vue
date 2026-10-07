<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const favorites = useFavoritesStore()

const { ids } = storeToRefs(favorites)
const { data: products, status, error, refresh } = useProductsByIds('favorite-products', ids)

// Hide a product as soon as it is removed from favorites
const visible = computed(() => products.value.filter((product) => favorites.has(product.id)))
const isLoading = computed(() => status.value === 'pending' || status.value === 'idle')

useRobotsRule('noindex, nofollow')
useSeoMeta({ title: () => t('favorites.title') })
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('favorites.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('favorites.title') }}</h1>

    <ClientOnly>
      <UiFeedback
        v-if="!favorites.count"
        type="empty"
        class="mt-6"
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
        class="mt-6"
        :title="$t('errors.loadFailed')"
        :description="$t('errors.tryAgain')"
      >
        <template #action>
          <UiButton variant="outline" @click="refresh()">{{ $t('common.retry') }}</UiButton>
        </template>
      </UiFeedback>

      <ul
        v-else-if="isLoading && !visible.length"
        class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
        aria-busy="true"
      >
        <li v-for="n in 4" :key="n"><UiSkeleton variant="card" /></li>
      </ul>

      <template v-else>
        <p class="mt-2 text-sm text-text-secondary">
          {{ $t('favorites.count', { count: visible.length }) }}
        </p>
        <ul class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5">
          <li v-for="product in visible" :key="product.id" class="flex flex-col gap-2">
            <ProductCard :product="product" class="flex-1" />
            <UiButton size="sm" variant="ghost" block @click="favorites.toggle(product.id)">
              {{ $t('favorites.remove') }}
            </UiButton>
          </li>
        </ul>
      </template>

      <template #fallback>
        <ul class="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5" aria-busy="true">
          <li v-for="n in 4" :key="n"><UiSkeleton variant="card" /></li>
        </ul>
      </template>
    </ClientOnly>
  </main>
</template>
