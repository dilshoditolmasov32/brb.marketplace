<script setup lang="ts">
import type { ApplicationItem } from '~/types/application'

/** Products being financed, as compact rows */
defineProps<{ items: ApplicationItem[] }>()

const format = useFormat()
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li
      v-for="item in items"
      :key="item.product.id"
      class="flex items-center gap-3 rounded-lg border border-border bg-surface p-3 md:gap-4 md:p-4"
    >
      <NuxtImg
        :src="item.product.thumbnail"
        :alt="item.product.title"
        width="64"
        height="64"
        loading="lazy"
        class="size-16 shrink-0 rounded-sm bg-background object-contain"
      />
      <div class="flex min-w-0 flex-col gap-0.5">
        <p class="text-sm font-semibold text-text">{{ item.product.title }}</p>
        <p class="text-base font-bold text-text tabular-nums">
          {{ format.currency(item.product.price * item.quantity) }}
        </p>
        <p class="text-2xs text-text-secondary">
          {{ $t('application.purchase.sample') }}
          <template v-if="item.quantity > 1">
            · {{ $t('application.purchase.quantity', { count: item.quantity }) }}
          </template>
        </p>
      </div>
    </li>
  </ul>
</template>
