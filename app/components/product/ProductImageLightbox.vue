<script setup lang="ts">
/** Full-screen image viewer for the product gallery. Arrows, swipe and Escape are supported. */
const props = defineProps<{
  images: string[]
  /** Product name, used for the image descriptions */
  title: string
}>()

const open = defineModel<boolean>('open', { required: true })
const index = defineModel<number>('index', { required: true })

const hasMany = computed(() => props.images.length > 1)

// The arrows wrap around: after the last image comes the first one
function step(delta: number) {
  const count = props.images.length
  index.value = (index.value + delta + count) % count
}

const close = () => (open.value = false)

onKeyStroke('Escape', () => open.value && close())
onKeyStroke('ArrowLeft', () => open.value && hasMany.value && step(-1))
onKeyStroke('ArrowRight', () => open.value && hasMany.value && step(1))

const stage = ref<HTMLElement>()
useSwipe(stage, {
  onSwipeEnd(_event, direction) {
    if (!hasMany.value) return
    if (direction === 'left') step(1)
    if (direction === 'right') step(-1)
  },
})

// The page behind the viewer must not scroll while it is open
const isLocked = useScrollLock(import.meta.client ? document.body : null)
const closeButton = ref<HTMLElement>()
watch(open, async (value) => {
  isLocked.value = value
  if (!value) return
  await nextTick()
  closeButton.value?.focus()
})
onBeforeUnmount(() => (isLocked.value = false))

const NAV_BUTTON =
  'absolute top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-overlay hover:bg-surface-muted'
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open"
      class="fixed inset-0 z-50 flex flex-col bg-surface"
      role="dialog"
      aria-modal="true"
      :aria-label="title"
    >
      <div class="flex h-14 shrink-0 items-center justify-between gap-4 px-4">
        <p class="min-w-0 truncate text-sm font-semibold text-text">{{ title }}</p>
        <div class="flex shrink-0 items-center gap-3">
          <p v-if="hasMany" class="text-compact text-text-secondary tabular-nums">
            {{ index + 1 }} / {{ images.length }}
          </p>
          <button
            ref="closeButton"
            type="button"
            class="flex size-11 items-center justify-center rounded-full text-text hover:bg-surface-muted"
            :aria-label="$t('common.close')"
            @click="close"
          >
            <Icon name="lucide:x" size="22" />
          </button>
        </div>
      </div>

      <div ref="stage" class="relative min-h-0 flex-1 touch-pan-y px-4">
        <!-- Plain img: the viewer shows the original file at its full resolution -->
        <img
          :key="images[index]"
          :src="images[index]"
          :alt="title"
          draggable="false"
          class="size-full object-contain select-none"
        />
        <template v-if="hasMany">
          <button
            type="button"
            :class="[NAV_BUTTON, 'left-3 md:left-6']"
            :aria-label="$t('productPage.prevImage')"
            @click="step(-1)"
          >
            <Icon name="lucide:chevron-left" size="22" />
          </button>
          <button
            type="button"
            :class="[NAV_BUTTON, 'right-3 md:right-6']"
            :aria-label="$t('productPage.nextImage')"
            @click="step(1)"
          >
            <Icon name="lucide:chevron-right" size="22" />
          </button>
        </template>
      </div>

      <ul v-if="hasMany" class="flex shrink-0 justify-center gap-2 overflow-x-auto p-4">
        <li v-for="(image, i) in images" :key="image" class="w-16 shrink-0">
          <button
            type="button"
            class="block w-full overflow-hidden rounded-lg border bg-surface hover:border-primary"
            :class="i === index ? 'border-primary' : 'border-border'"
            :aria-label="$t('productPage.showImage', { number: i + 1 })"
            :aria-pressed="i === index"
            @click="index = i"
          >
            <NuxtImg
              :src="image"
              alt=""
              width="160"
              height="160"
              loading="lazy"
              class="aspect-square w-full object-contain"
            />
          </button>
        </li>
      </ul>
    </div>
  </Teleport>
</template>
