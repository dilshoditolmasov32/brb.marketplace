<script setup lang="ts">
defineProps<{
  label?: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label
    class="flex min-h-11 items-center gap-3 rounded-sm px-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-focus"
    :class="disabled ? 'cursor-not-allowed text-text-disabled' : 'cursor-pointer text-text'"
  >
    <input v-model="model" type="checkbox" class="sr-only" :disabled="disabled" />
    <span
      class="flex size-5 shrink-0 items-center justify-center rounded-sm border-2 text-on-primary transition-colors"
      :class="
        disabled
          ? model
            ? 'border-text-disabled bg-text-disabled'
            : 'border-border bg-surface-disabled'
          : model
            ? 'border-text bg-text'
            : 'border-text bg-surface'
      "
      aria-hidden="true"
    >
      <Icon v-if="model" name="lucide:check" size="14" />
    </span>
    <span class="min-w-0">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
