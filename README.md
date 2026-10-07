# BRB — mikromoliya tashkiloti veb-platformasi

Mikromoliya tashkilotining ommaviy sayti: kredit mahsulotlari, kredit kalkulyatori, onlayn ariza,
yangiliklar, filiallar. Keyinchalik shaxsiy kabinet qo'shiladi.

## Talablar

- Node.js 22+
- npm 10+

## O'rnatish

```bash
npm install
cp .env.example .env
npm run dev
```

Sayt `http://localhost:3000` da ochiladi va `/uz` ga yo'naltiradi.

## Buyruqlar

| Buyruq                 | Vazifasi                               |
| ---------------------- | -------------------------------------- |
| `npm run dev`          | Development server                     |
| `npm run build`        | Production build (`.output/`)          |
| `npm run preview`      | Build natijasini lokal ishga tushirish |
| `npm run typecheck`    | TypeScript tekshiruvi                  |
| `npm run lint`         | ESLint                                 |
| `npm run lint:fix`     | ESLint avtomatik tuzatish              |
| `npm run format`       | Prettier bilan formatlash              |
| `npm run format:check` | Format tekshiruvi (CI uchun)           |

## Environment o'zgaruvchilari

| O'zgaruvchi            | Tavsif                                                           |
| ---------------------- | ---------------------------------------------------------------- |
| `NUXT_PUBLIC_API_BASE` | API manzili. Hozircha vaqtinchalik mock: `https://dummyjson.com` |
| `NUXT_SITE_URL`        | Saytning asosiy URL'i. Staging va production'da majburiy         |

- `NUXT_PUBLIC_*` qiymatlari brauzerga yuboriladi. Maxfiy kalitlarni bu prefiks bilan yozmang.
- Haqiqiy `.env*` fayllari git'ga tushmaydi, faqat `.env.example` saqlanadi.
- Muhitlar: `.env.development`, `.env.staging`, `.env.production`. Muayyan faylni yuklash:
  `npx nuxt build --dotenv .env.staging`.

## Texnologiyalar

Nuxt 4, Vue 3, TypeScript (strict), Tailwind CSS 4, Element Plus, Pinia, VueUse, @nuxtjs/i18n,
Zod, Nuxt Image, Nuxt Icon (lucide), Nuxt Fonts, @nuxtjs/sitemap, @nuxtjs/robots.

## Arxitektura

Standart Nuxt papkalari. `pages/` faqat routing, sahifaning o'zi `components/views/` ichida.

```text
app/
├── api/            generatsiya qilingan API SDK (qo'lda tahrirlanmaydi)
├── api-gen/        SDK generatori: npm run api-gen
├── assets/css/     tokens.css (design tokenlar), main.css (Tailwind theme), element-plus.css
├── assets/icons/   Figma'dan eksport qilingan ikonlar: <Icon name="brb:search" />
├── components/
│   ├── ui/         UiButton, UiInput, UiSelect, UiBadge ... (biznesdan mustaqil UI)
│   ├── layout/     AppHeader, AppFooter, navigatsiya
│   ├── catalog/    CatalogListing, CatalogFilters, CatalogCategoryNav
│   ├── product/    ProductCard, ProductGallery
│   ├── calculator/ CreditCalculator
│   ├── finance/    FinanceSummary
│   ├── home/       bosh sahifa bo'limlari: HomeHero, HomeDeals ...
│   └── views/      sahifa darajasidagi komponentlar, pages/ tuzilishini takrorlaydi
├── composables/    useApi, useCatalogApi, useCreditCalculator ...
├── constants/      konstantalar (auto-import)
├── layouts/        default.vue
├── locales/        uz.json, ru.json, en.json
├── pages/          faqat route: har bir fayl o'z View komponentini chaqiradi
├── plugins/        Nuxt pluginlar
├── stores/         Pinia (faqat global state)
├── types/          domen tiplari
└── utils/          sof funksiyalar: formatlash, kredit hisobi, mapperlar
tests/unit/         biznes logika testlari (kalkulyator, format, mapper)
docs/               arxitektura va biznes logika hujjatlari
```

