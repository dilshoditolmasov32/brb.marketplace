import type { ProductDetails } from '~/features/catalog/types'

/**
 * Loads the products behind a list of ids kept in the browser (cart, favorites).
 * Client-only: the ids live in localStorage, so the server cannot know them.
 * A product that fails to load (for example, it was removed) is skipped.
 */
export function useProductsByIds(key: string, ids: Ref<number[]>) {
  const catalog = useCatalogApi()

  return useLazyAsyncData(
    key,
    async () => {
      const results = await Promise.allSettled(ids.value.map((id) => catalog.product(id)))
      return results
        .filter((result): result is PromiseFulfilledResult<ProductDetails> => {
          return result.status === 'fulfilled'
        })
        .map((result) => result.value)
    },
    {
      server: false,
      default: () => [] as ProductDetails[],
      // Reload only when the set of ids changes, not on every quantity change
      watch: [() => [...ids.value].sort((a, b) => a - b).join(',')],
    },
  )
}
