<script setup lang="ts" generic="T extends string | number">
const props = defineProps<{
  value: T
  name: string
  label?: string
  disabled?: boolean
}>()

const model = defineModel<T>()

const isChecked = computed(() => model.value === props.value)
</script>

<template>
  <label
    class="flex min-h-11 items-center gap-3 rounded-sm px-2 text-sm has-focus-visible:outline-2 has-focus-visible:outline-focus"
    :class="disabled ? 'cursor-not-allowed text-text-disabled' : 'cursor-pointer text-text'"
  >
    <input
      v-model="model"
      type="radio"
      class="sr-only"
      :name="name"
      :value="value"
      :disabled="disabled"
    />
    <span
      class="flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-surface transition-colors"
      :class="disabled ? 'border-text-disabled' : 'border-text'"
      aria-hidden="true"
    >
      <span
        v-if="isChecked"
        class="size-2.5 rounded-full"
        :class="disabled ? 'bg-text-disabled' : 'bg-text'"
      />
    </span>
    <span class="min-w-0">
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>
