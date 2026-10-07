<script setup lang="ts">
// Sets <html lang>, hreflang alternates and og:locale for every page
const head = useLocaleHead()
const { t } = useI18n()

useHead({
  titleTemplate: (title) => (title ? `${title} · ${t('common.brand')}` : t('common.siteName')),
  htmlAttrs: { lang: () => head.value.htmlAttrs?.lang },
  link: () => head.value.link ?? [],
  meta: () => head.value.meta ?? [],
})

// The wrapper's bottom padding on phones keeps the footer clear of the fixed tab bar
</script>

<template>
  <div class="flex min-h-dvh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
    <AppHeader />
    <div class="flex-1">
      <slot />
    </div>
    <AppFooter />
    <AppBottomNav />
    <AppLocaleLoader />
    <ClientOnly>
      <AppBackToTop />
      <AuthModal />
    </ClientOnly>
  </div>
</template>
