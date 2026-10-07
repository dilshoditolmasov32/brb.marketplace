const SEND_DELAY_MS = 1200

/**
 * Behaviour shared by the demonstration request forms (contacts, partners, careers).
 * Validation is client-side only and nothing is sent anywhere yet: submitting plays a
 * short stand-in "sending" state and then shows the confirmation.
 * Error texts: forms.errors.<field>
 */
export function useSampleForm<T extends object, F extends string>(
  createInitial: () => T,
  validators: Record<F, (data: T) => boolean>,
) {
  const { t } = useI18n()

  const form = ref(createInitial()) as Ref<T>

  // Errors appear after the first submit attempt and then follow the input live
  const wasSubmitted = ref(false)
  const isSending = ref(false)
  const isSent = ref(false)
  let sendTimer: ReturnType<typeof setTimeout> | undefined

  const errors = computed(() => {
    const result: Partial<Record<F, string>> = {}
    if (!wasSubmitted.value) return result
    for (const field of Object.keys(validators) as F[]) {
      if (!validators[field](form.value)) result[field] = t(`forms.errors.${field}`)
    }
    return result
  })

  function submit() {
    wasSubmitted.value = true
    if (Object.keys(errors.value).length || isSending.value) return
    isSending.value = true
    sendTimer = setTimeout(() => {
      isSending.value = false
      isSent.value = true
    }, SEND_DELAY_MS)
  }

  /** Back to an empty form after the confirmation */
  function reset() {
    form.value = createInitial()
    wasSubmitted.value = false
    isSent.value = false
  }

  onBeforeUnmount(() => clearTimeout(sendTimer))

  return { form, errors, isSending, isSent, submit, reset }
}
