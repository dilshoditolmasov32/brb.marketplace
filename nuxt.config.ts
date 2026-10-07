import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@element-plus/nuxt',
    '@nuxtjs/i18n',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/robots',
    '@nuxtjs/sitemap',
  ],

  // Layout components keep their plain names (<AppHeader />); the rest are path-prefixed (<UiButton />)
  components: [
    { path: '~/components/layout', pathPrefix: false },
    { path: '~/features', pattern: '*/components/**/*.vue', pathPrefix: false },
    '~/components',
  ],

  imports: {
    dirs: ['constants', 'features/*/composables', 'features/*/utils'],
  },

  css: ['~/assets/css/main.css'],

  // Both typefaces are self-hosted; the active one is chosen by --font-base in tokens.css
  fonts: {
    defaults: {
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
    },
    families: [
      { name: 'Inter', provider: 'google' },
      { name: 'Montserrat', provider: 'google' },
    ],
  },

  // Icons exported from the Figma file, used as <Icon name="brb:search" />
  icon: {
    customCollections: [{ prefix: 'brb', dir: './app/assets/icons' }],
  },

  // Remote hosts whose images may be optimised by Nuxt Image
  image: {
    domains: ['cdn.dummyjson.com'],
  },

  vite: {
    plugins: [tailwindcss()],
  },

  typescript: {
    strict: true,
  },

  // Values are overridden per environment via NUXT_* variables, see .env.example
  runtimeConfig: {
    public: {
      apiBase: 'https://dummyjson.com',
    },
  },

  // Used by sitemap, robots and canonical URLs.
  // The URL comes from NUXT_SITE_URL (required on staging/production, inferred in dev).
  site: {
    name: 'BRB Mikromoliya tashkiloti',
  },

  i18n: {
    // Needed for absolute hreflang and canonical links
    baseUrl: process.env.NUXT_SITE_URL || 'http://localhost:3000',
    strategy: 'prefix',
    defaultLocale: 'uz',
    locales: [
      { code: 'uz', language: 'uz-UZ', name: "O'zbekcha", file: 'uz.json' },
      { code: 'ru', language: 'ru-RU', name: 'Русский', file: 'ru.json' },
      { code: 'en', language: 'en-US', name: 'English', file: 'en.json' },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      redirectOn: 'root',
    },
  },
})
