<script setup lang="ts">
const { t } = useI18n()

useSeoMeta({
  title: () => t('catalog.title'),
  description: () => t('catalog.seo.description'),
  ogTitle: () => t('catalog.title'),
  ogDescription: () => t('catalog.seo.description'),
})
</script>

<template>
  <CatalogListing :title="$t('catalog.title')" :breadcrumbs="[{ label: $t('catalog.title') }]" />
</template>
