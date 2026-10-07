export type AuthModalMode = 'login' | 'register'

/** Opens and closes the sign-in / registration dialog from anywhere in the app. */
export function useAuthModal() {
  // null while the dialog is closed
  const mode = useState<AuthModalMode | null>('auth-modal', () => null)

  return {
    mode,
    open: (next: AuthModalMode) => (mode.value = next),
    close: () => (mode.value = null),
  }
}