`pages/` va `components/views/` mosligi:

| Route                 | Page                       | View                                    |
| --------------------- | -------------------------- | --------------------------------------- |
| `/`                   | `pages/index.vue`          | `views/home/HomeView.vue`               |
| `/catalog`            | `pages/catalog/index.vue`  | `views/catalog/CatalogView.vue`         |
| `/catalog/[category]` | `pages/catalog/[category]` | `views/catalog/CatalogCategoryView.vue` |
| `/product/[id]`       | `pages/product/[id].vue`   | `views/product/ProductDetailView.vue`   |
| `/calculator`         | `pages/calculator.vue`     | `views/calculator/CalculatorView.vue`   |
| `/cart`               | `pages/cart.vue`           | `views/cart/CartView.vue`               |
| `/favorites`          | `pages/favorites.vue`      | `views/favorites/FavoritesView.vue`     |
| `/search`             | `pages/search.vue`         | `views/search/SearchView.vue`           |
| `/news`               | `pages/news/index.vue`     | `views/news/NewsView.vue`               |
| `/news/[id]`          | `pages/news/[id].vue`      | `views/news/NewsDetailView.vue`         |
| `/about`              | `pages/about.vue`          | `views/about/AboutView.vue`             |
| `/branches`           | `pages/branches.vue`       | `views/branches/BranchesView.vue`       |
| `/careers`            | `pages/careers.vue`        | `views/careers/CareersView.vue`         |
| `/contacts`           | `pages/contacts.vue`       | `views/contacts/ContactsView.vue`       |
| `/faq`                | `pages/faq.vue`            | `views/faq/FaqView.vue`                 |
| `/partners`           | `pages/partners.vue`       | `views/partners/PartnersView.vue`       |
| `/privacy`, `/terms`  | `pages/privacy.vue` ...    | `views/legal/LegalDocumentView.vue`     |
| `/dev/ui`             | `pages/dev/ui.vue`         | `views/dev/DevUiView.vue`               |

Bog'lanish yo'nalishi: `pages → components/views → components → composables → api / utils`.

Komponent nomi fayl nomiga teng (`ui/UiButton.vue` → `<UiButton />`), papka nomi qo'shilmaydi,
shuning uchun har bir fayl nomi to'liq va takrorlanmas bo'lishi kerak.

Qoidalar:

- Component ichida `$fetch` chaqirilmaydi va hisob-kitob formulasi yozilmaydi.
- Ranglar faqat design tokenlar orqali (`bg-primary`). `bg-[#e52716]` kabi yozuv ESLint xatosi.
- Matnlar faqat `$t('...')` orqali, uch tilda.
- State: local → component, feature → composable, global → Pinia.
- Maxfiy ma'lumot (pasport, PINFL, moliyaviy ma'lumot) `localStorage`, konsol va analytics'ga
  chiqarilmaydi.

Yangi sahifa qo'shish: `pages/` ga yupqa route fayl, `components/views/<nom>/` ga `<Nom>View.vue` yarating.

## Nomlash

| Nima       | Uslub             | Misol                    |
| ---------- | ----------------- | ------------------------ |
| Component  | PascalCase        | `ProductCard.vue`        |
| Composable | `useSomething.ts` | `useCreditCalculator.ts` |
| Util       | camelCase         | `format.ts`              |
| Type       | PascalCase        | `CreditProduct`          |
| Konstanta  | UPPER_SNAKE_CASE  | `MAX_LOAN_AMOUNT`        |

## Git workflow

- `main` — production, `develop` — integratsiya.
- Ish branch'lari: `feature/<nom>`, `fix/<nom>`, `chore/<nom>`.
- Commit xabarlari: Conventional Commits (`feat: ...`, `fix: ...`, `chore: ...`).
- PR ochishdan oldin: `npm run typecheck && npm run lint && npm run build`.
