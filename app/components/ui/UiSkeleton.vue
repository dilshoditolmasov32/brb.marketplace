<script setup lang="ts">
/**
 * Loading placeholder. 'block' is a single bar sized by the caller's classes;
 * 'card' and 'list' are the ready-made compositions from the design system.
 */
withDefaults(defineProps<{ variant?: 'block' | 'card' | 'list' }>(), { variant: 'block' })
</script>

<template>
  <span
    v-if="variant === 'block'"
    class="block animate-pulse rounded-sm bg-surface-muted"
    aria-hidden="true"
  />
  <div
    v-else
    class="flex flex-col gap-4 rounded-lg border border-border bg-surface p-6"
    aria-hidden="true"
  >
    <span class="block h-4 w-28 animate-pulse rounded-sm bg-surface-muted" />
    <span
      class="block animate-pulse rounded-sm bg-surface-muted"
      :class="variant === 'card' ? 'h-9 w-44 max-w-full' : 'h-4 w-64 max-w-full'"
    />
    <span class="block h-4 w-full animate-pulse rounded-sm bg-surface-muted" />
    <span class="block h-4 w-40 animate-pulse rounded-sm bg-surface-muted" />
  </div>
</template>
