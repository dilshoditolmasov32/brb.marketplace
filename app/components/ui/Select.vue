<script setup lang="ts" generic="T extends string | number">
import { Icon } from '#components'

export interface SelectOption<V> {
  label: string
  value: V
  disabled?: boolean
}

const props = defineProps<{
  options: SelectOption<T>[]
  label?: string
  hint?: string
  /** Validation message; switches the field into its error state */
  error?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}>()

const model = defineModel<T>()

const id = useId()
const messageId = `${id}-message`
const message = computed(() => props.error || props.hint)

const ChevronIcon = () => h(Icon, { name: 'brb:chevron-down', size: 18 })
</script>

<template>
  <div class="ui-select flex flex-col gap-2" :class="{ 'ui-select--error': error }">
    <label v-if="label" :for="id" class="text-sm font-medium text-text">
      {{ label }}
      <span v-if="required" aria-hidden="true">*</span>
    </label>
    <ElSelect
      :id="id"
      v-model="model"
      :placeholder="placeholder"
      :disabled="disabled"
      :suffix-icon="ChevronIcon"
      :aria-describedby="message ? messageId : undefined"
      :aria-invalid="error ? true : undefined"
      popper-class="ui-select__popper"
    >
      <ElOption
        v-for="option in options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        :disabled="option.disabled"
      >
        <span class="min-w-0 flex-1">{{ option.label }}</span>
        <Icon v-if="option.value === model" name="brb:check" size="16" class="shrink-0" />
      </ElOption>
    </ElSelect>
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

<style>
.ui-select .el-select__wrapper {
  min-height: var(--control-height-md);
  padding: 0 12px;
  gap: 8px;
  line-height: 1.25rem;
  box-shadow: 0 0 0 1px var(--border-strong) inset;
}

.ui-select .el-select__wrapper.is-focused {
  box-shadow: 0 0 0 2px var(--focus) inset;
}

.ui-select--error .el-select__wrapper:not(.is-focused) {
  box-shadow: 0 0 0 1px var(--error) inset;
}

.ui-select .el-select__wrapper.is-disabled {
  background-color: var(--surface-disabled);
  box-shadow: 0 0 0 1px var(--border) inset;
}

.ui-select__popper.el-popper {
  border: 1px solid var(--border);
  border-radius: var(--radius-control);
}

.ui-select__popper .el-select-dropdown__list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 4px;
}

.ui-select__popper .el-select-dropdown__item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  height: auto;
  padding: 10px;
  color: var(--text);
  font-weight: 400;
  line-height: 1.25rem;
  white-space: normal;
}

.ui-select__popper .el-select-dropdown__item.is-selected {
  background-color: var(--surface-muted);
}
</style>
