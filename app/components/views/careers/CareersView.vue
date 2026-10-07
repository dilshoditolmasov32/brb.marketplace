<script setup lang="ts">
const { t } = useI18n()

const BENEFITS = [
  { key: 'growth', icon: 'lucide:trending-up' },
  { key: 'stability', icon: 'lucide:wallet' },
  { key: 'team', icon: 'lucide:users' },
  { key: 'flexibility', icon: 'lucide:calendar-clock' },
] as const

const benefits = computed(() =>
  BENEFITS.map((item) => ({
    ...item,
    title: t(`careers.benefits.items.${item.key}.title`),
    description: t(`careers.benefits.items.${item.key}.description`),
  })),
)

const openKey = ref<string | null>(VACANCIES[0]?.key ?? null)

// "Apply" on a vacancy pre-selects it in the form below and brings the form into view
const selectedVacancy = ref<string>()
const formEl = useTemplateRef<HTMLElement>('formEl')

function applyFor(key: string) {
  selectedVacancy.value = key
  formEl.value?.scrollIntoView({ behavior: 'smooth' })
}

useSeoMeta({
  title: () => t('careers.title'),
  description: () => t('careers.seo.description'),
  ogTitle: () => t('careers.title'),
  ogDescription: () => t('careers.seo.description'),
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('careers.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('careers.title') }}</h1>
    <p class="mt-1 text-sm text-text-secondary">{{ $t('careers.subtitle') }}</p>

    <section class="mt-8">
      <h2 class="text-xl font-semibold text-text">{{ $t('careers.benefits.title') }}</h2>
      <InfoFeatureGrid class="mt-6" :items="benefits" />
    </section>

    <section class="mt-10">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-xl font-semibold text-text">{{ $t('careers.vacancies.title') }}</h2>
        <UiBadge tone="warning">
          {{ $t('careers.vacancies.count', { count: VACANCIES.length }) }}
        </UiBadge>
      </div>
      <div class="mt-6 flex flex-col gap-2">
        <UiAccordion
          v-for="vacancy in VACANCIES"
          :key="vacancy.key"
          :title="$t(`careers.items.${vacancy.key}.title`)"
          :open="openKey === vacancy.key"
          @update:open="openKey = $event ? vacancy.key : null"
        >
          <div class="flex flex-col items-start gap-3">
            <ul class="flex flex-wrap gap-1.5">
              <li>
                <UiBadge tone="brand">{{
                  $t(`careers.departments.${vacancy.department}`)
                }}</UiBadge>
              </li>
              <li>
                <UiBadge>{{ $t(`branches.regions.${vacancy.region}`) }}</UiBadge>
              </li>
              <li>
                <UiBadge>{{ $t(`careers.employment.${vacancy.employment}`) }}</UiBadge>
              </li>
            </ul>
            <div>
              <h4 class="font-semibold text-text">{{ $t('careers.vacancies.duties') }}</h4>
              <p class="mt-1">{{ $t(`careers.items.${vacancy.key}.duties`) }}</p>
            </div>
            <div>
              <h4 class="font-semibold text-text">{{ $t('careers.vacancies.requirements') }}</h4>
              <p class="mt-1">{{ $t(`careers.items.${vacancy.key}.requirements`) }}</p>
            </div>
            <UiButton size="sm" @click="applyFor(vacancy.key)">
              {{ $t('careers.vacancies.apply') }}
            </UiButton>
          </div>
        </UiAccordion>
      </div>
    </section>

    <div ref="formEl" class="mt-10 scroll-mt-48">
      <CareersApplyForm v-model:vacancy="selectedVacancy" />
    </div>
  </main>
</template>
