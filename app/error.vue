<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const { t } = useI18n()
const localePath = useLocalePath()

type ErrorKind = 'notFound' | 'forbidden' | 'tooManyRequests' | 'unavailable' | 'generic'

// Only the status decides what the visitor reads; technical details are never shown
function kindOf(status: number): ErrorKind {
  if (status === 404) return 'notFound'
  if (status === 401 || status === 403) return 'forbidden'
  if (status === 429) return 'tooManyRequests'
  if (status === 503) return 'unavailable'
  return 'generic'
}

const status = computed(() => Number(props.error.statusCode) || 500)
const title = computed(() => t(`errorPage.${kindOf(status.value)}.title`))
const description = computed(() => t(`errorPage.${kindOf(status.value)}.description`))

if (import.meta.dev) {
  console.error(props.error)
}

// No robots rule here: error responses are not indexed, and useRobotsRule() makes the
// server render an empty body for this page.
useHead({ title })

const goHome = () => clearError({ redirect: localePath(ROUTES.home) })
</script>

<template>
  <NuxtLayout>
    <main class="container-page flex flex-col items-center gap-4 py-16 text-center md:py-24">
      <p class="text-4xl font-semibold text-primary tabular-nums">{{ status }}</p>
      <h1 class="text-2xl font-semibold text-text">{{ title }}</h1>
      <p class="max-w-md text-sm text-text-secondary">{{ description }}</p>
      <UiButton @click="goHome">{{ $t('errorPage.home') }}</UiButton>
    </main>
  </NuxtLayout>
</template>
