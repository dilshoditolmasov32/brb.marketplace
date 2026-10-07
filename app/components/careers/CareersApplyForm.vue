<script setup lang="ts">
/** Vacancy chosen from the list above the form; pre-selects the vacancy field */
const selectedVacancy = defineModel<string>('vacancy')

interface CareersApplyData {
  fullName: string
  phone: string
  email: string
  vacancy: string | undefined
  about: string
  cv: File | null
  consent: boolean
}

const { t } = useI18n()

const { form, errors, isSending, isSent, submit, reset } = useSampleForm(
  (): CareersApplyData => ({
    fullName: '',
    phone: '',
    email: '',
    vacancy: selectedVacancy.value,
    about: '',
    cv: null,
    consent: false,
  }),
  {
    fullName: (data) => isFullName(data.fullName),
    phone: (data) => isPhone(data.phone),
    email: (data) => isOptionalEmail(data.email),
    vacancy: (data) => Boolean(data.vacancy),
    consent: (data) => data.consent,
  },
)

watch(selectedVacancy, (key) => {
  if (key) form.value.vacancy = key
})

const vacancyOptions = computed(() =>
  VACANCIES.map(({ key }) => ({ value: key, label: t(`careers.items.${key}.title`) })),
)

function again() {
  selectedVacancy.value = undefined
  reset()
}
</script>

<template>
  <section class="flex flex-col gap-5 rounded-lg border border-border bg-surface p-4 md:p-6">
    <div>
      <h2 class="text-lg font-semibold text-text">{{ $t('careers.form.title') }}</h2>
      <p class="mt-1 text-compact text-text-secondary">{{ $t('careers.form.subtitle') }}</p>
    </div>

    <InfoFormSent v-if="isSent" @again="again" />

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
        <UiSelect
          v-model="form.vacancy"
          :options="vacancyOptions"
          :disabled="isSending"
          :label="$t('careers.form.vacancy')"
          :placeholder="$t('careers.form.vacancyPlaceholder')"
          :error="errors.vacancy"
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
      </div>

      <UiFileUpload
        v-model="form.cv"
        :label="$t('careers.form.cv')"
        :extensions="['pdf', 'doc', 'docx']"
        :disabled="isSending"
      />

      <UiTextarea
        v-model="form.about"
        :disabled="isSending"
        :label="$t('careers.form.about')"
        :placeholder="$t('careers.form.aboutPlaceholder')"
        maxlength="1000"
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
