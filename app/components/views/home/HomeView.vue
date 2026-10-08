<script setup lang="ts">
const { t } = useI18n()
const api = useApi()
const catalog = useCatalogApi()

const HERO_CATEGORY = 'smartphones'

const { data: categories } = await useCategories()

// Independent blocks load in parallel; a failed block is hidden instead of breaking the page
const [{ data: heroProducts }, { data: deals }, { data: posts }] = await Promise.all([
  useAsyncData(
    'home-hero',
    async () =>
      (await catalog.byCategory(HERO_CATEGORY, { limit: 7, sortBy: 'price', order: 'desc' })).items,
    { default: () => [] },
  ),
  useAsyncData(
    'home-deals',
    async () =>
      (await catalog.list({ limit: 4, sortBy: 'discountPercentage', order: 'desc' })).items,
    { default: () => [] },
  ),
  useAsyncData('home-posts', async () => (await api.posts.list({ limit: 3 })).posts, {
    default: () => [],
  }),
])

useSeoMeta({
  title: () => t('home.seo.title'),
  description: () => t('home.seo.description'),
  ogTitle: () => t('home.seo.title'),
  ogDescription: () => t('home.seo.description'),
  ogType: 'website',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <main>
    <HomeHero :products="heroProducts" />
    <HomeCategories :categories="categories" />

    <div class="container-page py-4">
      <UiAlert :title="$t('home.promo.title')" dismissible>
        {{ $t('home.promo.description') }}
      </UiAlert>  
    </div>

    <HomeProductTabs />
    <HomeFinancingBanner />
    <HomeDeals :products="deals" />

    <section class="bg-surface py-10 md:py-14">
      <div class="container-page">
        <div class="text-center">
          <h2 class="text-xl font-semibold text-text md:text-2xl">{{ $t('calculator.title') }}</h2>
          <p class="mt-1 text-sm text-text-secondary">{{ $t('home.calculator.subtitle') }}</p>
        </div>
        <CreditCalculator class="mt-8" />
      </div>
    </section>

    <HomeSteps />
    <HomeNews :posts="posts" />
    <HomeFaq />
    <HomeCta />
  </main>
</template>
