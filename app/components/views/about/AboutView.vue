<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const format = useFormat()

const VALUES = [
  { key: 'transparency', icon: 'lucide:eye' },
  { key: 'speed', icon: 'lucide:zap' },
  { key: 'accessibility', icon: 'lucide:hand-coins' },
  { key: 'security', icon: 'lucide:shield-check' },
] as const

const values = computed(() =>
  VALUES.map((item) => ({
    ...item,
    title: t(`about.values.items.${item.key}.title`),
    description: t(`about.values.items.${item.key}.description`),
  })),
)

const stats = computed(() => [
  { value: format.currency(LOAN_AMOUNT_MAX), label: t('about.stats.maxAmount') },
  {
    value: t('finance.months', { count: LOAN_TERM_MAX_MONTHS }),
    label: t('home.financing.maxTerm'),
  },
  { value: format.percent(DEFAULT_ANNUAL_RATE_PERCENT), label: t('home.financing.rate') },
  { value: format.number(BRANCHES.length), label: t('about.stats.branches') },
])

const details = computed(() => [
  { label: t('about.details.name'), value: t('common.siteName') },
  { label: t('about.details.license'), value: t('about.details.licenseValue') },
  { label: t('about.details.address'), value: t('contacts.channels.office.value') },
  { label: t('forms.phone'), value: COMPANY_SAMPLE.phone },
  { label: t('about.details.email'), value: COMPANY_SAMPLE.email },
])

useSeoMeta({
  title: () => t('about.title'),
  description: () => t('about.seo.description'),
  ogTitle: () => t('about.title'),
  ogDescription: () => t('about.seo.description'),
})
</script>

<template>
  <main>
    <div class="container-page py-6 md:py-8">
      <AppBreadcrumbs :items="[{ label: $t('about.title') }]" />
      <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('about.title') }}</h1>
      <p class="mt-1 text-sm text-text-secondary">{{ $t('about.subtitle') }}</p>

      <section class="mt-6 rounded-lg bg-surface-inverse p-6 text-on-inverse md:p-8">
        <div class="max-w-3xl">
          <h2 class="text-xl font-semibold md:text-2xl">{{ $t('about.lead.title') }}</h2>
          <p class="mt-3 text-sm text-on-inverse-muted">{{ $t('about.lead.text') }}</p>
        </div>
        <dl class="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 lg:grid-cols-4">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col-reverse">
            <dt class="text-2xs text-on-inverse-muted">{{ stat.label }}</dt>
            <dd class="text-xl font-semibold">{{ stat.value }}</dd>
          </div>
        </dl>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold text-text">{{ $t('about.mission.title') }}</h2>
        <p class="mt-2 max-w-3xl text-sm text-text-secondary">{{ $t('about.mission.text') }}</p>
      </section>

      <section class="mt-10">
        <h2 class="text-xl font-semibold text-text">{{ $t('about.values.title') }}</h2>
        <p class="mt-1 text-sm text-text-secondary">{{ $t('about.values.subtitle') }}</p>
        <InfoFeatureGrid class="mt-6" :items="values" />
      </section>

      <section class="mt-10 rounded-lg border border-border bg-surface p-4 md:p-6">
        <div class="flex items-center justify-between gap-3">
          <h2 class="text-lg font-semibold text-text">{{ $t('about.details.title') }}</h2>
          <UiBadge tone="warning">{{ $t('common.sample') }}</UiBadge>
        </div>
        <dl class="mt-4 flex flex-col">
          <div
            v-for="row in details"
            :key="row.label"
            class="flex flex-col gap-1 border-t border-border py-3 text-sm sm:flex-row sm:gap-6"
          >
            <dt class="text-text-secondary sm:w-56 sm:shrink-0">{{ row.label }}</dt>
            <dd class="text-text">{{ row.value }}</dd>
          </div>
        </dl>
        <p class="text-2xs text-text-secondary">{{ $t('common.sampleData') }}</p>
        <div class="mt-4 flex flex-col gap-3 sm:flex-row">
          <UiButton variant="outline" :to="localePath(ROUTES.branches)">
            {{ $t('header.branches') }}
          </UiButton>
          <UiButton variant="outline" :to="localePath(ROUTES.contacts)">
            {{ $t('footer.users.contact') }}
          </UiButton>
        </div>
      </section>
    </div>

    <HomeSteps />
    <HomeCta />
  </main>
</template>
