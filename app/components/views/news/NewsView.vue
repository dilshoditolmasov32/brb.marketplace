<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const api = useApi()

const PAGE_SIZE = 9

// The page number lives in the URL, so every page can be linked
const page = computed(() => Math.max(1, Math.floor(Number(route.query.page)) || 1))

const { data, status, error, refresh } = await useAsyncData(
  () => `news-${page.value}`,
  () => api.posts.list({ limit: PAGE_SIZE, skip: (page.value - 1) * PAGE_SIZE }),
  { watch: [page] },
)

const pageCount = computed(() => Math.ceil((data.value?.total ?? 0) / PAGE_SIZE))

useSeoMeta({
  title: () => t('home.news.title'),
  description: () => t('news.seo.description'),
  ogTitle: () => t('home.news.title'),
  ogDescription: () => t('news.seo.description'),
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('news.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('home.news.title') }}</h1>
    <p class="mt-1 text-sm text-text-secondary">{{ $t('home.news.subtitle') }}</p>

    <UiFeedback
      v-if="error"
      type="error"
      class="mt-6"
      :title="$t('errors.loadFailed')"
      :description="$t('errors.tryAgain')"
    >
      <template #action>
        <UiButton variant="outline" @click="refresh()">{{ $t('common.retry') }}</UiButton>
      </template>
    </UiFeedback>

    <ul
      v-else-if="status === 'pending'"
      class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      aria-busy="true"
    >
      <li v-for="n in 6" :key="n"><UiSkeleton variant="card" /></li>
    </ul>

    <UiFeedback
      v-else-if="!data?.posts.length"
      type="empty"
      class="mt-6"
      :title="$t('news.empty.title')"
      :description="$t('news.empty.description')"
    />

    <template v-else>
      <p class="mt-2 text-sm text-text-secondary">
        {{ $t('news.total', { count: data.total }) }}
      </p>
      <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="post in data.posts" :key="post.id">
          <NewsCard :post="post" />
        </li>
      </ul>
      <UiPagination class="mt-8" :page="page" :page-count="pageCount" />
      <p class="mt-6 text-2xs text-text-secondary">{{ $t('news.sampleNote') }}</p>
    </template>
  </main>
</template>
