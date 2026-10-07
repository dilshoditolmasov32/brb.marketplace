<script setup lang="ts">
/**
 * Product image carousel: swipe or use the arrows to change the image,
 * hover with a mouse to zoom into the point under the cursor, click to view full screen.
 */
const props = defineProps<{
  images: string[]
  /** Product name, used for the image descriptions */
  title: string
}>()

const ZOOM_SCALE = 2

const track = ref<HTMLElement>()
const activeIndex = ref(0)
const hasMany = computed(() => props.images.length > 1)

function goTo(index: number, behavior: ScrollBehavior = 'smooth') {
  const el = track.value
  if (!el) return
  // The arrows wrap around: after the last image comes the first one
  const count = props.images.length
  const target = (index + count) % count
  el.scrollTo({ left: target * el.clientWidth, behavior })
}

// The track scrolls natively (swipe, trackpad), so the active image is read back from it
function syncActiveIndex() {
  const el = track.value
  if (!el || !el.clientWidth) return
  activeIndex.value = Math.round(el.scrollLeft / el.clientWidth)
}

// Zoom follows the mouse only; touch devices keep the plain swipe
const zoomOrigin = ref<string>()

function zoom(event: PointerEvent) {
  if (event.pointerType !== 'mouse') return
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width) * 100
  const y = ((event.clientY - rect.top) / rect.height) * 100
  zoomOrigin.value = `${x}% ${y}%`
}

const resetZoom = () => (zoomOrigin.value = undefined)

// Full-screen viewer; on closing, the carousel shows the image that was open there
const isFullscreen = ref(false)
const fullscreenIndex = ref(0)

function openFullscreen(index: number) {
  resetZoom()
  fullscreenIndex.value = index
  isFullscreen.value = true
}

watch(isFullscreen, (value) => {
  if (!value) goTo(fullscreenIndex.value, 'instant')
})

// A different product may reuse this component instance
watch(
  () => props.images,
  () => {
    resetZoom()
    activeIndex.value = 0
    goTo(0, 'instant')
  },
)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div
      class="relative overflow-hidden rounded-xl border border-border bg-surface"
      role="group"
      :aria-label="$t('productPage.gallery')"
    >
      <ul
        ref="track"
        class="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        tabindex="0"
        @scroll.passive="syncActiveIndex"
        @keydown.left.prevent="goTo(activeIndex - 1)"
        @keydown.right.prevent="goTo(activeIndex + 1)"
      >
        <li
          v-for="(image, index) in images"
          :key="image"
          class="w-full shrink-0 cursor-zoom-in snap-center overflow-hidden"
          :aria-hidden="index !== activeIndex"
          @pointermove="zoom"
          @pointerleave="resetZoom"
          @click="openFullscreen(index)"
        >
          <NuxtImg
            :src="image"
            :alt="title"
            width="800"
            height="800"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :fetchpriority="index === 0 ? 'high' : undefined"
            draggable="false"
            class="h-72 w-full object-contain transition-transform duration-200 select-none sm:h-96 lg:h-[27rem]"
            :style="
              zoomOrigin && index === activeIndex
                ? { transform: `scale(${ZOOM_SCALE})`, transformOrigin: zoomOrigin }
                : undefined
            "
          />
        </li>
      </ul>

      <button
        type="button"
        class="absolute top-3 right-3 flex size-10 items-center justify-center rounded-full border border-border bg-surface text-text shadow-overlay hover:bg-surface-muted"
        :aria-label="$t('productPage.fullscreen')"
        @click="openFullscreen(activeIndex)"
      >
        <Icon name="lucide:maximize-2" size="18" />
      </button>

      <template v-if="hasMany">
        <button
          type="button"
          class="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-overlay hover:bg-surface-muted"
          :aria-label="$t('productPage.prevImage')"
          @click="goTo(activeIndex - 1)"
        >
          <Icon name="lucide:chevron-left" size="20" />
        </button>
        <button
          type="button"
          class="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface text-text shadow-overlay hover:bg-surface-muted"
          :aria-label="$t('productPage.nextImage')"
          @click="goTo(activeIndex + 1)"
        >
          <Icon name="lucide:chevron-right" size="20" />
        </button>
        <p
          class="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-surface-inverse px-2.5 py-0.5 text-2xs font-semibold text-on-primary tabular-nums"
          aria-hidden="true"
        >
          {{ activeIndex + 1 }} / {{ images.length }}
        </p>
      </template>
    </div>

    <ul v-if="hasMany" class="flex gap-3 overflow-x-auto pb-1">
      <li v-for="(image, index) in images" :key="image" class="w-20 shrink-0 md:w-24">
        <button
          type="button"
          class="block w-full overflow-hidden rounded-lg border bg-surface transition-colors hover:border-primary"
          :class="index === activeIndex ? 'border-primary' : 'border-border'"
          :aria-label="$t('productPage.showImage', { number: index + 1 })"
          :aria-pressed="index === activeIndex"
          @click="goTo(index)"
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

    <ProductImageLightbox
      v-model:open="isFullscreen"
      v-model:index="fullscreenIndex"
      :images="images"
      :title="title"
    />
  </div>
</template>
