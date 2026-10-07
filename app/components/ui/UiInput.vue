<script setup lang="ts">
defineOptions({ inheritAttrs: false })

const props = withDefaults(
  defineProps<{
    label?: string
    hint?: string
    /** Validation message; switches the field into its error state */
    error?: string
    type?: 'text' | 'number' | 'tel' | 'email' | 'search' | 'password'
    disabled?: boolean
    required?: boolean
  }>(),
  {
    label: undefined,
    hint: undefined,
    error: undefined,
    type: 'text',
  },
)

const model = defineModel<string | number>()

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
    <div
      class="flex h-11 items-center gap-2 rounded-sm border px-3 transition-colors"
      :class="[
        disabled
          ? 'border-border bg-surface-disabled'
          : error
            ? 'border-error bg-surface'
            : 'border-border-strong bg-surface',
        !disabled &&
          'focus-within:border-focus focus-within:ring-1 focus-within:ring-focus focus-within:ring-inset',
      ]"
    >
      <slot name="prefix" />
      <input
        :id="id"
        v-model="model"
        v-bind="$attrs"
        :type="type"
        :disabled="disabled"
        :required="required"
        :aria-invalid="error ? true : undefined"
        :aria-describedby="message ? messageId : undefined"
        class="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-secondary disabled:cursor-not-allowed disabled:text-text-disabled"
      />
      <slot name="suffix" />
      <Icon v-if="error" name="lucide:circle-alert" size="18" class="shrink-0 text-error" />
    </div>
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
