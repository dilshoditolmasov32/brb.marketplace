<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const format = useFormat()

const stats = computed(() => [
  { value: format.percent(DEFAULT_ANNUAL_RATE_PERCENT), label: t('home.financing.rate') },
  {
    value: t('finance.months', { count: LOAN_TERM_MAX_MONTHS }),
    label: t('home.financing.maxTerm'),
  },
  { value: t('home.financing.online'), label: t('home.financing.onlineLabel') },
])
</script>

<template>
  <section class="bg-primary text-on-primary">
    <div
      class="container-page flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <h2 class="text-xl font-semibold">{{ $t('home.financing.title') }}</h2>
        <p class="mt-1 text-compact">
          {{
            $t('home.financing.description', {
              min: format.currency(LOAN_AMOUNT_MIN),
              max: format.currency(LOAN_AMOUNT_MAX),
            })
          }}
        </p>
        <dl class="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          <div v-for="stat in stats" :key="stat.label" class="flex flex-col-reverse">
            <dt class="text-2xs">{{ stat.label }}</dt>
            <dd class="text-xl font-semibold">{{ stat.value }}</dd>
          </div>
        </dl>
      </div>
      <UiButton variant="outline" :to="localePath(ROUTES.application)" class="shrink-0">
        {{ $t('common.apply') }}
      </UiButton>
    </div>
  </section>
</template>
