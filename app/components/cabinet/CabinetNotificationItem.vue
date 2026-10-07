<script setup lang="ts">
/** One notification card. Texts: cabinet.notifications.items.<key> */
withDefaults(
  defineProps<{
    item: { key: string; date: string }
    /** Omit to hide the read state (overview) */
    unread?: boolean
  }>(),
  { unread: undefined },
)

const format = useFormat()
</script>

<template>
  <article class="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4">
    <p class="text-2xs text-text-secondary">
      {{ format.date(item.date) }}
      <template v-if="unread !== undefined">
        ·
        <span :class="unread && 'font-semibold text-primary-hover'">
          {{ $t(unread ? 'cabinet.notifications.unread' : 'cabinet.notifications.read') }}
        </span>
      </template>
    </p>
    <h3 class="text-sm font-semibold text-text">
      {{ $t(`cabinet.notifications.items.${item.key}.title`) }}
    </h3>
    <p class="text-compact text-text-secondary">
      {{
        $t(`cabinet.notifications.items.${item.key}.description`, {
          contract: CABINET_SAMPLE.contractNumber,
          application: CABINET_SAMPLE.applicationNumber,
          count: DEFAULT_TERM_MONTHS,
        })
      }}
    </p>
  </article>
</template>
