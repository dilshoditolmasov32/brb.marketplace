<script setup lang="ts">
/** Phone navigation: a tab bar fixed to the bottom of the screen. Hidden from md up. */
const localePath = useLocalePath()
const route = useRoute()

const cart = useCartStore()
const auth = useAuthStore()
const authModal = useAuthModal()

const links = [
  { to: ROUTES.home, labelKey: 'breadcrumbs.home', icon: 'lucide:house' },
  { to: ROUTES.catalog, labelKey: 'header.catalog', icon: 'lucide:layout-grid' },
  { to: ROUTES.cart, labelKey: 'header.cart', icon: 'lucide:shopping-bag' },
  { to: ROUTES.favorites, labelKey: 'header.favorites', icon: 'lucide:heart' },
]

// The home tab matches only the home page; the others also cover their nested pages
function isActive(to: string) {
  const path = localePath(to)
  if (to === ROUTES.home) return route.path === path
  return route.path === path || route.path.startsWith(`${path}/`)
}

const ITEM_CLASSES =
  'flex h-14 w-full min-w-0 flex-col items-center justify-center gap-0.5 px-1 text-2xs font-medium focus-visible:-outline-offset-2'

const toneClass = (active: boolean) => (active ? 'text-primary' : 'text-text-secondary')
</script>

<template>
  <nav
    :aria-label="$t('header.mainNav')"
    class="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface pb-[env(safe-area-inset-bottom)] md:hidden"
  >
    <ul class="grid grid-cols-5">
      <li v-for="link in links" :key="link.to" class="min-w-0">
        <NuxtLink
          :to="localePath(link.to)"
          :class="[ITEM_CLASSES, toneClass(isActive(link.to))]"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          <span class="relative flex">
            <Icon :name="link.icon" size="22" />
            <span
              v-if="link.to === ROUTES.cart && cart.count"
              class="absolute -top-1.5 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-2xs font-semibold text-on-primary"
            >
              {{ cart.count }}
            </span>
          </span>
          <span class="max-w-full truncate">{{ $t(link.labelKey) }}</span>
        </NuxtLink>
      </li>
      <li class="min-w-0">
        <NuxtLink
          v-if="auth.isSignedIn"
          :to="localePath(ROUTES.cabinet)"
          :class="[ITEM_CLASSES, toneClass(isActive(ROUTES.cabinet))]"
          :aria-current="isActive(ROUTES.cabinet) ? 'page' : undefined"
        >
          <Icon name="lucide:user" size="22" />
          <span class="max-w-full truncate">{{ $t('cabinet.title') }}</span>
        </NuxtLink>
        <button
          v-else
          type="button"
          :class="[ITEM_CLASSES, toneClass(false)]"
          @click="authModal.open('login')"
        >
          <Icon name="lucide:user" size="22" />
          <span class="max-w-full truncate">{{ $t('header.login') }}</span>
        </button>
      </li>
    </ul>
  </nav>
</template>
