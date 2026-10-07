<script setup lang="ts">
/**
 * Catalog panel that drops down from the header.
 * Must be rendered inside a positioned header that sets --header-height, so the panel
 * fills the rest of the screen; the opener keeps aria-expanded/controls.
 */
defineProps<{
  id: string
  categories: { slug: string; name: string }[]
}>()

const open = defineModel<boolean>({ required: true })

const localePath = useLocalePath()

onKeyStroke('Escape', () => {
  if (open.value) open.value = false
})

// The page behind the panel must not scroll while it is open
const isLocked = useScrollLock(import.meta.client ? document.body : null)
watch(open, (value) => (isLocked.value = value))
onBeforeUnmount(() => (isLocked.value = false))
</script>

<template>
  <div v-show="open">
    <div
      class="absolute inset-x-0 top-full h-dvh bg-scrim"
      aria-hidden="true"
      @click="open = false"
    />
    <div
      :id="id"
      class="absolute inset-x-0 top-full z-10 h-[calc(100dvh-var(--header-height,0px))] overflow-y-auto overscroll-contain border-t border-border bg-surface shadow-overlay"
    >
      <nav :aria-label="$t('header.catalog')" class="container-page py-6">
        <div class="flex items-center justify-between gap-4">
          <h2 class="text-lg font-semibold text-text">{{ $t('header.catalog') }}</h2>
          <NuxtLink
            :to="localePath(ROUTES.catalog)"
            class="flex min-h-11 items-center gap-1 text-sm font-semibold text-primary-hover"
          >
            {{ $t('catalog.all') }}
            <Icon name="lucide:arrow-right" size="16" />
          </NuxtLink>
        </div>
        <ul class="mt-2 grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <li v-for="category in categories" :key="category.slug">
            <NuxtLink
              :to="localePath(ROUTES.category(category.slug))"
              class="flex min-h-11 items-center gap-3 rounded-sm px-2 text-sm text-text hover:bg-surface-muted"
            >
              <Icon :name="categoryIcon(category.slug)" size="20" class="shrink-0 text-primary" />
              {{ category.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>
