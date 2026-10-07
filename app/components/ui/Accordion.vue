<script setup lang="ts">
defineProps<{
  title: string
  disabled?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const id = useId()
</script>

<template>
  <div class="rounded-sm border border-border bg-surface">
    <h3>
      <button
        :id="`${id}-trigger`"
        type="button"
        class="flex min-h-11 w-full items-center justify-between gap-4 px-4 py-4 text-left text-sm font-semibold focus-visible:-outline-offset-2 disabled:cursor-not-allowed"
        :class="disabled ? 'text-text-disabled' : 'text-text'"
        :aria-expanded="open"
        :aria-controls="`${id}-panel`"
        :disabled="disabled"
        @click="open = !open"
      >
        <span class="min-w-0">{{ title }}</span>
        <Icon :name="open ? 'lucide:minus' : 'lucide:plus'" size="20" class="shrink-0" />
      </button>
    </h3>
    <div
      v-show="open"
      :id="`${id}-panel`"
      role="region"
      :aria-labelledby="`${id}-trigger`"
      class="px-4 pb-4 text-sm text-text-secondary"
    >
      <slot />
    </div>
  </div>
</template>
