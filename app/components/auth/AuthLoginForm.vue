<script setup lang="ts">
/** Sign-in form shown in the auth modal. A valid form starts a demo session. */
const emit = defineEmits<{ switch: [] }>()

const { t } = useI18n()
const localePath = useLocalePath()
const auth = useAuthStore()

const form = reactive({ phone: '', password: '' })

type Field = keyof typeof form

const VALIDATORS: Record<Field, () => boolean> = {
  phone: () => PHONE_PATTERN.test(form.phone.replace(/\s+/g, '')),
  password: () => form.password.length > 0,
}

// Errors appear after the first submit attempt and then follow the input live
const wasSubmitted = ref(false)

const errors = computed(() => {
  const result: Partial<Record<Field, string>> = {}
  if (!wasSubmitted.value) return result
  for (const field of Object.keys(VALIDATORS) as Field[]) {
    if (!VALIDATORS[field]()) result[field] = t(`auth.errors.${field}`)
  }
  return result
})

// No backend yet: a valid form opens the demonstration cabinet, nothing is sent
async function submit() {
  wasSubmitted.value = true
  if (Object.keys(errors.value).length) return
  auth.signIn()
  await navigateTo(localePath(ROUTES.cabinet))
}
</script>

<template>
  <div class="flex flex-col gap-5">
    <form class="flex flex-col gap-4" novalidate @submit.prevent="submit">
      <UiInput
        v-model="form.phone"
        type="tel"
        :label="$t('auth.phone')"
        :error="errors.phone"
        placeholder="+998 90 123 45 67"
        autocomplete="tel"
        inputmode="tel"
        required
      />
      <AuthPasswordInput
        v-model="form.password"
        :label="$t('auth.password')"
        :error="errors.password"
        autocomplete="current-password"
      />
      <UiButton type="submit" block>{{ $t('auth.login.submit') }}</UiButton>
    </form>

    <p class="border-t border-border pt-4 text-center text-sm text-text">
      {{ $t('auth.login.noAccount') }}
      <button type="button" class="font-semibold text-primary-hover" @click="emit('switch')">
        {{ $t('auth.register.title') }}
      </button>
    </p>
  </div>
</template>
