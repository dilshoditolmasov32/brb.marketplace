import type { ApiSdk } from '~/api/apiMethods'

/** Typed API SDK generated from the OpenAPI schema (see app/api-gen-2). */
export function useApi(): ApiSdk {
  return useNuxtApp().$api
}
