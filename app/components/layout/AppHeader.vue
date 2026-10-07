<script setup lang="ts">
const localePath = useLocalePath()
const route = useRoute()

const cart = useCartStore()
const authModal = useAuthModal()
const auth = useAuthStore()
const { data: categories } = await useCategories()

const HEADER_CATEGORY_LIMIT = 8
const headerCategories = computed(() => categories.value.slice(0, HEADER_CATEGORY_LIMIT))

const CATALOG_MENU_ID = 'header-catalog-menu'

const query = ref('')
const isCatalogOpen = ref(false)

// The catalog panel fills the viewport below the sticky header
const headerEl = ref<HTMLElement>()
const { height: headerHeight } = useElementSize(headerEl, undefined, { box: 'border-box' })

async function submitSearch() {
  const q = query.value.trim()
  if (!q) return
  await navigateTo({ path: localePath(ROUTES.search), query: { q } })
}

// Close the catalog after any navigation
watch(
  () => route.fullPath,
  () => (isCatalogOpen.value = false),
)

const utilityLinks = [
  { to: ROUTES.partners, labelKey: 'header.becomePartner', accent: true },
  { to: ROUTES.faq, labelKey: 'header.faq' },
  { to: ROUTES.cabinetApplications, labelKey: 'header.myApplications' },
]

const actions = [
  { to: ROUTES.favorites, labelKey: 'header.favorites', icon: 'lucide:heart' },
  { to: ROUTES.cart, labelKey: 'header.cart', icon: 'lucide:shopping-bag' },
]
</script>

