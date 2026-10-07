import { skipHydrate } from 'pinia'

/**
 * Shopping cart: product id -> quantity.
 * Persisted in localStorage; it holds product ids only, never personal or financial data.
 */
export const useCartStore = defineStore('cart', () => {
  // initOnMounted keeps the server render and the first client render identical.
  // skipHydrate is essential: without it Pinia restores the (empty) server state on every
  // page load and that empty value overwrites the cart saved in the browser.
  const items = skipHydrate(
    useLocalStorage<Record<string, number>>('brb-cart', {}, { initOnMounted: true }),
  )

  const count = computed(() => Object.values(items.value).reduce((sum, qty) => sum + qty, 0))
  const productIds = computed(() => Object.keys(items.value).map(Number))

  function quantityOf(productId: number): number {
    return items.value[productId] ?? 0
  }

  function has(productId: number): boolean {
    return quantityOf(productId) > 0
  }

  function setQuantity(productId: number, quantity: number) {
    if (quantity <= 0) return remove(productId)
    items.value = { ...items.value, [productId]: Math.floor(quantity) }
  }

  function add(productId: number) {
    setQuantity(productId, quantityOf(productId) + 1)
  }

  function remove(productId: number) {
    const { [productId]: _removed, ...rest } = items.value
    items.value = rest
  }

  function clear() {
    items.value = {}
  }

  return { items, count, productIds, quantityOf, has, setQuantity, add, remove, clear }
})
