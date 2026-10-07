<script setup lang="ts">
type FeedbackType = 'loading' | 'empty' | 'error'

const props = defineProps<{
  type: FeedbackType
  title: string
  description?: string
}>()

const ICONS: Record<FeedbackType, string> = {
  loading: 'lucide:loader-circle',
  empty: 'lucide:inbox',
  error: 'lucide:circle-alert',
}
</script>

<template>
  <div
    class="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface p-6 text-center"
    :role="props.type === 'error' ? 'alert' : 'status'"
    :aria-busy="props.type === 'loading' || undefined"
  >
    <Icon
      :name="ICONS[props.type]"
      size="24"
      :class="[
        props.type === 'error' ? 'text-error' : 'text-text-secondary',
        props.type === 'loading' && 'animate-spin',
      ]"
    />
    <p class="text-lg font-semibold text-text">{{ title }}</p>
    <p v-if="description" class="text-compact text-text-secondary">{{ description }}</p>
    <slot name="action" />
  </div>
</template>
