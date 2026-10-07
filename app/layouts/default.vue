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
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <AppHeader />
    <div class="flex-1">
      <slot />
    </div>
    <AppFooter />
  </div>
</template>
