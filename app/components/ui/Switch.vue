<script setup lang="ts">
withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
    /** 'end' puts the label after the switch; 'start' spreads label and switch apart */
    labelPosition?: 'start' | 'end'
  }>(),
  { label: undefined, labelPosition: 'end' },
)

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label
    class="flex min-h-11 items-center gap-3 rounded-sm px-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-focus"
    :class="[
      disabled ? 'cursor-not-allowed text-text-disabled' : 'cursor-pointer text-text',
      labelPosition === 'start' && 'flex-row-reverse justify-between',
    ]"
  >
    <input v-model="model" type="checkbox" role="switch" class="sr-only" :disabled="disabled" />
    <span
      class="flex h-6 w-10 shrink-0 items-center rounded-full p-0.75 transition-colors"
      :class="disabled ? 'bg-surface-disabled' : model ? 'bg-text' : 'bg-border-strong'"
      aria-hidden="true"
    >
      <span
        class="size-4.5 rounded-full bg-surface transition-transform"
        :class="model && 'translate-x-4'"
      />
    </span>
    <span class="min-w-0">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