<template>
  <!-- sticky + z-index: the catalog panel and its scrim are positioned against the header -->
  <header
    ref="headerEl"
    class="sticky top-0 z-30 bg-surface"
    :style="{ '--header-height': `${headerHeight}px` }"
  >
    <!-- Utility bar -->
    <div class="hidden bg-surface-muted text-sm md:block">
      <div class="container-page flex h-9 items-center justify-between gap-6">
        <div class="flex items-center gap-6">
          <span class="flex items-center gap-1.5 text-text">
            <Icon name="lucide:map-pin" size="16" />
            {{ $t('header.city') }}
          </span>
          <NuxtLink :to="localePath(ROUTES.branches)" class="text-text hover:text-primary">
            {{ $t('header.branches') }}
          </NuxtLink>
        </div>
        <nav :aria-label="$t('header.utilityNav')" class="flex items-center gap-6">
          <NuxtLink
            v-for="link in utilityLinks"
            :key="link.to"
            :to="localePath(link.to)"
            class="hover:text-primary"
            :class="link.accent ? 'text-primary-hover' : 'text-text'"
          >
            {{ $t(link.labelKey) }}
          </NuxtLink>
          <AppLanguageSwitcher />
        </nav>
      </div>
    </div>

    <!-- Main bar -->
    <div class="container-page flex h-16 items-center gap-3 md:h-18 md:gap-6">
      <AppLogo />

      <button
        type="button"
        class="hidden h-11 shrink-0 items-center gap-2 rounded-sm bg-primary-soft px-4 text-sm font-semibold text-primary-hover lg:flex"
        :aria-expanded="isCatalogOpen"
        :aria-controls="CATALOG_MENU_ID"
        @click="isCatalogOpen = !isCatalogOpen"
      >
        <Icon :name="isCatalogOpen ? 'lucide:x' : 'lucide:layout-grid'" size="18" />
        {{ $t('header.catalog') }}
      </button>

      <form role="search" class="hidden min-w-0 flex-1 md:flex" @submit.prevent="submitSearch">
        <label for="header-search" class="sr-only">{{ $t('header.search') }}</label>
        <input
          id="header-search"
          v-model="query"
          type="search"
          :placeholder="$t('header.searchPlaceholder')"
          class="h-11 min-w-0 flex-1 rounded-l-sm border border-r-0 border-border-strong bg-surface px-4 text-sm text-text placeholder:text-text-secondary focus-visible:-outline-offset-2"
        />
        <button
          type="submit"
          class="flex h-11 w-14 shrink-0 items-center justify-center rounded-r-sm border border-border-strong bg-surface-muted hover:bg-border focus-visible:-outline-offset-2"
          :aria-label="$t('header.search')"
        >
          <Icon name="brb:search" size="18" />
        </button>
      </form>

      <nav
        :aria-label="$t('header.mainNav')"
        class="ml-auto flex items-center gap-1 md:ml-0 lg:gap-4"
      >
        <NuxtLink
          v-if="auth.isSignedIn"
          :to="localePath(ROUTES.cabinet)"
          class="hidden min-h-11 min-w-11 items-center justify-center gap-2 text-sm font-medium text-text hover:text-primary md:flex"
        >
          <Icon name="lucide:user" size="20" />
          <span class="sr-only xl:not-sr-only">{{ $t('cabinet.title') }}</span>
        </NuxtLink>
        <button
          v-else
          type="button"
          class="hidden min-h-11 min-w-11 items-center justify-center gap-2 text-sm font-medium text-text hover:text-primary md:flex"
          @click="authModal.open('login')"
        >
          <Icon name="lucide:user" size="20" />
          <span class="sr-only xl:not-sr-only">{{ $t('header.login') }}</span>
        </button>
        <NuxtLink
          v-for="action in actions"
          :key="action.to"
          :to="localePath(action.to)"
          class="hidden min-h-11 min-w-11 items-center justify-center gap-2 text-sm font-medium text-text hover:text-primary md:flex"
        >
          <span class="relative flex">
            <Icon :name="action.icon" size="20" />
            <span
              v-if="action.to === ROUTES.cart && cart.count"
              class="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-2xs font-semibold text-on-primary"
            >
              {{ cart.count }}
            </span>
          </span>
          <span class="sr-only xl:not-sr-only">{{ $t(action.labelKey) }}</span>
        </NuxtLink>
        <!-- Phones: the sections live in the bottom bar, the header keeps the language -->
        <AppLanguageSwitcher class="md:hidden" />
      </nav>
    </div>

    <!-- Mobile search -->
    <form role="search" class="container-page flex pb-3 md:hidden" @submit.prevent="submitSearch">
      <label for="header-search-mobile" class="sr-only">{{ $t('header.search') }}</label>
      <div
        class="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-sm border border-border-strong bg-surface px-3 focus-within:border-focus"
      >
        <Icon name="brb:search" size="18" class="shrink-0" />
        <input
          id="header-search-mobile"
          v-model="query"
          type="search"
          :placeholder="$t('header.searchPlaceholder')"
          class="min-w-0 flex-1 bg-transparent text-sm text-text outline-none placeholder:text-text-secondary"
        />
      </div>
    </form>

    <!-- Category bar -->
    <nav :aria-label="$t('header.categoriesNav')" class="border-b border-border">
      <ul
        class="container-page flex h-11 items-center gap-6 overflow-x-auto text-sm whitespace-nowrap"
      >
        <li class="lg:hidden">
          <button
            type="button"
            class="flex min-h-11 items-center gap-1.5 font-semibold text-text"
            :aria-expanded="isCatalogOpen"
            :aria-controls="CATALOG_MENU_ID"
            @click="isCatalogOpen = !isCatalogOpen"
          >
            <Icon :name="isCatalogOpen ? 'lucide:x' : 'lucide:layout-grid'" size="16" />
            {{ $t('header.catalog') }}
          </button>
        </li>
        <li v-for="category in headerCategories" :key="category.slug">
          <NuxtLink
            :to="localePath(ROUTES.category(category.slug))"
            class="text-text-secondary hover:text-text"
          >
            {{ category.name }}
          </NuxtLink>
        </li>
        <li class="ml-auto">
          <NuxtLink :to="localePath(ROUTES.calculator)" class="font-medium text-primary-hover">
            {{ $t('header.installment') }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <AppCatalogMenu :id="CATALOG_MENU_ID" v-model="isCatalogOpen" :categories="categories" />
  </header>
</template>
