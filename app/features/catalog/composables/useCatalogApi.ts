import type { ApiSdk } from '~/api/apiMethods'
import type { CatalogProduct, PartialProductDto } from '~/features/catalog/types'

type ProductListQuery = NonNullable<Parameters<ApiSdk['products']['list']>[0]>

export interface ProductPage {
  items: CatalogProduct[]
  /** Number of products matching the request across all pages */
  total: number
}

/** Only the fields a product card needs; keeps list responses small */
const CARD_FIELDS = 'title,price,discountPercentage,rating,stock,thumbnail,category,brand'

const toPage = (response: { products: PartialProductDto[]; total: number }): ProductPage => ({
  items: response.products.map(mapProduct),
  total: response.total,
})

/** Catalog requests that return UI-ready products (prices in so'm, installment computed). */
export function useCatalogApi() {
  const api = useApi()

  return {
    list: async (query: ProductListQuery = {}) =>
      toPage(await api.products.list({ select: CARD_FIELDS, ...query })),
    byCategory: async (slug: string, query: ProductListQuery = {}) =>
      toPage(await api.products.by_category(slug, { select: CARD_FIELDS, ...query })),
    search: async (q: string, query: ProductListQuery = {}) =>
      toPage(await api.products.search({ q, select: CARD_FIELDS, ...query })),
    product: async (id: number | string) => mapProductDetails(await api.products.retrieve(id)),
    categories: () => api.products.categories(),
  }
}

/** Category list shared by the header and the pages (fetched once per request). */
export function useCategories() {
  const catalog = useCatalogApi()
  return useAsyncData('catalog-categories', () => catalog.categories(), { default: () => [] })
}
