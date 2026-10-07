<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const slug = computed(() => String(route.params.category))

const { data: categories } = await useCategories()
const category = computed(() => categories.value.find((item) => item.slug === slug.value))

// The API answers an unknown category with an empty list, so a missing one is detected here
if (categories.value.length && !category.value) {
  throw createError({ statusCode: 404, statusMessage: 'Category not found', fatal: true })
}

const title = computed(() => category.value?.name ?? slug.value)
const description = computed(() => t('catalog.seo.categoryDescription', { category: title.value }))

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <CatalogListing
    :title="title"
    :category="slug"
    :breadcrumbs="[{ label: $t('catalog.title'), to: ROUTES.catalog }, { label: title }]"
  />
</template>
