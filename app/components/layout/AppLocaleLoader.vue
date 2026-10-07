<script setup lang="ts">
/** Full-screen loader shown while the site language is being switched. */
const { isSwitching } = useLocaleSwitch()
</script>

<template>
  <Transition
    enter-active-class="transition-opacity duration-150"
    leave-active-class="transition-opacity duration-200"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isSwitching"
      class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-surface"
      role="status"
      aria-live="polite"
    >
      <span
        class="size-10 animate-spin rounded-full border-4 border-primary border-r-transparent"
        aria-hidden="true"
      />
      <p class="text-sm font-medium text-text">{{ $t('header.languageSwitching') }}</p>
    </div>
  </Transition>
</template>
