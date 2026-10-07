<script setup lang="ts">
import type { components } from '~/api/apiMethods.types'

defineProps<{ post: components['schemas']['Post'] }>()

const localePath = useLocalePath()
</script>

<template>
  <article
    class="group relative flex h-full flex-col overflow-hidden rounded-lg border border-border bg-surface transition hover:border-primary hover:shadow-overlay"
  >
    <!-- Plain img: the placeholder host is not on the Nuxt Image allow-list -->
    <div class="overflow-hidden bg-surface-muted">
      <img
        :src="newsCoverUrl(post.id)"
        alt=""
        width="640"
        height="360"
        loading="lazy"
        decoding="async"
        class="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div class="flex flex-1 flex-col items-start gap-2 p-4">
      <UiBadge v-if="post.tags[0]" tone="brand" class="capitalize">{{ post.tags[0] }}</UiBadge>
      <h3 class="text-sm font-semibold text-text">
        <NuxtLink :to="localePath(ROUTES.newsItem(post.id))" class="after:absolute after:inset-0">
          {{ post.title }}
        </NuxtLink>
      </h3>
      <p class="line-clamp-2 text-xs text-text-secondary">{{ post.body }}</p>
    </div>
  </article>
</template>
