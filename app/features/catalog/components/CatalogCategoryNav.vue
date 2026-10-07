<script setup lang="ts">
defineProps<{
  categories: { slug: string; name: string }[]
  /** Slug of the open category; undefined on the "all products" page */
  active?: string
}>()

const localePath = useLocalePath()

const LINK_CLASSES = 'flex min-h-11 items-center rounded-sm px-3 text-sm'
const stateClasses = (isActive: boolean) =>
  isActive ? 'bg-primary-soft font-semibold text-primary-hover' : 'text-text hover:bg-surface-muted'
</script>

<template>
  <nav :aria-label="$t('catalog.categories')">
    <ul class="flex flex-col">
      <li>
        <NuxtLink
          :to="localePath(ROUTES.catalog)"
          :class="[LINK_CLASSES, stateClasses(!active)]"
          :aria-current="!active ? 'page' : undefined"
        >
          {{ $t('catalog.all') }}
        </NuxtLink>
      </li>
      <li v-for="category in categories" :key="category.slug">
        <NuxtLink
          :to="localePath(ROUTES.category(category.slug))"
          :class="[LINK_CLASSES, stateClasses(category.slug === active)]"
          :aria-current="category.slug === active ? 'page' : undefined"
        >
          {{ category.name }}
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
