<script setup lang="ts">
const props = defineProps<{
  images: string[]
  /** Product name, used for the image descriptions */
  title: string
}>()

const activeIndex = ref(0)
const activeImage = computed(() => props.images[activeIndex.value] ?? props.images[0])

// A different product may reuse this component instance
watch(
  () => props.images,
  () => (activeIndex.value = 0),
)
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="overflow-hidden rounded-xl border border-border bg-surface">
      <NuxtImg
        v-if="activeImage"
        :src="activeImage"
        :alt="title"
        width="640"
        height="640"
        fetchpriority="high"
        class="aspect-square w-full object-contain"
      />
    </div>
    <ul v-if="images.length > 1" class="grid grid-cols-4 gap-3">
      <li v-for="(image, index) in images" :key="image">
        <button
          type="button"
          class="block w-full overflow-hidden rounded-lg border bg-surface"
          :class="index === activeIndex ? 'border-primary' : 'border-border'"
          :aria-label="$t('productPage.showImage', { number: index + 1 })"
          :aria-pressed="index === activeIndex"
          @click="activeIndex = index"
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
</template>
