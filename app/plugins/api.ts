import { createSdk } from '~/api/apiMethods'

/**
 * Provides the generated API SDK to the whole app.
 * Usage: `const api = useApi()` — never call $fetch with a URL from a component.
 */
export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  const apiFetch = $fetch.create({
    baseURL: config.public.apiBase,
    timeout: 15_000,
    onRequest({ options }) {
      // Read per request so a language switch is picked up immediately
      const locale = unref((nuxtApp.$i18n as { locale?: MaybeRef<string> } | undefined)?.locale)
      if (locale && !options.headers.has('Accept-Language')) {
        options.headers.set('Accept-Language', locale)
      }
    },
  })

  return {
    provide: { api: createSdk(apiFetch) },
  }
})
