<script setup lang="ts">
/** Floating button that returns to the top of the page; appears after some scrolling. */
const SHOW_AFTER_PX = 600

const { y } = useWindowScroll()
const isVisible = computed(() => y.value > SHOW_AFTER_PX)

const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })
</script>

<template>
  <Transition
    enter-active-class="transition duration-200"
    leave-active-class="transition duration-200"
    enter-from-class="translate-y-2 opacity-0"
    leave-to-class="translate-y-2 opacity-0"
  >
    <button
      v-if="isVisible"
      type="button"
      class="fixed right-4 bottom-[calc(4.5rem+env(safe-area-inset-bottom))] z-20 flex size-11 items-center justify-center rounded-full bg-primary text-on-primary shadow-overlay hover:bg-primary-hover md:right-6 md:bottom-6 md:size-12"
      :aria-label="$t('common.backToTop')"
      :title="$t('common.backToTop')"
      @click="scrollToTop"
    >
      <Icon name="lucide:arrow-up" size="20" />
    </button>
  </Transition>
</template>
