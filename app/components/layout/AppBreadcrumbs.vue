<script setup lang="ts">
export interface BreadcrumbItem {
  label: string
  /** Omitted for the current page */
  to?: string
}

const props = defineProps<{ items: BreadcrumbItem[] }>()

const { t } = useI18n()
const localePath = useLocalePath()
const requestUrl = useRequestURL()

const trail = computed<BreadcrumbItem[]>(() => [
  { label: t('breadcrumbs.home'), to: ROUTES.home },
  ...props.items,
])

// Structured data so search engines can show the trail
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: trail.value.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.label,
            ...(item.to ? { item: new URL(localePath(item.to), requestUrl.origin).href } : {}),
          })),
        }),
    },
  ],
})
</script>

<template>
  <nav :aria-label="$t('breadcrumbs.label')">
    <ol class="flex flex-wrap items-center gap-x-1.5 text-compact text-text-secondary">
      <li v-for="(item, index) in trail" :key="index" class="flex items-center gap-1.5">
        <span v-if="index > 0" aria-hidden="true">/</span>
        <NuxtLink v-if="item.to" :to="localePath(item.to)" class="hover:text-text">
          {{ item.label }}
        </NuxtLink>
        <span v-else class="text-text" aria-current="page">{{ item.label }}</span>
      </li>
    </ol>
  </nav>
</template>
