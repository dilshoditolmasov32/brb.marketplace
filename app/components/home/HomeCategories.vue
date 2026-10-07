<script setup lang="ts">
defineProps<{ categories: { slug: string; name: string }[] }>()

const localePath = useLocalePath()

const MOBILE_LIMIT = 8
const DESKTOP_LIMIT = 16
</script>

<template>
  <section v-if="categories.length" class="bg-surface py-8 md:py-10">
    <div class="container-page">
      <div class="flex items-center justify-between gap-4">
        <h2 class="text-xl font-semibold text-text">{{ $t('home.categories.title') }}</h2>
        <NuxtLink
          :to="localePath(ROUTES.catalog)"
          class="flex min-h-11 items-center gap-1.5 text-sm font-semibold text-primary-hover"
        >
          {{ $t('common.viewAll') }}
          <Icon name="lucide:arrow-right" size="16" class="shrink-0" />
        </NuxtLink>
      </div>
      <ul
        class="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
      >
        <li
          v-for="(category, index) in categories.slice(0, DESKTOP_LIMIT)"
          :key="category.slug"
          :class="index >= MOBILE_LIMIT && 'hidden md:block'"
        >
          <NuxtLink
            :to="localePath(ROUTES.category(category.slug))"
            class="flex h-full min-h-24 flex-col items-center justify-center gap-2 rounded-lg border border-border bg-background p-3 text-center text-compact font-medium text-text hover:border-border-strong"
          >
            <Icon :name="categoryIcon(category.slug)" size="22" class="text-primary" />
            {{ category.name }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
