import type { ApiSdk } from '~/api/apiMethods'

/** Typed API SDK generated from the OpenAPI schema (see app/api-gen). */
export function useApi(): ApiSdk {
  return useNuxtApp().$api
}
