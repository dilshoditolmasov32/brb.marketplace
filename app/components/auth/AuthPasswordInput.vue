<script setup lang="ts">
/** Password field with a show/hide toggle */
defineProps<{
  label: string
  hint?: string
  error?: string
  autocomplete: 'current-password' | 'new-password'
}>()

const model = defineModel<string>({ required: true })

const isVisible = ref(false)
</script>

<template>
  <UiInput
    v-model="model"
    :type="isVisible ? 'text' : 'password'"
    :label="label"
    :hint="hint"
    :error="error"
    :autocomplete="autocomplete"
    required
  >
    <template #suffix>
      <button
        type="button"
        class="flex size-8 shrink-0 items-center justify-center text-text-secondary hover:text-text"
        :aria-label="$t(isVisible ? 'auth.hidePassword' : 'auth.showPassword')"
        :aria-pressed="isVisible"
        @click="isVisible = !isVisible"
      >
        <Icon :name="isVisible ? 'lucide:eye-off' : 'lucide:eye'" size="18" />
      </button>
    </template>
  </UiInput>
</template>
