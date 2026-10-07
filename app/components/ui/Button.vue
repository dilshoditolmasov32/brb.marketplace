<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    type?: 'button' | 'submit' | 'reset'
    /** Renders a NuxtLink instead of a button */
    to?: RouteLocationRaw
    block?: boolean
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'md',
    type: 'button',
    to: undefined,
  },
)

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'border-primary bg-primary text-on-primary hover:border-primary-hover hover:bg-primary-hover',
  secondary: 'border-surface-muted bg-surface-muted text-text hover:border-border hover:bg-border',
  outline: 'border-border-strong bg-surface text-text hover:bg-surface-muted',
  ghost: 'border-transparent bg-transparent text-text hover:bg-surface-muted',
}

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: 'h-9 min-w-32 px-3 text-compact',
  md: 'h-11 min-w-40 px-4 text-sm',
  lg: 'h-13 min-w-44 px-6 text-base',
}

const isInactive = computed(() => props.disabled || props.loading)

const classes = computed(() => [
  'inline-flex items-center justify-center gap-2 rounded-sm border font-semibold whitespace-nowrap transition-colors',
  SIZE_CLASSES[props.size],
  props.disabled
    ? 'cursor-not-allowed border-surface-disabled bg-surface-disabled text-text-disabled'
    : VARIANT_CLASSES[props.variant],
  props.loading && 'cursor-progress',
  props.block && 'w-full min-w-0',
])
</script>

<template>
  <NuxtLink v-if="to && !isInactive" :to="to" :class="classes">
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type"
    :class="classes"
    :disabled="disabled"
    :aria-disabled="loading || undefined"
    :aria-busy="loading || undefined"
    @click="loading && $event.preventDefault()"
  >
    <span
      v-if="loading"
      class="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-r-transparent"
      aria-hidden="true"
    />
    <span class="min-w-0 truncate"><slot /></span>
  </button>
</template>
