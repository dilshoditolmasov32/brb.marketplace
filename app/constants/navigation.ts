/** Application routes. Always pass through localePath() before use. */
export const ROUTES = {
  home: '/',
  catalog: '/catalog',
  category: (slug: string) => `/catalog/${slug}`,
  product: (id: number | string) => `/product/${id}`,
  search: '/search',
  favorites: '/favorites',
  cart: '/cart',
  calculator: '/calculator',
  application: '/application',
  news: '/news',
  newsItem: (id: number | string) => `/news/${id}`,
  cabinet: '/cabinet',
  cabinetApplications: '/cabinet/applications',
  cabinetContracts: '/cabinet/contracts',
  cabinetProfile: '/cabinet/profile',
  cabinetNotifications: '/cabinet/notifications',
  cabinetFavorites: '/cabinet/favorites',
  cabinetSupport: '/cabinet/support',
  branches: '/branches',
  faq: '/faq',
  partners: '/partners',
  about: '/about',
  careers: '/careers',
  contacts: '/contacts',
  privacy: '/privacy',
  terms: '/terms',
} as const

/** Official social profiles. Entries without an href are not rendered. */
export const SOCIAL_LINKS: { name: string; icon: string; href: string }[] = [
  { name: 'Instagram', icon: 'lucide:instagram', href: '' },
  { name: 'Telegram', icon: 'lucide:send', href: '' },
  { name: 'Facebook', icon: 'lucide:facebook', href: '' },
  { name: 'YouTube', icon: 'lucide:youtube', href: '' },
]
