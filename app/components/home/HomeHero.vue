<script setup lang="ts">
import type { CatalogProduct } from '~/types/catalog'

/**
 * Hero: a carousel of featured products with up to three side tiles.
 * The carousel is a native scroll-snap strip, so swiping and keyboard scrolling work
 * without JavaScript; the script only adds arrows, dots and autoplay.
 */
const props = defineProps<{ products: CatalogProduct[] }>()

const localePath = useLocalePath()
const format = useFormat()

const TILE_COUNT = 3
// Requested pace; autoplay pauses on hover and focus (see below)
const AUTOPLAY_MS = 1500
const TILE_CLASSES = ['bg-hero-tile-1', 'bg-hero-tile-2', 'bg-hero-tile-3']

// The last products become tiles; with few products everything goes to the carousel
const tiles = computed(() =>
  props.products.length > TILE_COUNT + 1 ? props.products.slice(-TILE_COUNT) : [],
)
const slides = computed(() =>
  tiles.value.length ? props.products.slice(0, -TILE_COUNT) : props.products,
)

const track = useTemplateRef<HTMLElement>('track')
const activeIndex = ref(0)

function goTo(index: number) {
  const element = track.value
  if (!element || !slides.value.length) return
  const target = (index + slides.value.length) % slides.value.length
  element.scrollTo({ left: target * element.clientWidth, behavior: 'smooth' })
}

// Follows manual scrolling and swiping as well as the buttons
function onScroll() {
  const element = track.value
  if (!element || !element.clientWidth) return
  activeIndex.value = Math.round(element.scrollLeft / element.clientWidth)
}

// Autoplay stops while the visitor interacts and for anyone who prefers reduced motion
const isHovered = ref(false)
const isFocused = ref(false)
const reducedMotion = usePreferredReducedMotion()
const { pause, resume } = useIntervalFn(() => goTo(activeIndex.value + 1), AUTOPLAY_MS, {
  immediate: false,
})

watchEffect(() => {
  const canPlay =
    slides.value.length > 1 &&
    !isHovered.value &&
    !isFocused.value &&
    reducedMotion.value !== 'reduce'
  if (canPlay) resume()
  else pause()
})
</script>

<template>
  <section v-if="slides.length" class="bg-hero-surface text-on-inverse">
    <div class="container-page grid gap-3 py-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
      <div
        class="relative min-w-0"
        role="region"
        aria-roledescription="carousel"
        :aria-label="$t('home.hero.carousel')"
        @mouseenter="isHovered = true"
        @mouseleave="isHovered = false"
        @focusin="isFocused = true"
        @focusout="isFocused = false"
      >
        <ul
          ref="track"
          class="flex h-full snap-x snap-mandatory overflow-x-auto rounded-lg scrollbar:none [&::-webkit-scrollbar]:hidden"
          @scroll.passive="onScroll"
        >
          <li
            v-for="(product, index) in slides"
            :key="product.id"
            class="flex w-full shrink-0 snap-start flex-col-reverse gap-4 bg-hero-card p-6 pb-14 sm:flex-row sm:items-center md:p-8 md:pb-14"
            role="group"
            aria-roledescription="slide"
            :aria-label="$t('home.hero.slide', { current: index + 1, total: slides.length })"
          >
            <div class="flex min-w-0 flex-1 flex-col items-start gap-4 self-stretch">
              <span
                class="rounded-sm bg-primary px-2 py-1 text-2xs font-bold tracking-wide text-on-primary uppercase"
              >
                {{ $t('home.hero.badge') }}
              </span>
              <!-- One page heading: only the first slide is the h1 -->
              <component :is="index === 0 ? 'h1' : 'p'" class="text-2xl font-semibold md:text-3xl">
                {{ product.title }}
              </component>
              <p v-if="product.brand" class="text-sm text-on-inverse-muted">{{ product.brand }}</p>

              <div>
                <p class="text-xs text-on-inverse-muted">{{ $t('home.hero.price') }}</p>
                <p class="mt-1 text-2xl font-semibold tabular-nums">
                  {{ format.currency(product.price) }}
                </p>
                <p class="mt-2 flex flex-wrap items-center gap-2 text-xs text-on-inverse-muted">
                  <span class="rounded-sm bg-primary px-2 py-0.5 font-semibold text-on-primary">
                    {{
                      $t('home.hero.perMonth', {
                        amount: format.currency(product.installment.monthlyPayment),
                      })
                    }}
                  </span>
                  {{ $t('finance.months', { count: product.installment.termMonths }) }} ·
                  {{ $t('home.sample') }}
                </p>
              </div>

              <div class="mt-auto flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <UiButton :to="localePath(ROUTES.product(product.id))">
                  {{ $t('home.hero.buy') }}
                </UiButton>
                <UiButton variant="outline" :to="localePath(ROUTES.catalog)">
                  {{ $t('home.hero.catalog') }}
                </UiButton>
              </div>
            </div>
            <!-- Only the first slide is in view on load, so only it is fetched eagerly -->
            <NuxtImg
              :src="product.thumbnail"
              :alt="product.title"
              width="320"
              height="320"
              :loading="index === 0 ? 'eager' : 'lazy'"
              :fetchpriority="index === 0 ? 'high' : undefined"
              class="mx-auto size-40 shrink-0 object-contain sm:size-56 lg:size-64"
            />
          </li>
        </ul>

        <div
          v-if="slides.length > 1"
          class="absolute inset-x-0 bottom-2 flex items-center justify-between px-4 md:px-6"
        >
          <ul class="flex items-center">
            <li v-for="(product, index) in slides" :key="product.id">
              <button
                type="button"
                class="flex size-6 items-center justify-center"
                :aria-label="$t('home.hero.goTo', { number: index + 1 })"
                :aria-current="index === activeIndex ? 'true' : undefined"
                @click="goTo(index)"
              >
                <span
                  class="h-1.5 rounded-full transition-all"
                  :class="index === activeIndex ? 'w-5 bg-on-inverse' : 'w-1.5 bg-on-inverse-muted'"
                />
              </button>
            </li>
          </ul>
          <div class="flex gap-2">
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-full border border-on-inverse-muted hover:bg-hero-tile-1"
              :aria-label="$t('home.hero.previous')"
              @click="goTo(activeIndex - 1)"
            >
              <Icon name="lucide:chevron-left" size="18" />
            </button>
            <button
              type="button"
              class="flex size-9 items-center justify-center rounded-full border border-on-inverse-muted hover:bg-hero-tile-1"
              :aria-label="$t('home.hero.next')"
              @click="goTo(activeIndex + 1)"
            >
              <Icon name="lucide:chevron-right" size="18" />
            </button>
          </div>
        </div>
      </div>

      <ul v-if="tiles.length" class="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
        <li v-for="(product, index) in tiles" :key="product.id">
          <NuxtLink
            :to="localePath(ROUTES.product(product.id))"
            class="flex h-full flex-col items-start gap-1 rounded-lg p-4 md:p-5"
            :class="TILE_CLASSES[index]"
          >
            <span
              v-if="product.discountPercent"
              class="rounded-sm bg-primary px-2 py-0.5 text-2xs font-bold text-on-primary"
            >
              -{{ product.discountPercent }}%
            </span>
            <span class="text-base font-semibold">{{ product.title }}</span>
            <span class="text-compact text-on-inverse-muted tabular-nums">
              {{ format.currency(product.price) }}
            </span>
            <span class="text-xs text-on-inverse-muted tabular-nums">
              {{
                $t('home.hero.perMonth', {
                  amount: format.currency(product.installment.monthlyPayment),
                })
              }}
            </span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </section>
</template>
