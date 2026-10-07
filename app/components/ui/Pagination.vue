<script setup lang="ts">
/**
 * Link-based pagination: every page is a real URL (?page=N), so it works without
 * JavaScript and can be crawled. Other query parameters are preserved.
 */
const props = defineProps<{
  page: number
  pageCount: number
}>()

const route = useRoute()

const SIBLINGS = 1

/** 1 … 4 5 6 … 20 — `null` marks a gap */
const items = computed<(number | null)[]>(() => {
  const { page, pageCount } = props
  const pages = new Set([1, pageCount])
  for (let p = page - SIBLINGS; p <= page + SIBLINGS; p++) {
    if (p >= 1 && p <= pageCount) pages.add(p)
  }
  const sorted = [...pages].sort((a, b) => a - b)
  return sorted.flatMap((p, index) => {
    const previous = sorted[index - 1]
    return previous !== undefined && p - previous > 1 ? [null, p] : [p]
  })
})

function linkTo(page: number) {
  return { query: { ...route.query, page: page > 1 ? page : undefined } }
}

const ITEM_CLASSES =
  'flex h-9 min-w-9 items-center justify-center gap-1 rounded-sm border px-3 text-sm transition-colors'
</script>

<template>
  <nav v-if="pageCount > 1" :aria-label="$t('pagination.label')">
    <ul class="flex flex-wrap items-center justify-center gap-1">
      <li>
        <NuxtLink
          v-if="page > 1"
          :to="linkTo(page - 1)"
          rel="prev"
          :class="[ITEM_CLASSES, 'border-border bg-surface text-text-secondary hover:text-text']"
        >
          <Icon name="lucide:arrow-left" size="14" />
          {{ $t('pagination.previous') }}
        </NuxtLink>
      </li>
      <li v-for="(item, index) in items" :key="item ?? `gap-${index}`">
        <span v-if="item === null" :class="[ITEM_CLASSES, 'border-border text-text-secondary']">
          …
        </span>
        <NuxtLink
          v-else
          :to="linkTo(item)"
          :aria-current="item === page ? 'page' : undefined"
          :aria-label="$t('pagination.page', { page: item })"
          :class="[
            ITEM_CLASSES,
            item === page
              ? 'border-primary bg-primary font-semibold text-on-primary'
              : 'border-border bg-surface text-text-secondary hover:text-text',
          ]"
        >
          {{ item }}
        </NuxtLink>
      </li>
      <li>
        <NuxtLink
          v-if="page < pageCount"
          :to="linkTo(page + 1)"
          rel="next"
          :class="[ITEM_CLASSES, 'border-border bg-surface text-text-secondary hover:text-text']"
        >
          {{ $t('pagination.next') }}
          <Icon name="lucide:arrow-right" size="14" />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
