<script setup lang="ts">
const { t } = useI18n()

const FORM_ID = 'partner-form'

const BENEFITS = [
  { key: 'sales', icon: 'lucide:trending-up' },
  { key: 'audience', icon: 'lucide:users' },
  { key: 'online', icon: 'lucide:store' },
  { key: 'support', icon: 'lucide:headset' },
] as const

const STEPS = [
  { key: 'request', icon: 'lucide:file-pen-line' },
  { key: 'review', icon: 'lucide:search-check' },
  { key: 'contract', icon: 'lucide:handshake' },
  { key: 'start', icon: 'lucide:rocket' },
] as const

const REQUIREMENTS = ['registered', 'goods', 'documents', 'service'] as const

const toFeatures = (items: readonly { key: string; icon: string }[], group: 'benefits' | 'steps') =>
  items.map((item) => ({
    ...item,
    title: t(`partners.${group}.items.${item.key}.title`),
    description: t(`partners.${group}.items.${item.key}.description`),
  }))

const benefits = computed(() => toFeatures(BENEFITS, 'benefits'))
const steps = computed(() => toFeatures(STEPS, 'steps'))

useSeoMeta({
  title: () => t('partners.title'),
  description: () => t('partners.seo.description'),
  ogTitle: () => t('partners.title'),
  ogDescription: () => t('partners.seo.description'),
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('partners.title') }]" />

    <section class="mt-3 rounded-lg bg-surface-inverse p-6 text-on-inverse md:p-8">
      <div class="max-w-2xl">
        <h1 class="text-2xl font-semibold md:text-3xl">{{ $t('partners.title') }}</h1>
        <p class="mt-3 text-sm text-on-inverse-muted">{{ $t('partners.subtitle') }}</p>
        <UiButton class="mt-6" :to="{ hash: `#${FORM_ID}` }">
          {{ $t('footer.partners.apply') }}
        </UiButton>
      </div>
    </section>

    <section class="mt-10">
      <h2 class="text-xl font-semibold text-text">{{ $t('partners.benefits.title') }}</h2>
      <InfoFeatureGrid class="mt-6" :items="benefits" />
    </section>

    <section class="mt-10">
      <h2 class="text-xl font-semibold text-text">{{ $t('partners.steps.title') }}</h2>
      <InfoFeatureGrid class="mt-6" :items="steps" numbered />
    </section>

    <div class="mt-10 grid items-start gap-6 lg:grid-cols-[22rem_minmax(0,1fr)]">
      <section class="rounded-lg border border-border bg-surface p-4 md:p-6">
        <h2 class="text-lg font-semibold text-text">{{ $t('partners.requirements.title') }}</h2>
        <ul class="mt-3 flex flex-col gap-3">
          <li v-for="key in REQUIREMENTS" :key="key" class="flex gap-2 text-sm text-text">
            <Icon name="lucide:circle-check" size="18" class="mt-0.5 shrink-0 text-success" />
            {{ $t(`partners.requirements.items.${key}`) }}
          </li>
        </ul>
        <p class="mt-4 text-2xs text-text-secondary">{{ $t('partners.requirements.note') }}</p>
      </section>

      <div :id="FORM_ID" class="scroll-mt-48">
        <PartnersRequestForm />
      </div>
    </div>
  </main>
</template>
