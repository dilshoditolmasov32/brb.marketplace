<script setup lang="ts">
import type { FetchError } from 'ofetch'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const requestUrl = useRequestURL()
const format = useFormat()
const catalog = useCatalogApi()
const cart = useCartStore()
const favorites = useFavoritesStore()

const SIMILAR_LIMIT = 5

const id = computed(() => String(route.params.id))

const { data: product, error } = await useAsyncData(
  () => `product-${id.value}`,
  () => catalog.product(id.value),
)

if (error.value || !product.value) {
  const status = (error.value as FetchError | null)?.statusCode
  throw createError({
    statusCode: status === 404 || !error.value ? 404 : 503,
    statusMessage: status === 404 ? 'Product not found' : 'Product unavailable',
    fatal: true,
  })
}

const { data: categories } = await useCategories()
const categoryName = computed(
  () =>
    categories.value.find((item) => item.slug === product.value?.categorySlug)?.name ??
    product.value?.categorySlug ??
    '',
)

// Secondary block: the page stays usable if it fails
const { data: similar } = await useAsyncData(
  () => `product-${id.value}-similar`,
  async () => {
    const current = product.value
    if (!current) return []
    const response = await catalog.byCategory(current.categorySlug, { limit: SIMILAR_LIMIT })
    return response.items.filter((item) => item.id !== current.id).slice(0, SIMILAR_LIMIT - 1)
  },
  { default: () => [] },
)

// Installment preview for the selected term
const termMonths = ref<number>(DEFAULT_TERM_MONTHS)
const termOptions = computed(() =>
  LOAN_TERM_OPTIONS.map((value) => ({
    value: value as number,
    label: t('finance.months', { count: value }),
  })),
)

// Demonstration variants: the mock API has none, so the choice does not change the price
const colorOptions = PRODUCT_COLOR_OPTIONS.map((value) => ({
  value: value as string,
  label: value,
}))
const memoryOptions = PRODUCT_MEMORY_OPTIONS_GB.map((value) => ({
  value: value as number,
  label: `${value} GB`,
}))
const color = ref<string>(PRODUCT_COLOR_OPTIONS[0])
const memoryGb = ref<number>(PRODUCT_MEMORY_OPTIONS_GB[0])

// Down payment reduces the financed amount; at least one price step must stay financed
const downPayment = ref(0)
const downPaymentText = ref('0')
const maxDownPayment = computed(() =>
  Math.max(0, (product.value?.price ?? 0) - PRICE_ROUNDING_STEP),
)

function commitDownPayment() {
  const entered = Number(downPaymentText.value.replace(/\D/g, '')) || 0
  downPayment.value = Math.min(maxDownPayment.value, entered)
  downPaymentText.value = format.number(downPayment.value)
}

const financedAmount = computed(() => Math.max(1, (product.value?.price ?? 0) - downPayment.value))

const loan = computed(() =>
  calculateLoan({
    amount: financedAmount.value,
    termMonths: termMonths.value,
    annualRatePercent: DEFAULT_ANNUAL_RATE_PERCENT,
  }),
)

const loanRows = computed(() => [
  { label: t('productPage.loanAmount'), value: format.currency(financedAmount.value) },
  { label: t('productPage.installment.downPayment'), value: format.currency(downPayment.value) },
  { label: t('finance.annualRate'), value: format.percent(DEFAULT_ANNUAL_RATE_PERCENT) },
  { label: t('finance.term'), value: t('finance.months', { count: termMonths.value }) },
  { label: t('finance.totalInterest'), value: format.currency(loan.value.totalInterest) },
  {
    label: t('finance.totalPayment'),
    value: format.currency(loan.value.totalPayment + downPayment.value),
  },
])

const specifications = computed(() => {
  const item = product.value
  if (!item) return []
  const rows = [
    { label: t('productPage.specs.brand'), value: item.brand },
    { label: t('productPage.specs.category'), value: categoryName.value },
    { label: t('productPage.specs.sku'), value: item.sku },
    { label: t('productPage.specs.warranty'), value: item.warrantyInformation },
    {
      label: t('productPage.specs.dimensions'),
      value: item.dimensions
        ? [item.dimensions.width, item.dimensions.height, item.dimensions.depth]
            .map((value) => format.number(value, 2))
            .join(' × ')
        : null,
    },
    {
      label: t('productPage.specs.weight'),
      value: item.weight === null ? null : format.number(item.weight, 2),
    },
  ]
  return rows.filter((row): row is { label: string; value: string } => Boolean(row.value))
})

const isInCart = computed(() => (product.value ? cart.has(product.value.id) : false))
const isFavorite = computed(() => (product.value ? favorites.has(product.value.id) : false))

const MAX_STARS = 5
const starsOf = (rating: number) => '★'.repeat(Math.round(rating))

