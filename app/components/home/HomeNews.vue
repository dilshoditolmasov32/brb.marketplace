<script setup lang="ts">
import type { components } from '~/api/apiMethods.types'

defineProps<{ posts: components['schemas']['Post'][] }>()

const localePath = useLocalePath()
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
          <NewsCard :post="post" />
        </li>
      </ul>
    </div>
  </section>
</template>
