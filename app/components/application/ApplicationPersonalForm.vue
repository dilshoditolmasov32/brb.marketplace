<script setup lang="ts">
import type { ApplicationPersonalData } from '~/types/application'

/**
 * Personal details step. Validation is client-side only and nothing is sent anywhere yet;
 * the values stay in memory and must never be written to localStorage or logs.
 */
const emit = defineEmits<{ back: []; submit: [] }>()

const form = defineModel<ApplicationPersonalData>({ required: true })

const { t } = useI18n()

// The document copy is optional and is validated by the upload field itself
type Field = Exclude<keyof ApplicationPersonalData, 'document'>

const compact = (value: string) => value.replace(/\s+/g, '')

const VALIDATORS: Record<Field, (data: ApplicationPersonalData) => boolean> = {
  fullName: (data) => data.fullName.trim().split(/\s+/).filter(Boolean).length >= 2,
  documentNumber: (data) =>
    APPLICATION_DOCUMENT_PATTERN.test(compact(data.documentNumber).toUpperCase()),
  phone: (data) => PHONE_PATTERN.test(compact(data.phone)),
  email: (data) => !data.email.trim() || EMAIL_PATTERN.test(data.email.trim()),
  consent: (data) => data.consent,
}

// Errors appear after the first submit attempt and then follow the input live
const wasSubmitted = ref(false)

const errors = computed(() => {
  const result: Partial<Record<Field, string>> = {}
  if (!wasSubmitted.value) return result
  for (const field of Object.keys(VALIDATORS) as Field[]) {
    if (!VALIDATORS[field](form.value)) result[field] = t(`application.errors.${field}`)
  }
  return result
})

// No backend yet: picking a file plays a short stand-in upload so the progress state is visible
const UPLOAD_TICK_MS = 120
const UPLOAD_STEP_PERCENT = 10
const uploadProgress = ref<number>()
let uploadTimer: ReturnType<typeof setInterval> | undefined

watch(
  () => form.value.document,
  (file, previous) => {
    clearInterval(uploadTimer)
    uploadProgress.value = undefined
    if (!file || file === previous) return
    uploadProgress.value = 0
    uploadTimer = setInterval(() => {
      uploadProgress.value = Math.min(100, (uploadProgress.value ?? 0) + UPLOAD_STEP_PERCENT)
      if (uploadProgress.value === 100) clearInterval(uploadTimer)
    }, UPLOAD_TICK_MS)
  },
)

const isUploading = computed(() => uploadProgress.value !== undefined && uploadProgress.value < 100)

// The same for sending: the form locks for a moment, then the flow moves on
const SEND_DELAY_MS = 1200
const isSending = ref(false)
let sendTimer: ReturnType<typeof setTimeout> | undefined

function submit() {
  wasSubmitted.value = true
  if (Object.keys(errors.value).length || isUploading.value || isSending.value) return
  isSending.value = true
  sendTimer = setTimeout(() => {
    isSending.value = false
    emit('submit')
  }, SEND_DELAY_MS)
}

onBeforeUnmount(() => {
  clearInterval(uploadTimer)
  clearTimeout(sendTimer)
})
</script>

<template>
  <form
    class="flex flex-col gap-5 rounded-lg border border-border bg-surface p-4 md:p-6"
    novalidate
    @submit.prevent="submit"
  >
    <div>
      <h2 class="text-lg font-semibold text-text">{{ $t('application.personal.title') }}</h2>
      <p class="mt-1 text-2xs text-text-secondary">{{ $t('application.personal.subtitle') }}</p>
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <UiInput
        v-model="form.fullName"
        :disabled="isSending"
        :label="$t('application.personal.fullName')"
        :hint="$t('application.personal.fullNameHint')"
        :error="errors.fullName"
        autocomplete="name"
        required
      />
      <UiInput
        v-model="form.documentNumber"
        :disabled="isSending"
        :label="$t('application.personal.document')"
        :hint="$t('application.personal.documentHint')"
        :error="errors.documentNumber"
        placeholder="AA 0000000"
        autocomplete="off"
        required
      />
      <UiInput
        v-model="form.phone"
        :disabled="isSending"
        type="tel"
        :label="$t('application.personal.phone')"
        :hint="$t('application.personal.phoneHint')"
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
        :label="$t('application.personal.email')"
        :hint="$t('application.personal.emailHint')"
        :error="errors.email"
        placeholder="name@example.com"
        autocomplete="email"
      />
    </div>

    <UiFileUpload
      v-model="form.document"
      :label="$t('application.personal.upload')"
      :progress="uploadProgress"
      :disabled="isSending"
    />

    <div>
      <UiCheckbox v-model="form.consent" class="-mx-2" :disabled="isSending">
        {{ $t('application.personal.consent') }}
      </UiCheckbox>
      <p v-if="errors.consent" class="text-xs text-error" role="alert">{{ errors.consent }}</p>
    </div>

    <div class="flex flex-col-reverse gap-2 border-t border-border pt-5 sm:flex-row sm:justify-end">
      <UiButton variant="ghost" :disabled="isSending" @click="emit('back')">
        {{ $t('application.back') }}
      </UiButton>
      <UiButton type="submit" :loading="isSending" :disabled="isUploading">
        {{ isSending ? $t('application.personal.sending') : $t('application.personal.submit') }}
      </UiButton>
    </div>
    <p class="text-2xs text-text-secondary">{{ $t('application.sampleNote') }}</p>
  </form>
</template>
