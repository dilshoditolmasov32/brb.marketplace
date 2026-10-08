<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalog'

const props = defineProps<{ product: CatalogProduct }>()

const localePath = useLocalePath()
const format = useFormat()
const cart = useCartStore()

const MAX_STARS = 5
const stars = computed(() => Math.round(props.product.rating))
const isInCart = computed(() => cart.has(props.product.id))
</script>

<template>
  <article
    class="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface transition duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-overlay focus-within:border-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
  >
    <div class="absolute inset-x-2 top-2 z-10 flex flex-wrap gap-1">
      <UiBadge v-if="product.discountPercent" tone="error">-{{ product.discountPercent }}%</UiBadge>
      <UiBadge tone="brand">{{ $t('product.installmentBadge') }}</UiBadge>
    </div>

    <!-- Clips the image zoom so it does not spill over the card body -->
    <div class="overflow-hidden bg-background">
      <NuxtImg
        :src="product.thumbnail"
        :alt="product.title"
        width="300"
        height="300"
        loading="lazy"
        class="aspect-square w-full object-contain transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
      />
    </div>

    <div class="flex flex-1 flex-col gap-2 p-2 sm:p-3">
      <h3 class="line-clamp-2 min-h-9 text-compact leading-4.5 font-semibold text-text">
        <!-- The stretched link makes the whole card clickable; the button stays above it -->
        <NuxtLink
          :to="localePath(ROUTES.product(product.id))"
          class="transition-colors group-hover:text-primary after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-focus"
        >
          {{ product.title }}
        </NuxtLink>
      </h3>

      <p
        class="flex items-center gap-1"
        :aria-label="$t('product.rating', { value: format.number(product.rating, 1) })"
      >
        <span class="text-compact text-rating" aria-hidden="true">{{ '★'.repeat(stars) }}</span>
        <span class="text-compact text-border" aria-hidden="true">
          {{ '★'.repeat(MAX_STARS - stars) }}
        </span>
        <span class="text-2xs text-text-secondary" aria-hidden="true">
          {{ format.number(product.rating, 1) }}
        </span>
      </p>

      <div class="mt-auto flex flex-col gap-0.5">
        <s v-if="product.oldPrice" class="text-2xs text-text-secondary">
          {{ format.currency(product.oldPrice) }}
        </s>
        <p class="text-base leading-6 font-bold text-text tabular-nums sm:text-lg">
          {{ format.currency(product.price) }}
        </p>
      </div>

      <dl class="flex flex-col gap-0.5 rounded-lg bg-background p-2 text-2xs">
        <div class="flex flex-wrap items-center justify-between gap-x-2">
          <dt class="text-text-secondary">{{ $t('product.monthlyPayment') }}:</dt>
          <dd class="text-compact font-bold text-primary tabular-nums">
            {{ format.currency(product.installment.monthlyPayment) }}
          </dd>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-x-2">
          <dt class="text-text-secondary">{{ $t('product.term') }}:</dt>
          <dd class="font-semibold text-text">
            {{ $t('finance.months', { count: product.installment.termMonths }) }} ·
            {{ format.percent(product.installment.annualRatePercent) }}
          </dd>
        </div>
      </dl>

      <UiButton
        size="sm"
        block
        class="relative z-10"
        :variant="isInCart ? 'secondary' : 'primary'"
        :to="isInCart ? localePath(ROUTES.cart) : undefined"
        @click="!isInCart && cart.add(product.id)"
      >
        <span class="min-w-0 truncate">
          {{ isInCart ? $t('product.inCart') : $t('product.addToCart') }}
        </span>
      </UiButton>
    </div>
  </article>
</template>
