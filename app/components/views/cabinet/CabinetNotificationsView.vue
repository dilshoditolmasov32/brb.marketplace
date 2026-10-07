<script setup lang="ts">
// Read state lives in the page only; the backend will own it later
const unreadKeys = ref<string[]>(
  CABINET_NOTIFICATIONS.filter((item) => item.unread).map((item) => item.key),
)

const smsEnabled = ref(true)

const markAllRead = () => (unreadKeys.value = [])
</script>

<template>
  <CabinetShell section="notifications">
    <p
      class="text-compact font-semibold"
      :class="unreadKeys.length ? 'text-primary-hover' : 'text-text-secondary'"
      aria-live="polite"
    >
      {{
        unreadKeys.length
          ? $t('cabinet.notifications.unreadCount', { count: unreadKeys.length })
          : $t('cabinet.notifications.allRead')
      }}
    </p>

    <ul class="flex flex-col gap-3">
      <li v-for="item in CABINET_NOTIFICATIONS" :key="item.key">
        <CabinetNotificationItem :item="item" :unread="unreadKeys.includes(item.key)" />
      </li>
    </ul>

    <CabinetCard :title="$t('cabinet.notifications.settings')">
      <UiSwitch v-model="smsEnabled" :label="$t('cabinet.notifications.sms')" />
      <UiButton variant="outline" block :disabled="!unreadKeys.length" @click="markAllRead">
        {{ $t('cabinet.notifications.markAllRead') }}
      </UiButton>
    </CabinetCard>
  </CabinetShell>
</template>
