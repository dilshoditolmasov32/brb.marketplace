<script setup lang="ts">
const { t } = useI18n()
const format = useFormat()
const { name } = useCabinetSample()

interface Message {
  id: number
  from: 'customer' | 'support'
  text: string
}

// The conversation lives in the page only: nothing is sent until the backend is connected
const messages = ref<Message[]>([
  { id: 1, from: 'customer', text: t('cabinet.support.sample.question') },
  { id: 2, from: 'support', text: t('cabinet.support.sample.answer') },
])

const draft = ref('')
const isFaqOpen = ref(false)

function send() {
  const text = draft.value.trim()
  if (!text) return
  messages.value.push({ id: messages.value.length + 1, from: 'customer', text })
  draft.value = ''
}
</script>

<template>
  <CabinetShell section="support">
    <CabinetCard>
      <div class="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
        <div class="flex min-w-0 items-center gap-2">
          <Icon name="lucide:shield-check" size="18" class="shrink-0 text-text-secondary" />
          <h2 class="text-base font-semibold text-text">
            {{ $t('cabinet.support.ticket.title') }}
          </h2>
        </div>
        <UiBadge tone="success">{{ $t('cabinet.support.ticket.status') }}</UiBadge>
      </div>
      <p class="text-compact text-text-secondary">
        {{ CABINET_SAMPLE.ticketNumber }} · {{ CABINET_SAMPLE.contractNumber }} · {{ name }}.
        {{ $t('cabinet.support.ticket.description') }}
      </p>
      <p class="text-compact font-semibold text-text">{{ $t('cabinet.support.ticket.state') }}</p>
    </CabinetCard>

    <CabinetCard :title="$t('cabinet.support.chat.title')">
      <ul class="flex flex-col gap-3" aria-live="polite">
        <li
          v-for="message in messages"
          :key="message.id"
          class="flex flex-col gap-1 rounded-sm p-3 text-compact"
          :class="message.from === 'support' ? 'bg-surface-muted' : 'border border-border'"
        >
          <p class="text-2xs text-text-secondary">
            {{ message.from === 'support' ? $t('cabinet.support.chat.support') : name }}
            · {{ format.dateNumeric(CABINET_SAMPLE.date) }}
          </p>
          <p class="wrap-break-word text-text">{{ message.text }}</p>
        </li>
      </ul>
      <form class="flex flex-col gap-3 sm:flex-row sm:items-end" @submit.prevent="send">
        <div class="min-w-0 sm:flex-1">
          <UiInput
            v-model="draft"
            :label="$t('cabinet.support.chat.label')"
            :placeholder="$t('cabinet.support.chat.placeholder')"
            autocomplete="off"
          />
        </div>
        <UiButton
          type="submit"
          block
          class="sm:w-auto sm:min-w-40 sm:shrink-0"
          :disabled="!draft.trim()"
        >
          {{ $t('cabinet.support.chat.send') }}
        </UiButton>
      </form>
      <p class="text-2xs text-text-secondary">{{ $t('cabinet.support.chat.note') }}</p>
    </CabinetCard>

    <UiAccordion v-model:open="isFaqOpen" :title="$t('cabinet.support.faq.question')">
      {{ $t('cabinet.support.faq.answer') }}
    </UiAccordion>
  </CabinetShell>
</template>
