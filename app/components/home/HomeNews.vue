<script setup lang="ts">
import type { components } from '~/api/apiMethods.types'

defineProps<{ posts: components['schemas']['Post'][] }>()

const localePath = useLocalePath()

// The mock posts API has no pictures: a stock photo stands in until the backend sends covers
const coverOf = (postId: number) => `https://picsum.photos/seed/brb-news-${postId}/640/360`
</script>

<template>
  <section v-if="posts.length" class="bg-surface py-10 md:py-14">
    <div class="container-page">
      <div class="flex items-center justify-between gap-4">
        <div>
          <h2 class="text-xl font-semibold text-text">{{ $t('home.news.title') }}</h2>
          <p class="text-compact text-text-secondary">{{ $t('home.news.subtitle') }}</p>
        </div>
        <UiButton variant="ghost" class="min-w-0 shrink-0" :to="localePath(ROUTES.news)">
          {{ $t('common.viewAll') }}
          <Icon name="lucide:arrow-right" size="16" class="shrink-0" />
        </UiButton>
      </div>
      <ul class="mt-6 grid gap-4 md:grid-cols-3">
        <li v-for="post in posts" :key="post.id">
          <article
            class="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-primary hover:shadow-overlay"
          >
            <!-- Plain img: the placeholder host is not on the Nuxt Image allow-list -->
            <div class="overflow-hidden bg-surface-muted">
              <img
                :src="coverOf(post.id)"
                alt=""
                width="640"
                height="360"
                loading="lazy"
                decoding="async"
                class="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div class="flex flex-1 flex-col items-start gap-2 p-4">
              <UiBadge v-if="post.tags[0]" tone="brand" class="capitalize">{{
                post.tags[0]
              }}</UiBadge>
              <h3 class="text-sm font-semibold text-text">
                <NuxtLink
                  :to="localePath(ROUTES.newsItem(post.id))"
                  class="after:absolute after:inset-0"
                >
                  {{ post.title }}
                </NuxtLink>
              </h3>
              <p class="line-clamp-2 text-xs text-text-secondary">{{ post.body }}</p>
            </div>
          </article>
        </li>
      </ul>
    </div>
  </section>
</template>
