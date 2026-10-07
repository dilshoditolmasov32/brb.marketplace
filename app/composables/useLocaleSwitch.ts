// Long enough for the loader to be noticed when the translations are already cached
const MIN_LOADER_MS = 400

/** Switches the site language, showing the full-screen loader (AppLocaleLoader) meanwhile. */
export function useLocaleSwitch() {
  const { locale } = useI18n()
  const switchLocalePath = useSwitchLocalePath()
  const isSwitching = useState('locale-switching', () => false)

  type LocaleCode = (typeof locale)['value']

  // Switching the language is a navigation to the same page under the other locale prefix
  async function switchLocale(code: LocaleCode) {
    if (code === locale.value || isSwitching.value) return
    isSwitching.value = true
    try {
      await Promise.all([
        navigateTo(switchLocalePath(code)),
        new Promise((resolve) => setTimeout(resolve, MIN_LOADER_MS)),
      ])
    } finally {
      isSwitching.value = false
    }
  }

  return { isSwitching, switchLocale }
}
