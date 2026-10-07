<script setup lang="ts">
/** Icon cards for short lists of advantages, values and steps on the information pages */
export interface InfoFeature {
  key: string
  icon: string
  title: string
  description: string
}

defineProps<{
  items: InfoFeature[]
  /** Ordered steps: the list becomes an <ol> and the titles are numbered */
  numbered?: boolean
}>()
</script>

<template>
  <component :is="numbered ? 'ol' : 'ul'" class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
    <li
      v-for="(item, index) in items"
      :key="item.key"
      class="flex gap-3 rounded-lg border border-border bg-surface p-4 lg:flex-col lg:p-6"
    >
      <span
        class="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-hover"
        aria-hidden="true"
      >
        <Icon :name="item.icon" size="20" />
      </span>
      <div>
        <h3 class="text-sm font-semibold text-text">
          <template v-if="numbered">{{ index + 1 }}. </template>{{ item.title }}
        </h3>
        <p class="mt-1 text-compact text-text-secondary">{{ item.description }}</p>
      </div>
    </li>
  </component>
</template>
