import { StorageSerializers } from '@vueuse/core'
import { skipHydrate } from 'pinia'

export interface DemoUser {
  /** Missing after a sign-in, where only the phone number is entered */
  fullName: string | null
}

/**
 * Demonstration session used until the backend is connected: signing in only remembers
 * the display name. No phone number, password or token is stored.
 */
export const useAuthStore = defineStore('auth', () => {
  // initOnMounted keeps the server render and the first client render identical.
  // skipHydrate stops Pinia from overwriting the saved session with the empty server state.
  const user = skipHydrate(
    useLocalStorage<DemoUser | null>('brb-demo-user', null, {
      initOnMounted: true,
      serializer: StorageSerializers.object,
    }),
  )

  const isSignedIn = computed(() => user.value !== null)

  function signIn(fullName?: string) {
    user.value = { fullName: fullName?.trim() || null }
  }

  function signOut() {
    user.value = null
  }

  return { user, isSignedIn, signIn, signOut }
})
