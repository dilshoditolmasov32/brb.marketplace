<script setup lang="ts">
import type { ApplicationItem, ApplicationPersonalData } from '~/types/application'

const { t } = useI18n()
const route = useRoute()
const localePath = useLocalePath()
const format = useFormat()
const cart = useCartStore()

const STEP_PRODUCT = 0
const STEP_DETAILS = 1
const STEP_DOCUMENTS = 2

// A product page opens the flow for one product (?product=12); otherwise the cart is financed
const singleProductId = computed(() => {
  const id = Number(route.query.product)
  return Number.isInteger(id) && id > 0 ? id : null
})

const { productIds: cartProductIds } = storeToRefs(cart)
const ids = computed(() => (singleProductId.value ? [singleProductId.value] : cartProductIds.value))

const { data: products, status, error, refresh } = useProductsByIds('application-products', ids)

const items = computed<ApplicationItem[]>(() =>
  products.value
    .filter((product) => ids.value.includes(product.id))
    .map((product) => ({
      product,
      quantity: singleProductId.value ? 1 : cart.quantityOf(product.id),
    })),
)

const total = computed(() =>
  items.value.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
)

const isLoading = computed(() => status.value === 'pending' || status.value === 'idle')

const backLink = computed(() =>
  singleProductId.value
    ? {
        to: localePath(ROUTES.product(singleProductId.value)),
        label: t('application.purchase.backToProduct'),
      }
    : { to: localePath(ROUTES.cart), label: t('application.purchase.backToCart') },
)

// Kept in memory only: personal data must not reach localStorage, the URL or logs
const step = ref(STEP_PRODUCT)
const personal = ref<ApplicationPersonalData>({
  fullName: '',
  documentNumber: '',
  phone: '',
  email: '',
  document: null,
  consent: false,
})

function goTo(next: number) {
  step.value = next
  if (import.meta.client) window.scrollTo({ top: 0 })
}

const title = computed(() => t(`application.titles.${APPLICATION_STEPS[step.value]}`))

// The application is personal; nothing here is useful to search engines
useRobotsRule('noindex, nofollow')
useSeoMeta({ title: () => t('application.seoTitle') })
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs
      :items="[
        { label: $t('catalog.title'), to: ROUTES.catalog },
        { label: $t('application.seoTitle') },
      ]"
    />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ title }}</h1>
    <p class="mt-1 text-compact text-text-secondary">{{ $t('application.sampleNote') }}</p>

    <ClientOnly>
      <UiFeedback
        v-if="!ids.length"
        type="empty"
        class="mt-6"
        :title="$t('application.empty.title')"
        :description="$t('application.empty.description')"
      >
        <template #action>
          <UiButton :to="localePath(ROUTES.catalog)">{{ $t('home.hero.catalog') }}</UiButton>
        </template>
      </UiFeedback>

      <UiFeedback
        v-else-if="error || (!isLoading && !items.length)"
        type="error"
        class="mt-6"
        :title="$t('errors.loadFailed')"
        :description="$t('errors.tryAgain')"
      >
        <template #action>
          <UiButton variant="outline" @click="refresh()">{{ $t('common.retry') }}</UiButton>
        </template>
      </UiFeedback>

      <div v-else-if="!items.length" class="mt-6 flex flex-col gap-3" aria-busy="true">
        <UiSkeleton v-for="n in 2" :key="n" variant="list" />
      </div>

      <template v-else>
        <ApplicationStepper class="mt-6" :current="step" />

        <!-- Step 1: product and financing -->
        <div v-if="step === STEP_PRODUCT" class="mt-6 flex max-w-3xl flex-col gap-4">
          <ApplicationProductList :items="items" />

          <section
            class="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 md:p-6"
          >
            <h2 class="text-base font-semibold text-text">
              {{ $t('application.purchase.title') }}
            </h2>
            <div class="flex items-baseline justify-between gap-4 text-compact">
              <span class="text-text-secondary">{{ $t('application.purchase.total') }}</span>
              <span class="font-semibold text-text tabular-nums">{{ format.currency(total) }}</span>
            </div>
            <p class="text-2xs text-text-secondary">{{ $t('application.purchase.note') }}</p>
            <UiButton variant="outline" block :to="backLink.to">{{ backLink.label }}</UiButton>
          </section>

          <ApplicationFinanceSummary :amount="total" />

          <UiButton block @click="goTo(STEP_DETAILS)">{{ $t('application.continue') }}</UiButton>
        </div>

        <!-- Step 2: personal information -->
        <div
          v-else-if="step === STEP_DETAILS"
          class="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start lg:gap-6"
        >
          <ApplicationPersonalForm
            v-model="personal"
            class="order-2 lg:order-1"
            @back="goTo(STEP_PRODUCT)"
            @submit="goTo(STEP_DOCUMENTS)"
          />
          <aside class="order-1 flex flex-col gap-4 lg:order-2">
            <ApplicationProductList :items="items" />
            <ApplicationFinanceSummary :amount="total" />
          </aside>
        </div>

        <!-- Step 3 onwards is not designed yet -->
        <UiFeedback
          v-else
          type="empty"
          class="mt-6"
          :title="$t('application.pending.title')"
          :description="$t('application.pending.description')"
        >
          <template #action>
            <UiButton variant="outline" @click="goTo(STEP_DETAILS)">
              {{ $t('application.back') }}
            </UiButton>
          </template>
        </UiFeedback>
      </template>

      <template #fallback>
        <div class="mt-6 flex flex-col gap-3" aria-busy="true">
          <UiSkeleton v-for="n in 2" :key="n" variant="list" />
        </div>
      </template>
    </ClientOnly>
  </main>
</template>
