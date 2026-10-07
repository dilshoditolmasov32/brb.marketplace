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

  // A component is named after its file (ui/UiButton.vue -> <UiButton />), never after its folder
  components: [{ path: '~/components', pathPrefix: false }],

  imports: {
    dirs: ['constants'],
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

  // Nuxt 4.6 on Windows: Nitro sees the renderer under a backslash path, misses its own
  // "nuxt/dist" inline rule and externalises it, so dev SSR fails with
  // "Either manifest or precomputed data must be provided"
  nitro: {
    externals: {
      inline: [/[\\/]nuxt[\\/]dist[\\/]/],
    },
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
    // Translations live in app/locales
    restructureDir: 'app',
    langDir: 'locales',
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
