<script setup lang="ts">
/** Registration form shown in the auth modal. A valid form starts a demo session. */
const emit = defineEmits<{ switch: [] }>()

const { t } = useI18n()
const localePath = useLocalePath()
const auth = useAuthStore()

const form = reactive({
  fullName: '',
  phone: '',
  password: '',
  passwordConfirm: '',
  consent: false,
})

type Field = keyof typeof form

const VALIDATORS: Record<Field, () => boolean> = {
  fullName: () => form.fullName.trim().split(/\s+/).filter(Boolean).length >= 2,
  phone: () => PHONE_PATTERN.test(form.phone.replace(/\s+/g, '')),
  password: () => form.password.length >= PASSWORD_MIN_LENGTH,
  passwordConfirm: () => form.passwordConfirm === form.password,
  consent: () => form.consent,
}

// Errors appear after the first submit attempt and then follow the input live
const wasSubmitted = ref(false)

const errors = computed(() => {
  const result: Partial<Record<Field, string>> = {}
  if (!wasSubmitted.value) return result
  for (const field of Object.keys(VALIDATORS) as Field[]) {
    if (!VALIDATORS[field]()) {
      result[field] = t(`auth.errors.${field}`, { min: PASSWORD_MIN_LENGTH })
    }
  }
  return result
})

// No backend yet: a valid form opens the demonstration cabinet, nothing is sent
async function submit() {
  wasSubmitted.value = true
  if (Object.keys(errors.value).length) return
  auth.signIn(form.fullName)
  await navigateTo(localePath(ROUTES.cabinet))
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <UiInput
        v-model="form.fullName"
        :label="$t('auth.fullName')"
        :error="errors.fullName"
        autocomplete="name"
        required
      />
      <UiInput
        v-model="form.phone"
        type="tel"
        :label="$t('auth.phone')"
        :hint="$t('auth.phoneHint')"
        :error="errors.phone"
        placeholder="+998 90 123 45 67"
        autocomplete="tel"
        inputmode="tel"
        required
      />
      <AuthPasswordInput
        v-model="form.password"
        :label="$t('auth.password')"
        :hint="$t('auth.passwordHint', { min: PASSWORD_MIN_LENGTH })"
        :error="errors.password"
        autocomplete="new-password"
      />
      <AuthPasswordInput
        v-model="form.passwordConfirm"
        :label="$t('auth.passwordConfirm')"
        :error="errors.passwordConfirm"
        autocomplete="new-password"
      />

      <div>
        <UiCheckbox v-model="form.consent" class="-mx-2">
          {{ $t('auth.register.consent') }}
        </UiCheckbox>
        <p v-if="errors.consent" class="text-xs text-error" role="alert">{{ errors.consent }}</p>
      </div>

      <UiButton type="submit" block>{{ $t('auth.register.submit') }}</UiButton>
    </form>

    <p class="border-t border-border pt-4 text-center text-sm text-text">
      {{ $t('auth.register.hasAccount') }}
      <button type="button" class="font-semibold text-primary-hover" @click="emit('switch')">
        {{ $t('auth.login.title') }}
      </button>
    </p>
  </div>
</template>
