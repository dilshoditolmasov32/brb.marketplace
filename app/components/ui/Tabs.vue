<script setup lang="ts" generic="T extends string | number">
export interface TabItem<V> {
  label: string
  value: V
  disabled?: boolean
}

const props = defineProps<{
  tabs: TabItem<T>[]
  /** Accessible name of the tab list */
  label: string
}>()

const model = defineModel<T>({ required: true })

const buttons = useTemplateRef<HTMLButtonElement[]>('buttons')

// Roving focus: arrow keys move between enabled tabs and activate them
function onKeydown(event: KeyboardEvent, index: number) {
  const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0
  if (!step) return
  event.preventDefault()
  const count = props.tabs.length
  for (let i = 1; i <= count; i++) {
    const next = (index + step * i + count) % count
    const tab = props.tabs[next]
    if (tab && !tab.disabled) {
      model.value = tab.value
      buttons.value?.[next]?.focus()
      return
    }
  }
}
</script>

<template>
  <div role="tablist" :aria-label="label" class="flex overflow-x-auto">
    <button
      v-for="(tab, index) in tabs"
      :key="tab.value"
      ref="buttons"
      type="button"
      role="tab"
      :aria-selected="tab.value === model"
      :tabindex="tab.value === model ? 0 : -1"
      :disabled="tab.disabled"
      class="h-11 min-w-fit flex-1 border-b bg-surface px-4 text-sm whitespace-nowrap transition-colors focus-visible:-outline-offset-2 disabled:cursor-not-allowed disabled:text-text-disabled"
      :class="
        tab.value === model
          ? 'border-b-2 border-text font-semibold text-text'
          : 'border-border text-text-secondary hover:text-text'
      "
      @click="model = tab.value"
      @keydown="onKeydown($event, index)"
    >
      {{ tab.label }}
    </button>
  </div>
</template>
