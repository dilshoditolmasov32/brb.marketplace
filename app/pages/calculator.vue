<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

// A product page can pre-fill the amount: /calculator?amount=12000000
const initialAmount = Number(route.query.amount) || undefined

useSeoMeta({
  title: () => t('calculator.title'),
  description: () => t('calculator.seo.description'),
  ogTitle: () => t('calculator.title'),
  ogDescription: () => t('calculator.seo.description'),
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('calculator.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('calculator.title') }}</h1>
    <p class="mt-1 text-sm text-text-secondary">{{ $t('home.calculator.subtitle') }}</p>
    <CreditCalculator class="mt-6" :initial-amount="initialAmount" />
  </main>
</template>
