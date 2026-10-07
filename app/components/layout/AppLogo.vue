<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath(ROUTES.home)"
    class="flex shrink-0 items-center gap-2"
    :aria-label="$t('common.siteName')"
  >
    <NuxtImg src="/images/brb-logo.svg" alt="" width="44" height="26" />
    <span class="flex flex-col">
      <span class="text-lg leading-6 font-semibold text-text">{{ $t('common.brand') }}</span>
      <span class="text-2xs text-text-secondary">{{ $t('common.tagline') }}</span>
    </span>
  </NuxtLink>
</template>
