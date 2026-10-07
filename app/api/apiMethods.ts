// Auto-generated from ./dummyjson.openapi.json
// Do not edit by hand — run `npm run api-gen` to regenerate.

import type { $Fetch, NitroFetchOptions, NitroFetchRequest } from 'nitropack'
import type { paths } from './apiMethods.types'

export const createSdk = (fetcher: $Fetch<unknown, NitroFetchRequest>) => ({
  products: {
    list: (query?: paths['/products']['get']['parameters']['query'], options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/products']['get']['responses']['200']['content']['application/json']>('/products', { method: 'GET', query, ...options }),
    search: (query: paths['/products/search']['get']['parameters']['query'], options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/products/search']['get']['responses']['200']['content']['application/json']>('/products/search', { method: 'GET', query, ...options }),
    categories: (options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/products/categories']['get']['responses']['200']['content']['application/json']>('/products/categories', { method: 'GET', ...options }),
    by_category: (slug: string | number, query?: paths['/products/category/{slug}']['get']['parameters']['query'], options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/products/category/{slug}']['get']['responses']['200']['content']['application/json']>(`/products/category/${slug}`, { method: 'GET', query, ...options }),
    retrieve: (id: string | number, options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/products/{id}']['get']['responses']['200']['content']['application/json']>(`/products/${id}`, { method: 'GET', ...options }),
  },
  posts: {
    list: (query?: paths['/posts']['get']['parameters']['query'], options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/posts']['get']['responses']['200']['content']['application/json']>('/posts', { method: 'GET', query, ...options }),
    retrieve: (id: string | number, options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/posts/{id}']['get']['responses']['200']['content']['application/json']>(`/posts/${id}`, { method: 'GET', ...options }),
  },
  carts: {
    by_user: (userId: string | number, options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/carts/user/{userId}']['get']['responses']['200']['content']['application/json']>(`/carts/user/${userId}`, { method: 'GET', ...options }),
  },
  auth: {
    login: (body: NonNullable<paths['/auth/login']['post']['requestBody']>['content']['application/json'], options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/auth/login']['post']['responses']['200']['content']['application/json']>('/auth/login', { method: 'POST', body, ...options }),
    me: (options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/auth/me']['get']['responses']['200']['content']['application/json']>('/auth/me', { method: 'GET', ...options }),
    refresh: (body: NonNullable<paths['/auth/refresh']['post']['requestBody']>['content']['application/json'], options?: NitroFetchOptions<NitroFetchRequest>) => fetcher<paths['/auth/refresh']['post']['responses']['200']['content']['application/json']>('/auth/refresh', { method: 'POST', body, ...options }),
  },
})

export type ApiSdk = ReturnType<typeof createSdk>

// SDK method metadata: HTTP verb and the number of own arguments (without options)
export const sdkMethodMeta = {
  "products": {
    "list": {
      "verb": "get",
      "args": 1
    },
    "search": {
      "verb": "get",
      "args": 1
    },
    "categories": {
      "verb": "get",
      "args": 0
    },
    "by_category": {
      "verb": "get",
      "args": 2
    },
    "retrieve": {
      "verb": "get",
      "args": 1
    }
  },
  "posts": {
    "list": {
      "verb": "get",
      "args": 1
    },
    "retrieve": {
      "verb": "get",
      "args": 1
    }
  },
  "carts": {
    "by_user": {
      "verb": "get",
      "args": 1
    }
  },
  "auth": {
    "login": {
      "verb": "post",
      "args": 1
    },
    "me": {
      "verb": "get",
      "args": 0
    },
    "refresh": {
      "verb": "post",
      "args": 1
    }
  }
} as const
