<script setup lang="ts">
type ContactTopic = (typeof CONTACT_TOPICS)[number]

interface FeedbackData {
  fullName: string
  phone: string
  email: string
  topic: ContactTopic | undefined
  message: string
  consent: boolean
}

const MESSAGE_MIN_LENGTH = 10

const { t } = useI18n()

const { form, errors, isSending, isSent, submit, reset } = useSampleForm(
  (): FeedbackData => ({
    fullName: '',
    phone: '',
    email: '',
    topic: undefined,
    message: '',
    consent: false,
  }),
  {
    fullName: (data) => isFullName(data.fullName),
    phone: (data) => isPhone(data.phone),
    email: (data) => isOptionalEmail(data.email),
    topic: (data) => Boolean(data.topic),
    message: (data) => hasMinLength(data.message, MESSAGE_MIN_LENGTH),
    consent: (data) => data.consent,
  },
)

const topicOptions = computed(() =>
  CONTACT_TOPICS.map((value) => ({ value, label: t(`contacts.form.topics.${value}`) })),
)
</script>

<template>
  <section class="flex flex-col gap-5 rounded-lg border border-border bg-surface p-4 md:p-6">
    <div>
      <h2 class="text-lg font-semibold text-text">{{ $t('contacts.form.title') }}</h2>
      <p class="mt-1 text-compact text-text-secondary">{{ $t('contacts.form.subtitle') }}</p>
    </div>

    <InfoFormSent v-if="isSent" @again="reset" />

    <form v-else class="flex flex-col gap-5" novalidate @submit.prevent="submit">
      <div class="grid gap-4 md:grid-cols-2">
        <UiInput
          v-model="form.fullName"
          :disabled="isSending"
          :label="$t('forms.fullName')"
          :error="errors.fullName"
          autocomplete="name"
          required
        />
        <UiInput
          v-model="form.phone"
          :disabled="isSending"
          type="tel"
          :label="$t('forms.phone')"
          :hint="$t('forms.phoneHint')"
          :error="errors.phone"
          placeholder="+998 90 123 45 67"
          autocomplete="tel"
          inputmode="tel"
          required
        />
        <UiInput
          v-model="form.email"
          :disabled="isSending"
          type="email"
          :label="$t('forms.email')"
          :error="errors.email"
          placeholder="name@example.com"
          autocomplete="email"
        />
        <UiSelect
          v-model="form.topic"
          :options="topicOptions"
          :disabled="isSending"
          :label="$t('contacts.form.topic')"
          :placeholder="$t('contacts.form.topicPlaceholder')"
          :error="errors.topic"
          required
        />
      </div>

      <UiTextarea
        v-model="form.message"
        :disabled="isSending"
        :label="$t('forms.message')"
        :placeholder="$t('forms.messagePlaceholder')"
        :error="errors.message"
        maxlength="1000"
        required
      />

      <div>
        <UiCheckbox v-model="form.consent" class="-mx-2" :disabled="isSending">
          {{ $t('forms.consent') }}
        </UiCheckbox>
        <p v-if="errors.consent" class="text-xs text-error" role="alert">{{ errors.consent }}</p>
      </div>

      <div class="flex border-t border-border pt-5 sm:justify-end">
        <UiButton type="submit" :loading="isSending" class="w-full sm:w-auto">
          {{ isSending ? $t('forms.sending') : $t('forms.send') }}
        </UiButton>
      </div>
      <p class="text-2xs text-text-secondary">{{ $t('forms.sampleNote') }}</p>
    </form>
  </section>
</template>
