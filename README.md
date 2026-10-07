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

Standart Nuxt papkalari, murakkab biznes logikasi bor domenlar esa `app/features/` ichida.

```text
app/
├── assets/css/     tokens.css (design tokenlar), main.css (Tailwind theme), element-plus.css
├── assets/icons/   Figma'dan eksport qilingan ikonlar: <Icon name="brb:search" />
├── components/
│   ├── ui/         UiButton, UiInput, UiSelect, UiBadge ... (biznesdan mustaqil UI)
│   ├── finance/    moliyaviy qiymat komponentlari (oylik to'lov, stavka, xulosa)
│   ├── layout/     AppHeader, AppFooter, navigatsiya
│   ├── cards/      ProductCard, NewsCard ...
│   └── sections/   sahifa bo'limlari
├── features/       catalog/, calculator/, application/, cart/, favorites/, cabinet/
├── api/            API client va resurs funksiyalari (URL'lar faqat shu yerda)
├── composables/    umumiy composable'lar
├── stores/         Pinia (faqat global state)
├── utils/          formatlash, xatolar
├── types/          umumiy tiplar
├── constants/      konstantalar
├── layouts/ middleware/ plugins/ pages/
i18n/locales/       uz.json, ru.json, en.json
server/api/         mock endpointlar (backend tayyor bo'lguncha)
tests/unit/         biznes logika testlari (kalkulyator, format, mapper)
docs/               arxitektura va biznes logika hujjatlari
```

Bog'lanish yo'nalishi: `pages → components → composables → api / features/*/utils`.

Qoidalar:

- Component ichida `$fetch` chaqirilmaydi va hisob-kitob formulasi yozilmaydi.
- Ranglar faqat design tokenlar orqali (`bg-primary`). `bg-[#e52716]` kabi yozuv ESLint xatosi.
- Matnlar faqat `$t('...')` orqali, uch tilda.
- State: local → component, feature → composable, global → Pinia.
- Maxfiy ma'lumot (pasport, PINFL, moliyaviy ma'lumot) `localStorage`, konsol va analytics'ga
  chiqarilmaydi.

Yangi feature qo'shish: `app/features/<nom>/` papkasini oching, `calculator` ni namuna sifatida oling.

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
