<script setup lang="ts">
/** Monthly payment headline with a breakdown table. Values arrive already formatted. */
defineProps<{
  monthlyPayment: string
  rows: { label: string; value: string }[]
  disclaimer?: string
}>()
</script>

<template>
  <section class="flex flex-col gap-4 rounded-lg bg-background p-6" aria-live="polite">
    <div>
      <p class="text-sm text-text-secondary">{{ $t('finance.monthlyPayment') }}</p>
      <p class="mt-2 text-3xl font-semibold text-text tabular-nums">{{ monthlyPayment }}</p>
    </div>
    <dl class="flex flex-col gap-3 border-t border-border pt-4 text-sm">
      <div v-for="row in rows" :key="row.label" class="flex items-baseline justify-between gap-4">
        <dt class="text-text-secondary">{{ row.label }}</dt>
        <dd class="text-right font-semibold text-text tabular-nums">{{ row.value }}</dd>
      </div>
    </dl>
    <p v-if="disclaimer" class="text-xs text-text-secondary">{{ disclaimer }}</p>
    <slot name="action" />
  </section>
</template>
