<script setup lang="ts">
type AlertTone = 'neutral' | 'success' | 'warning' | 'error'

const props = withDefaults(
  defineProps<{
    tone?: AlertTone
    title?: string
    dismissible?: boolean
  }>(),
  { tone: 'neutral', title: undefined },
)

const emit = defineEmits<{ dismiss: [] }>()

const TONES: Record<AlertTone, { surface: string; accent: string; body: string; icon: string }> = {
  neutral: {
    surface: 'bg-surface-muted',
    accent: 'text-text',
    body: 'text-text-secondary',
    icon: 'lucide:info',
  },
  success: {
    surface: 'bg-success-soft',
    accent: 'text-success',
    body: 'text-success',
    icon: 'lucide:circle-check',
  },
  warning: {
    surface: 'bg-warning-soft',
    accent: 'text-warning',
    body: 'text-warning',
    icon: 'lucide:circle-alert',
  },
  error: {
    surface: 'bg-error-soft',
    accent: 'text-error',
    body: 'text-error',
    icon: 'lucide:circle-alert',
  },
}

const visible = ref(true)

function dismiss() {
  visible.value = false
  emit('dismiss')
}

const tone = computed(() => TONES[props.tone])
</script>

<template>
  <div
    v-if="visible"
    class="flex items-start gap-3 rounded-sm p-4"
    :class="[tone.surface, tone.accent]"
    :role="props.tone === 'error' ? 'alert' : 'status'"
  >
    <Icon :name="tone.icon" size="20" class="shrink-0" />
    <div class="flex min-w-0 flex-1 flex-col gap-1">
      <p v-if="title" class="text-sm font-semibold">{{ title }}</p>
      <div class="text-compact" :class="tone.body"><slot /></div>
    </div>
    <button
      v-if="dismissible"
      type="button"
      class="-m-3 flex size-11 shrink-0 items-center justify-center"
      :aria-label="$t('common.close')"
      @click="dismiss"
    >
      <Icon name="lucide:x" size="20" />
    </button>
  </div>
</template>
