<script setup lang="ts">
const localePath = useLocalePath()
</script>

<template>
  <section class="bg-surface-inverse text-on-inverse">
    <div class="container-page flex flex-col gap-6 py-10 md:py-12">
      <div class="max-w-xl">
        <h2 class="text-2xl font-semibold">{{ $t('home.cta.title') }}</h2>
        <p class="mt-2 text-sm text-on-inverse-muted">{{ $t('home.cta.description') }}</p>
      </div>
      <div class="flex flex-col gap-3 sm:flex-row">
        <UiButton :to="localePath(ROUTES.catalog)">{{ $t('home.steps.cta') }}</UiButton>
        <UiButton variant="outline" :to="localePath(ROUTES.calculator)">
          {{ $t('calculator.title') }}
        </UiButton>
      </div>
    </div>
  </section>
</template>
