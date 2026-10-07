<script setup lang="ts">
type BadgeTone = 'neutral' | 'brand' | 'success' | 'warning' | 'error'

withDefaults(defineProps<{ tone?: BadgeTone }>(), { tone: 'neutral' })

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral: 'bg-surface-muted text-text-secondary',
  brand: 'bg-primary-soft text-primary-hover',
  success: 'bg-success-soft text-success',
  warning: 'bg-warning-soft text-warning',
  error: 'bg-error-soft text-error',
}
</script>

<template>
  <span
    class="inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-semibold whitespace-nowrap"
    :class="TONE_CLASSES[tone]"
  >
    <slot />
  </span>
</template>
