<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

type RegionFilter = BranchRegion | 'all'

const region = ref<RegionFilter>('all')

const regionOptions = computed<{ value: RegionFilter; label: string }[]>(() => [
  { value: 'all', label: t('branches.allRegions') },
  ...BRANCH_REGIONS.map((value) => ({ value, label: t(`branches.regions.${value}`) })),
])

const visible = computed(() =>
  BRANCHES.filter((branch) => region.value === 'all' || branch.region === region.value),
)

useSeoMeta({
  title: () => t('branches.title'),
  description: () => t('branches.seo.description'),
  ogTitle: () => t('branches.title'),
  ogDescription: () => t('branches.seo.description'),
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('branches.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('branches.title') }}</h1>
    <p class="mt-1 text-sm text-text-secondary">{{ $t('branches.subtitle') }}</p>

    <UiAlert class="mt-6" :title="$t('common.sampleTitle')">
      {{ $t('common.sampleData') }}
    </UiAlert>

    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <UiSelect
        v-model="region"
        :options="regionOptions"
        :label="$t('branches.region')"
        class="sm:w-72"
      />
      <p class="text-sm text-text-secondary" aria-live="polite">
        {{ $t('branches.count', { count: visible.length }) }}
      </p>
    </div>

    <ul class="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <li v-for="branch in visible" :key="branch.key">
        <BranchCard :branch="branch" />
      </li>
    </ul>

    <section
      class="mt-10 flex flex-col gap-4 rounded-lg bg-primary-soft p-4 md:flex-row md:items-center md:justify-between md:p-6"
    >
      <div>
        <h2 class="text-lg font-semibold text-text">{{ $t('branches.online.title') }}</h2>
        <p class="mt-1 text-compact text-text-secondary">{{ $t('branches.online.description') }}</p>
      </div>
      <div class="flex shrink-0 flex-col gap-3 sm:flex-row">
        <UiButton :to="localePath(ROUTES.catalog)">{{ $t('home.hero.catalog') }}</UiButton>
        <UiButton variant="outline" :to="localePath(ROUTES.contacts)">
          {{ $t('footer.users.contact') }}
        </UiButton>
      </div>
    </section>
  </main>
</template>
