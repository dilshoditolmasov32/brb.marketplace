<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    /** Validation message; switches the field into its error state */
    error?: string
    rows?: number
    disabled?: boolean
    required?: boolean
  }>(),
  {
    label: undefined,
    hint: undefined,
    error: undefined,
    rows: 4,
  },
)

const model = defineModel<string>()

const id = useId()
const messageId = `${id}-message`
const message = computed(() => props.error || props.hint)
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      :for="id"
      class="text-sm font-medium"
      :class="disabled ? 'text-text-disabled' : 'text-text'"
    >
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <textarea
      :id="id"
      v-model="model"
      v-bind="$attrs"
      :rows="rows"
      :disabled="disabled"
      :required="required"
      :aria-invalid="error ? true : undefined"
      :aria-describedby="message ? messageId : undefined"
      class="min-h-24 resize-y rounded-sm border px-3 py-2.5 text-sm text-text transition-colors outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:text-text-disabled"
      :class="[
        disabled
          ? 'border-border bg-surface-disabled'
          : error
            ? 'border-error bg-surface'
            : 'border-border-strong bg-surface',
        !disabled && 'focus:border-focus focus:ring-1 focus:ring-focus focus:ring-inset',
      ]"
    />
    <p
      v-if="message"
      :id="messageId"
      class="text-xs"
      :class="error ? 'text-error' : 'text-text-secondary'"
      :role="error ? 'alert' : undefined"
    >
      {{ message }}
    </p>
  </div>
</template>
