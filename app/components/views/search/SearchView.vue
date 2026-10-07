<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()

const query = computed(() => String(route.query.q ?? '').trim())
const title = computed(() =>
  query.value ? t('search.resultsFor', { query: query.value }) : t('search.title'),
)

// Search result pages are not useful in search engines
useRobotsRule('noindex, follow')
useSeoMeta({ title })
</script>

<template>
  <CatalogListing
    v-if="query"
    :title="title"
    :search="query"
    :breadcrumbs="[{ label: $t('search.title') }]"
  />
  <main v-else class="container-page py-8">
    <UiFeedback
      type="empty"
      :title="$t('search.empty.title')"
      :description="$t('search.empty.description')"
    />
  </main>
</template>
