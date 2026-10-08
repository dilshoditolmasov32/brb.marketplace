<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalog'

defineProps<{ products: CatalogProduct[] }>()

const localePath = useLocalePath()
</script>

<template>
  <section v-if="products.length" class="py-8 md:py-10">
    <div class="container-page">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-text">{{ $t('home.deals.title') }}</h2>
          <p class="text-compact text-text-secondary">{{ $t('home.deals.subtitle') }}</p>
        </div>
        <UiButton variant="outline" class="min-w-0 shrink-0" :to="localePath(ROUTES.catalog)">
          {{ $t('common.viewAll') }}
          <Icon name="lucide:arrow-right" size="16" class="shrink-0" />
        </UiButton>
      </div>
      <ul class="mt-6 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <li v-for="product in products" :key="product.id">
          <ProductCard :product="product" class="h-full" />
        </li>
      </ul>
    </div>
  </section>
</template>
