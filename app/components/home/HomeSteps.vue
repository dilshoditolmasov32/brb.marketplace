<script setup lang="ts">
const localePath = useLocalePath()

const STEPS = [
  { key: 'choose', icon: 'lucide:shopping-cart' },
  { key: 'calculate', icon: 'lucide:calculator' },
  { key: 'apply', icon: 'lucide:file-pen-line' },
  { key: 'receive', icon: 'lucide:package' },
] as const
</script>

<template>
  <section class="py-10 md:py-14">
    <div class="container-page">
      <div class="text-center">
        <h2 class="text-xl font-semibold text-text md:text-2xl">{{ $t('home.steps.title') }}</h2>
        <p class="mt-1 text-sm text-text-secondary">{{ $t('home.steps.subtitle') }}</p>
      </div>
      <ol class="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <li
          v-for="(step, index) in STEPS"
          :key="step.key"
          class="flex gap-3 rounded-lg border border-border bg-surface p-4 lg:flex-col lg:items-center lg:p-6 lg:text-center"
        >
          <span
            class="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-muted text-text"
            aria-hidden="true"
          >
            <Icon :name="step.icon" size="20" />
          </span>
          <div>
            <h3 class="text-sm font-semibold text-text">
              {{ index + 1 }}. {{ $t(`home.steps.items.${step.key}.title`) }}
            </h3>
            <p class="mt-1 text-compact text-text-secondary">
              {{ $t(`home.steps.items.${step.key}.description`) }}
            </p>
          </div>
        </li>
      </ol>
      <div class="mt-8 flex justify-center">
        <UiButton :to="localePath(ROUTES.catalog)">{{ $t('home.steps.cta') }}</UiButton>
      </div>
    </div>
  </section>
</template>
