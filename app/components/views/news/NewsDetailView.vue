<script setup lang="ts">
import type { FetchError } from 'ofetch'

const route = useRoute()
const localePath = useLocalePath()
const format = useFormat()
const api = useApi()

const RELATED_LIMIT = 3
const COVER_WIDTH = 1200
const COVER_HEIGHT = 520
const DESCRIPTION_MAX_LENGTH = 160

const id = computed(() => String(route.params.id))

const { data: post, error } = await useAsyncData(
  () => `news-item-${id.value}`,
  () => api.posts.retrieve(id.value),
)

if (error.value || !post.value) {
  const status = (error.value as FetchError | null)?.statusCode
  throw createError({
    statusCode: status === 404 || !error.value ? 404 : 503,
    statusMessage: status === 404 ? 'Post not found' : 'Post unavailable',
    fatal: true,
  })
}

// Secondary block: the page stays usable if it fails
const { data: related } = await useAsyncData(
  () => `news-item-${id.value}-related`,
  async () => {
    const response = await api.posts.list({ limit: RELATED_LIMIT + 1 })
    return response.posts.filter((item) => item.id !== post.value?.id).slice(0, RELATED_LIMIT)
  },
  { default: () => [] },
)

const cover = computed(() =>
  post.value ? newsCoverUrl(post.value.id, COVER_WIDTH, COVER_HEIGHT) : undefined,
)

const seoTitle = computed(() => post.value?.title ?? '')
const seoDescription = computed(() => (post.value?.body ?? '').slice(0, DESCRIPTION_MAX_LENGTH))

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogImage: cover,
  ogType: 'article',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <main v-if="post" class="container-page py-6 md:py-8">
    <AppBreadcrumbs
      :items="[{ label: $t('news.title'), to: ROUTES.news }, { label: post.title }]"
    />

    <article class="mt-6 overflow-hidden rounded-lg border border-border bg-surface">
      <!-- Plain img: the placeholder host is not on the Nuxt Image allow-list -->
      <img
        :src="cover"
        alt=""
        :width="COVER_WIDTH"
        :height="COVER_HEIGHT"
        decoding="async"
        class="aspect-video max-h-96 w-full bg-surface-muted object-cover"
      />
      <div class="mx-auto flex max-w-3xl flex-col gap-4 p-4 md:p-8">
        <ul v-if="post.tags.length" class="flex flex-wrap gap-1.5">
          <li v-for="tag in post.tags" :key="tag">
            <UiBadge tone="brand" class="capitalize">{{ tag }}</UiBadge>
          </li>
        </ul>
        <h1 class="text-2xl font-semibold text-text md:text-3xl">{{ post.title }}</h1>
        <ul class="flex flex-wrap gap-x-4 gap-y-1 text-compact text-text-secondary">
          <li class="flex items-center gap-1.5">
            <Icon name="lucide:eye" size="16" />
            {{ $t('news.views', { count: format.number(post.views) }) }}
          </li>
          <li class="flex items-center gap-1.5">
            <Icon name="lucide:thumbs-up" size="16" />
            {{ $t('news.likes', { count: format.number(post.reactions.likes) }) }}
          </li>
        </ul>
        <p class="text-base whitespace-pre-line text-text">{{ post.body }}</p>
        <p class="border-t border-border pt-4 text-2xs text-text-secondary">
          {{ $t('news.sampleNote') }}
        </p>
        <div>
          <UiButton variant="outline" :to="localePath(ROUTES.news)">
            <Icon name="lucide:arrow-left" size="16" class="shrink-0" />
            {{ $t('news.back') }}
          </UiButton>
        </div>
      </div>
    </article>

    <section v-if="related.length" class="mt-10">
      <h2 class="text-xl font-semibold text-text">{{ $t('news.related') }}</h2>
      <ul class="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li v-for="item in related" :key="item.id">
          <NewsCard :post="item" />
        </li>
      </ul>
    </section>
  </main>
</template>
