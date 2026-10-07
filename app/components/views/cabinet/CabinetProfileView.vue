<script setup lang="ts">
const { t } = useI18n()
const auth = useAuthStore()

// Kept in memory only; of all the fields just the display name outlives the page (demo session)
const form = reactive({
  fullName: auth.user?.fullName ?? '',
  phone: '',
  email: '',
  region: '',
})

// The session is read from the browser after mount, so the name may arrive late
watch(
  () => auth.user?.fullName,
  (value) => {
    if (value && !form.fullName) form.fullName = value
  },
)

type Field = 'fullName' | 'phone' | 'email'

// Phone and email are checked only when filled in: the demo session does not know them
const VALIDATORS: Record<Field, () => boolean> = {
  fullName: () => form.fullName.trim().split(/\s+/).filter(Boolean).length >= 2,
  phone: () => !form.phone.trim() || PHONE_PATTERN.test(form.phone.replace(/\s+/g, '')),
  email: () => !form.email.trim() || EMAIL_PATTERN.test(form.email.trim()),
}

const wasSubmitted = ref(false)
const isSaved = ref(false)

const errors = computed(() => {
  const result: Partial<Record<Field, string>> = {}
  if (!wasSubmitted.value) return result
  for (const field of Object.keys(VALIDATORS) as Field[]) {
    if (!VALIDATORS[field]()) result[field] = t(`cabinet.profile.errors.${field}`)
  }
  return result
})

// No backend yet: saving only updates the name shown in the cabinet
function save() {
  wasSubmitted.value = true
  if (Object.keys(errors.value).length) return
  auth.signIn(form.fullName)
  isSaved.value = true
}

watch(form, () => (isSaved.value = false))
</script>

<template>
  <CabinetShell section="profile">
    <CabinetCard :title="$t('cabinet.profile.personal')">
      <form class="flex flex-col gap-4" novalidate @submit.prevent="save">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
          <UiInput
            v-model="form.fullName"
            :label="$t('auth.fullName')"
            :hint="$t('cabinet.profile.fullNameHint')"
            :error="errors.fullName"
            autocomplete="name"
            required
          />
          <UiInput
            v-model="form.phone"
            type="tel"
            :label="$t('auth.phone')"
            :error="errors.phone"
            placeholder="+998 90 123 45 67"
            autocomplete="tel"
            inputmode="tel"
          />
          <UiInput
            v-model="form.email"
            type="email"
            :label="$t('cabinet.profile.email')"
            :error="errors.email"
            placeholder="name@example.com"
            autocomplete="email"
          />
          <UiInput
            v-model="form.region"
            :label="$t('cabinet.profile.region')"
            :placeholder="$t('cabinet.profile.regionPlaceholder')"
            autocomplete="address-level1"
          />
        </div>
        <UiAlert v-if="isSaved" tone="success" :title="$t('cabinet.profile.saved.title')">
          {{ $t('cabinet.profile.saved.description') }}
        </UiAlert>
        <UiButton type="submit" block class="md:w-auto md:min-w-40 md:self-start">
          {{ $t('cabinet.profile.save') }}
        </UiButton>
      </form>
    </CabinetCard>

    <CabinetCard :title="$t('cabinet.profile.documents')">
      <div class="flex flex-wrap justify-between gap-x-4 gap-y-1 text-compact">
        <span class="text-text-secondary">{{ $t('cabinet.profile.idCard') }}</span>
        <span class="font-semibold text-text tabular-nums">
          {{ CABINET_SAMPLE.documentNumber }}
        </span>
      </div>
      <ul class="flex flex-col text-compact">
        <li
          v-for="file in CABINET_DOCUMENT_FILES"
          :key="file.name"
          class="flex items-center gap-2 border-t border-border py-2.5 text-text"
        >
          <Icon name="lucide:file-text" size="16" class="shrink-0 text-text-secondary" />
          <span class="min-w-0 truncate">{{ file.name }}</span>
          <span class="ml-auto shrink-0 text-2xs text-text-secondary">
            <template v-if="file.size">{{ file.size }} · </template>
            {{ $t(`cabinet.profile.fileNotes.${file.note}`) }}
          </span>
        </li>
      </ul>
      <UiButton variant="outline" block disabled>{{ $t('cabinet.profile.replace') }}</UiButton>
    </CabinetCard>
  </CabinetShell>
</template>
