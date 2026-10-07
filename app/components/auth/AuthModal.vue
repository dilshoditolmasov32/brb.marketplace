<script setup lang="ts">
import type { AuthModalMode } from '~/composables/useAuthModal'

/** Sign-in and registration in one dialog; the forms switch in place. */
const { mode, close } = useAuthModal()
const route = useRoute()

const isOpen = computed({
  get: () => mode.value !== null,
  set: (value) => !value && close(),
})

// The last mode stays on screen while the dialog fades out
const shown = ref<AuthModalMode>('login')
// Bumped on every opening so the forms start empty
const session = ref(0)

watch(mode, (value, previous) => {
  if (!value) return
  shown.value = value
  if (!previous) session.value++
})

watch(() => route.fullPath, close)
</script>

<template>
  <UiModal v-model="isOpen" :title="$t(`auth.${shown}.title`)">
    <p class="mb-5">{{ $t(`auth.${shown}.subtitle`) }}</p>
    <AuthLoginForm v-if="shown === 'login'" :key="`login-${session}`" @switch="mode = 'register'" />
    <AuthRegisterForm v-else :key="`register-${session}`" @switch="mode = 'login'" />
  </UiModal>
</template>