const seoTitle = computed(() => product.value?.title ?? '')
const seoDescription = computed(() =>
  t('productPage.seo.description', {
    title: product.value?.title ?? '',
    price: format.currency(product.value?.price ?? 0),
    monthly: format.currency(product.value?.installment.monthlyPayment ?? 0),
  }),
)

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: () => product.value?.thumbnail,
  ogType: 'website',
  twitterCard: 'summary_large_image',
})

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () => {
        const item = product.value
        if (!item) return ''
        return JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: item.title,
          description: item.description,
          image: item.images.length ? item.images : [item.thumbnail],
          sku: item.sku,
          ...(item.brand ? { brand: { '@type': 'Brand', name: item.brand } } : {}),
          offers: {
            '@type': 'Offer',
            url: requestUrl.href,
            priceCurrency: 'UZS',
            price: item.price,
            availability: item.inStock
              ? 'https://schema.org/InStock'
              : 'https://schema.org/OutOfStock',
          },
        })
      },
    },
  ],
})
</script>

<template>
  <main v-if="product" class="container-page py-6 md:py-8">
    <AppBreadcrumbs
      :items="[
        { label: $t('catalog.title'), to: ROUTES.catalog },
        { label: categoryName, to: ROUTES.category(product.categorySlug) },
        { label: product.title },
      ]"
    />

    <div class="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] lg:gap-8">
      <ProductGallery
        :images="product.images.length ? product.images : [product.thumbnail]"
        :title="product.title"
      />

      <div class="flex flex-col gap-4">
        <p class="text-xs tracking-wide text-text-secondary uppercase">
          <template v-if="product.brand">{{ product.brand }} · </template>{{ categoryName }}
        </p>
        <h1 class="text-2xl font-semibold text-text">{{ product.title }}</h1>

        <p
          class="flex items-center gap-1"
          :aria-label="$t('product.rating', { value: format.number(product.rating, 1) })"
        >
          <span class="text-sm text-rating" aria-hidden="true">{{ starsOf(product.rating) }}</span>
          <span class="text-sm text-border" aria-hidden="true">
            {{ '★'.repeat(MAX_STARS - Math.round(product.rating)) }}
          </span>
          <span class="text-compact text-text-secondary" aria-hidden="true">
            {{ format.number(product.rating, 1) }} ·
            {{ $t('productPage.reviewCount', { count: product.reviews.length }) }}
          </span>
        </p>

        <div>
          <div class="flex flex-wrap items-center gap-2">
            <s v-if="product.oldPrice" class="text-sm text-text-secondary">
              {{ format.currency(product.oldPrice) }}
            </s>
            <UiBadge v-if="product.discountPercent" tone="error">
              -{{ product.discountPercent }}%
            </UiBadge>
          </div>
          <p class="text-3xl font-semibold text-text tabular-nums">
            {{ format.currency(product.price) }}
          </p>
          <p class="mt-1 text-sm text-primary-hover tabular-nums">
            {{
              $t('home.hero.perMonth', {
                amount: format.currency(product.installment.monthlyPayment),
              })
            }}
            ·
            {{ $t('finance.months', { count: product.installment.termMonths }) }}
          </p>
        </div>

        <div class="grid gap-3 sm:grid-cols-2">
          <UiSelect v-model="color" :options="colorOptions" :label="$t('productPage.color')" />
          <UiSelect v-model="memoryGb" :options="memoryOptions" :label="$t('productPage.memory')" />
        </div>

        <div class="flex flex-col gap-3">
          <UiButton
            block
            :variant="isInCart ? 'secondary' : 'primary'"
            :to="isInCart ? localePath(ROUTES.cart) : undefined"
            :disabled="!product.inStock"
            @click="!isInCart && cart.add(product.id)"
          >
            {{
              !product.inStock
                ? $t('productPage.outOfStock')
                : isInCart
                  ? $t('product.inCart')
                  : $t('product.addToCart')
            }}
          </UiButton>
          <UiButton
            block
            variant="outline"
            :aria-pressed="isFavorite"
            @click="favorites.toggle(product.id)"
          >
            <Icon
              name="lucide:heart"
              size="18"
              :class="isFavorite ? 'text-primary' : 'text-text'"
            />
            {{ isFavorite ? $t('productPage.inFavorites') : $t('productPage.addToFavorites') }}
          </UiButton>
        </div>

        <section class="rounded-xl border border-border bg-surface p-4 md:p-6">
          <h2 class="text-lg font-semibold text-text">{{ $t('productPage.delivery.title') }}</h2>
          <dl class="mt-3 flex flex-col gap-2 text-sm">
            <div class="flex justify-between gap-4">
              <dt class="text-text-secondary">{{ $t('productPage.delivery.availability') }}</dt>
              <dd class="text-right font-semibold text-text">{{ product.availabilityStatus }}</dd>
            </div>
            <div v-if="product.shippingInformation" class="flex justify-between gap-4">
              <dt class="text-text-secondary">{{ $t('productPage.delivery.shipping') }}</dt>
              <dd class="text-right font-semibold text-text">{{ product.shippingInformation }}</dd>
            </div>
            <div v-if="product.returnPolicy" class="flex justify-between gap-4">
              <dt class="text-text-secondary">{{ $t('productPage.delivery.returns') }}</dt>
              <dd class="text-right font-semibold text-text">{{ product.returnPolicy }}</dd>
            </div>
          </dl>
        </section>
      </div>
    </div>

    <div
      class="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.9fr)_minmax(0,1fr)] lg:items-start lg:gap-8"
    >
      <div class="flex flex-col gap-4">
        <section class="rounded-xl border border-border bg-surface p-4 md:p-6">
          <h2 class="text-lg font-semibold text-text">{{ $t('productPage.about') }}</h2>
          <p class="mt-3 text-sm text-text">{{ product.description }}</p>
        </section>

        <section
          v-if="specifications.length"
          class="rounded-xl border border-border bg-surface p-4 md:p-6"
        >
          <h2 class="text-lg font-semibold text-text">{{ $t('productPage.specs.title') }}</h2>
          <dl class="mt-3 flex flex-col gap-3 text-sm">
            <div v-for="row in specifications" :key="row.label" class="flex justify-between gap-4">
              <dt class="text-text-secondary">{{ row.label }}</dt>
              <dd class="text-right font-semibold text-text">{{ row.value }}</dd>
            </div>
          </dl>
        </section>

        <section
          v-if="product.reviews.length"
          class="rounded-xl border border-border bg-surface p-4 md:p-6"
        >
          <h2 class="text-lg font-semibold text-text">{{ $t('productPage.reviews') }}</h2>
          <ul class="mt-3 flex flex-col divide-y divide-border">
            <li v-for="(review, index) in product.reviews" :key="index" class="py-3 first:pt-0">
              <div class="flex flex-wrap items-center justify-between gap-2">
                <p class="text-sm font-semibold text-text">{{ review.author }}</p>
                <p class="text-xs text-text-secondary">{{ format.date(review.date) }}</p>
              </div>
              <p
                class="text-compact text-rating"
                :aria-label="$t('product.rating', { value: review.rating })"
              >
                <span aria-hidden="true">{{ starsOf(review.rating) }}</span>
              </p>
              <p class="mt-1 text-sm text-text-secondary">{{ review.comment }}</p>
            </li>
          </ul>
        </section>
      </div>

      <section class="flex flex-col gap-4">
        <div>
          <h2 class="text-lg font-semibold text-text">{{ $t('productPage.installment.title') }}</h2>
          <p class="mt-1 text-sm text-text-secondary">
            {{ $t('productPage.installment.subtitle') }}
          </p>
        </div>
        <UiInput
          v-model="downPaymentText"
          :label="$t('productPage.installment.downPayment')"
          :hint="
            $t('productPage.installment.downPaymentHint', { max: format.currency(maxDownPayment) })
          "
          inputmode="numeric"
          autocomplete="off"
          @change="commitDownPayment"
        >
          <template #suffix><span class="text-xs text-text-secondary">UZS</span></template>
        </UiInput>
        <UiSelect
          v-model="termMonths"
          :options="termOptions"
          :label="$t('finance.term')"
          :hint="$t('productPage.installment.termHint')"
        />
        <FinanceSummary
          class="border border-border bg-surface"
          :monthly-payment="format.currency(loan.monthlyPayment)"
          :rows="loanRows"
          :disclaimer="$t('calculator.disclaimer')"
        />
        <UiButton
          block
          :to="{ path: localePath(ROUTES.application), query: { product: product.id } }"
        >
          {{ $t('productPage.installment.buy') }}
        </UiButton>
        <UiButton
          block
          variant="outline"
          :to="{ path: localePath(ROUTES.calculator), query: { amount: financedAmount } }"
        >
          {{ $t('productPage.installment.calculate') }}
        </UiButton>
        <UiAccordion :title="$t('productPage.installment.termsTitle')">
          {{ $t('calculator.rateNote', { rate: format.percent(DEFAULT_ANNUAL_RATE_PERCENT) }) }}
        </UiAccordion>
      </section>
    </div>

    <section v-if="similar.length" class="mt-10">
      <h2 class="text-lg font-semibold text-text">{{ $t('productPage.similar') }}</h2>
      <ul class="mt-4 grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-4">
        <li v-for="item in similar" :key="item.id">
          <ProductCard :product="item" class="h-full" />
        </li>
      </ul>
    </section>
  </main>
</template>
