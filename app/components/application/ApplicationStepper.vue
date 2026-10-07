<script setup lang="ts">
/** Progress through the application: the first steps as markers plus the full route as text. */
const props = defineProps<{
  /** Index of the current step in APPLICATION_STEPS */
  current: number
}>()

const VISIBLE_STEPS = 3

type StepState = 'done' | 'current' | 'upcoming'

const steps = computed(() =>
  APPLICATION_STEPS.slice(0, VISIBLE_STEPS).map((key, index) => {
    const state: StepState =
      index < props.current ? 'done' : index === props.current ? 'current' : 'upcoming'
    return { key, index, state }
  }),
)

const MARKER_CLASSES: Record<StepState, string> = {
  done: 'border-success bg-success-soft text-success',
  current: 'border-text bg-text text-on-primary',
  upcoming: 'border-border-strong bg-surface text-text-secondary',
}
</script>

<template>
  <div>
    <ol class="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <li
        v-for="step in steps"
        :key="step.key"
        class="flex items-center gap-3 sm:flex-1"
        :aria-current="step.state === 'current' ? 'step' : undefined"
      >
        <span
          class="flex size-7 shrink-0 items-center justify-center rounded-full border text-compact font-semibold tabular-nums"
          :class="MARKER_CLASSES[step.state]"
          aria-hidden="true"
        >
          <Icon v-if="step.state === 'done'" name="lucide:check" size="14" />
          <template v-else>{{ step.index + 1 }}</template>
        </span>
        <span class="flex min-w-0 flex-col">
          <span
            class="text-compact font-semibold"
            :class="step.state === 'upcoming' ? 'text-text-secondary' : 'text-text'"
          >
            {{ $t(`application.steps.${step.key}`) }}
          </span>
          <span class="text-2xs text-text-secondary">
            {{ $t(`application.stepState.${step.state}`) }}
          </span>
        </span>
        <span
          v-if="step.index < steps.length - 1"
          class="hidden h-px min-w-6 flex-1 bg-border sm:block"
          aria-hidden="true"
        />
      </li>
    </ol>
    <p class="mt-3 text-2xs text-text-secondary">
      <span class="tabular-nums">{{ current + 1 }} / {{ APPLICATION_STEPS.length }}</span>
      ·
      {{ APPLICATION_STEPS.map((key) => $t(`application.steps.${key}`)).join(' → ') }}
    </p>
  </div>
</template>
