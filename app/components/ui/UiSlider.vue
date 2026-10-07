<script setup lang="ts">
const props = defineProps<{
  min: number
  max: number
  step?: number
  /** Accessible name */
  label: string
  /** Spoken value, e.g. "12 000 000 so‘m" */
  valueText?: string
  minLabel?: string
  maxLabel?: string
  disabled?: boolean
}>()

const model = defineModel<number>({ required: true })

const fill = computed(() => {
  const ratio = (model.value - props.min) / (props.max - props.min)
  return `${Math.min(1, Math.max(0, ratio)) * 100}%`
})
</script>

<template>
  <div class="flex flex-col gap-1">
    <input
      v-model.number="model"
      type="range"
      class="ui-slider"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
      :aria-label="label"
      :aria-valuetext="valueText"
      :style="{ '--ui-slider-fill': fill }"
    />
    <div v-if="minLabel || maxLabel" class="flex justify-between text-xs text-text-secondary">
      <span>{{ minLabel }}</span>
      <span>{{ maxLabel }}</span>
    </div>
  </div>
</template>

<style>
.ui-slider {
  width: 100%;
  height: 44px;
  margin: 0;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.ui-slider:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.ui-slider::-webkit-slider-runnable-track {
  height: 4px;
  border-radius: 999px;
  background: linear-gradient(
    to right,
    var(--text) var(--ui-slider-fill),
    var(--border) var(--ui-slider-fill)
  );
}

.ui-slider::-moz-range-track {
  height: 4px;
  border-radius: 999px;
  background: var(--border);
}

.ui-slider::-moz-range-progress {
  height: 4px;
  border-radius: 999px;
  background: var(--text);
}

.ui-slider::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  margin-top: -7px;
  appearance: none;
  border: 2px solid var(--text);
  border-radius: 999px;
  background: var(--surface);
}

.ui-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  border: 2px solid var(--text);
  border-radius: 999px;
  background: var(--surface);
}
</style>
