<script setup lang="ts">
/** Bordered content block used across the cabinet pages */
defineProps<{ title?: string }>()
</script>

<template>
  <section class="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4 md:p-5">
    <h2 v-if="title" class="text-base font-semibold text-text">{{ title }}</h2>
    <slot />
  </section>
</template>
