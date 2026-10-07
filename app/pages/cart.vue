<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const format = useFormat()
const cart = useCartStore()

const { productIds } = storeToRefs(cart)
const { data: products, status, error, refresh } = useProductsByIds('cart-products', productIds)

// Keep showing a row while its product is still in the cart
const rows = computed(() =>
  products.value
    .filter((product) => cart.has(product.id))
    .map((product) => {
      const quantity = cart.quantityOf(product.id)
      return { product, quantity, lineTotal: product.price * quantity }
    }),
)

const total = computed(() => rows.value.reduce((sum, row) => sum + row.lineTotal, 0))

const loan = computed(() =>
  calculateLoan({
    amount: Math.max(1, total.value),
    termMonths: DEFAULT_TERM_MONTHS,
    annualRatePercent: DEFAULT_ANNUAL_RATE_PERCENT,
  }),
)

const summaryRows = computed(() => [
  { label: t('cart.itemsTotal'), value: format.currency(total.value) },
  { label: t('finance.annualRate'), value: format.percent(DEFAULT_ANNUAL_RATE_PERCENT) },
  { label: t('finance.term'), value: t('finance.months', { count: DEFAULT_TERM_MONTHS }) },
  { label: t('finance.totalPayment'), value: format.currency(loan.value.totalPayment) },
])

const isLoading = computed(() => status.value === 'pending' || status.value === 'idle')

// The cart is personal and client-side; nothing here is useful to search engines
useRobotsRule('noindex, nofollow')
useSeoMeta({ title: () => t('cart.title') })
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('cart.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('cart.title') }}</h1>

    <ClientOnly>
      <UiFeedback
        v-if="!cart.count"
        type="empty"
        class="mt-6"
        :title="$t('cart.empty.title')"
        :description="$t('cart.empty.description')"
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

      <div v-else-if="isLoading && !rows.length" class="mt-6 flex flex-col gap-3" aria-busy="true">
        <UiSkeleton v-for="n in 2" :key="n" variant="list" />
      </div>

      <div v-else class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
        <ul class="flex flex-col gap-3">
          <li
            v-for="row in rows"
            :key="row.product.id"
            class="flex gap-3 rounded-xl border border-border bg-surface p-3 md:gap-4 md:p-4"
          >
            <NuxtImg
              :src="row.product.thumbnail"
              :alt="row.product.title"
              width="96"
              height="96"
              loading="lazy"
              class="size-20 shrink-0 rounded-lg bg-background object-contain md:size-24"
            />
            <div class="flex min-w-0 flex-1 flex-col gap-2">
              <NuxtLink
                :to="localePath(ROUTES.product(row.product.id))"
                class="text-sm font-semibold text-text hover:text-primary-hover"
              >
                {{ row.product.title }}
              </NuxtLink>
              <p class="text-xs text-text-secondary tabular-nums">
                {{ format.currency(row.product.price) }} ·
                {{
                  $t('home.hero.perMonth', {
                    amount: format.currency(row.product.installment.monthlyPayment),
                  })
                }}
              </p>
              <div class="mt-auto flex flex-wrap items-center justify-between gap-3">
                <div class="flex items-center rounded-sm border border-border-strong">
                  <button
                    type="button"
                    class="flex size-9 items-center justify-center text-text"
                    :aria-label="$t('cart.decrease')"
                    @click="cart.setQuantity(row.product.id, row.quantity - 1)"
                  >
                    <Icon name="lucide:minus" size="16" />
                  </button>
                  <span class="min-w-8 text-center text-sm font-semibold tabular-nums">
                    {{ row.quantity }}
                  </span>
                  <button
                    type="button"
                    class="flex size-9 items-center justify-center text-text"
                    :aria-label="$t('cart.increase')"
                    @click="cart.setQuantity(row.product.id, row.quantity + 1)"
                  >
                    <Icon name="lucide:plus" size="16" />
                  </button>
                </div>
                <p class="text-base font-bold text-text tabular-nums">
                  {{ format.currency(row.lineTotal) }}
                </p>
              </div>
            </div>
            <button
              type="button"
              class="flex size-9 shrink-0 items-center justify-center text-text-secondary hover:text-error"
              :aria-label="$t('cart.remove', { title: row.product.title })"
              @click="cart.remove(row.product.id)"
            >
              <Icon name="lucide:trash-2" size="18" />
            </button>
          </li>
        </ul>

        <FinanceSummary
          class="border border-border bg-surface"
          :monthly-payment="format.currency(loan.monthlyPayment)"
          :rows="summaryRows"
          :disclaimer="$t('calculator.disclaimer')"
        >
          <template #action>
            <UiButton block :to="localePath(ROUTES.application)">
              {{ $t('productPage.installment.buy') }}
            </UiButton>
            <UiButton block variant="ghost" @click="cart.clear()">{{ $t('cart.clear') }}</UiButton>
          </template>
        </FinanceSummary>
      </div>

      <template #fallback>
        <div class="mt-6 flex flex-col gap-3" aria-busy="true">
          <UiSkeleton v-for="n in 2" :key="n" variant="list" />
        </div>
      </template>
    </ClientOnly>
  </main>
</template>
