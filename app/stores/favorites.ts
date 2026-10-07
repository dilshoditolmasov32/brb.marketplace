import { skipHydrate } from 'pinia'

/** Favorite product ids, persisted in localStorage (no personal data). */
export const useFavoritesStore = defineStore('favorites', () => {
  // initOnMounted keeps the server render and the first client render identical.
  // skipHydrate stops Pinia from overwriting the saved list with the empty server state.
  const ids = skipHydrate(useLocalStorage<number[]>('brb-favorites', [], { initOnMounted: true }))

  const count = computed(() => ids.value.length)

  function has(productId: number): boolean {
    return ids.value.includes(productId)
  }

  function toggle(productId: number) {
    ids.value = has(productId)
      ? ids.value.filter((id) => id !== productId)
      : [...ids.value, productId]
  }

  return { ids, count, has, toggle }
})
