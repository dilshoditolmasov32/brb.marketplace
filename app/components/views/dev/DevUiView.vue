<script setup lang="ts">
// Development-only preview of the UI primitives. Not available in production.
if (!import.meta.dev) {
  throw createError({ statusCode: 404, fatal: true })
}

useRobotsRule('noindex, nofollow')

const name = ref('Aziza Karimova')
const empty = ref('')
const purpose = ref<string>('personal')
const noPurpose = ref<string>()
const purposes = [
  { label: 'Shaxsiy ehtiyojlar', value: 'personal' },
  { label: 'Ta’lim', value: 'education' },
  { label: 'Tadbirkorlik', value: 'business' },
]

const checked = ref(true)
const unchecked = ref(false)
const term = ref(12)
const switchOn = ref(true)
const switchOff = ref(false)
const tab = ref('popular')
const tabs = [
  { label: 'Ommabop', value: 'popular' },
  { label: 'Yangiliklar', value: 'new' },
  { label: 'Tavsiya etilgan', value: 'recommended' },
]
const faqOpen = ref(true)
const modalOpen = ref(false)
const drawerOpen = ref(false)

const font = ref<'inter' | 'montserrat'>('inter')
watchEffect(() => {
  if (import.meta.client) {
    document.documentElement.style.setProperty('--font-base', `var(--font-${font.value})`)
  }
})
</script>

<template>
  <main class="container-page flex flex-col gap-10 py-10">
    <header class="flex flex-wrap items-center justify-between gap-4">
      <h1 class="text-3xl font-semibold">UI primitives</h1>
      <div class="flex gap-2">
        <UiButton
          size="sm"
          :variant="font === 'inter' ? 'primary' : 'outline'"
          @click="font = 'inter'"
        >
          Inter
        </UiButton>
        <UiButton
          size="sm"
          :variant="font === 'montserrat' ? 'primary' : 'outline'"
          @click="font = 'montserrat'"
        >
          Montserrat
        </UiButton>
      </div>
    </header>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Button</h2>
      <div class="flex flex-wrap items-center gap-4">
        <UiButton>Ariza yuborish</UiButton>
        <UiButton variant="secondary">Ariza yuborish</UiButton>
        <UiButton variant="outline">Batafsil</UiButton>
        <UiButton variant="ghost">Bekor qilish</UiButton>
        <UiButton disabled>Ariza yuborish</UiButton>
        <UiButton loading>Yuborilmoqda</UiButton>
        <UiButton variant="outline" loading>Yuborilmoqda</UiButton>
      </div>
      <div class="flex flex-wrap items-center gap-4">
        <UiButton size="sm">Savatga</UiButton>
        <UiButton size="md">Ariza yuborish</UiButton>
        <UiButton size="lg">Ariza yuborish</UiButton>
      </div>
      <div class="max-w-xs">
        <UiButton block>Savatga qo‘shish</UiButton>
      </div>
    </section>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Input</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UiInput v-model="name" label="Ism va familiya" hint="Ma’lumotni kiriting" />
        <UiInput
          v-model="empty"
          label="Telefon raqami"
          type="tel"
          placeholder="+998 90 123 45 67"
          required
        />
        <UiInput v-model="empty" label="Ism va familiya" error="Ism va familiyani kiriting." />
        <UiInput v-model="name" label="Ism va familiya" hint="Ma’lumotni kiriting" disabled />
        <UiInput v-model="empty" label="Mahsulot narxi" type="number" placeholder="12 000 000">
          <template #suffix><span class="text-xs text-text-secondary">UZS</span></template>
        </UiInput>
        <UiInput
          v-model="empty"
          type="search"
          placeholder="Mahsulot yoki brend qidiring..."
          aria-label="Qidiruv"
        >
          <template #prefix><Icon name="brb:search" size="18" /></template>
        </UiInput>
      </div>
    </section>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Select</h2>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <UiSelect
          v-model="purpose"
          :options="purposes"
          label="Kredit maqsadi"
          hint="Bitta variantni tanlang"
        />
        <UiSelect
          v-model="noPurpose"
          :options="purposes"
          label="Kredit maqsadi"
          placeholder="Tanlang"
          error="Kredit maqsadini tanlang."
        />
        <UiSelect
          v-model="purpose"
          :options="purposes"
          label="Kredit maqsadi"
          hint="Bitta variantni tanlang"
          disabled
        />
      </div>
    </section>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Checkbox / Radio / Switch</h2>
      <div class="grid gap-6 md:grid-cols-3">
        <div>
          <UiCheckbox v-model="checked" label="Smartfonlar" />
          <UiCheckbox v-model="unchecked" label="Planshetlar" />
          <UiCheckbox :model-value="true" label="Aksessuarlar" disabled />
        </div>
        <div>
          <UiRadio v-model="term" name="term" :value="6" label="6 oy" />
          <UiRadio v-model="term" name="term" :value="12" label="12 oy" />
          <UiRadio v-model="term" name="term" :value="24" label="24 oy" disabled />
        </div>
        <div>
          <UiSwitch v-model="switchOn" label="Nasiya mavjud" />
          <UiSwitch v-model="switchOff" label="0% foizli" label-position="start" />
          <UiSwitch :model-value="false" label="Mavjud emas" disabled />
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Tabs / Alert / Accordion</h2>
      <UiTabs v-model="tab" :tabs="tabs" label="Mahsulotlar" />
      <UiAlert title="0% foiz bilan nasiya" dismissible>
        Tanlangan mahsulotlarda 12 oygacha 0% foiz bilan nasiya xarid imkoniyati. Namuna shartlar.
      </UiAlert>
      <UiAlert tone="success" title="Ariza qabul qilindi">Javob SMS orqali yuboriladi.</UiAlert>
      <UiAlert tone="warning" title="Hujjat tekshirilmoqda">Bu biroz vaqt olishi mumkin.</UiAlert>
      <UiAlert tone="error" title="Yuborib bo‘lmadi">Qayta urinib ko‘ring.</UiAlert>
      <UiAccordion v-model:open="faqOpen" title="Nasiya olish uchun qanday hujjatlar kerak?">
        Passport nusxasi, telefon raqami va ariza to‘ldirish kifoya.
      </UiAccordion>
      <UiAccordion title="Minimal va maksimal nasiya summasi qancha?">Namuna javob.</UiAccordion>
    </section>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Feedback / Skeleton</h2>
      <div class="grid gap-6 md:grid-cols-3">
        <UiFeedback type="loading" title="Yuklanmoqda..." description="Bir oz kuting." />
        <UiFeedback
          type="empty"
          title="Hozircha ma’lumot yo‘q"
          description="Hisob-kitoblar shu yerda ko‘rinadi."
        >
          <template #action><UiButton variant="outline">Hisoblash</UiButton></template>
        </UiFeedback>
        <UiFeedback
          type="error"
          title="Ma’lumot yuklanmadi"
          description="Ulanishni tekshirib, qayta urinib ko‘ring."
        >
          <template #action><UiButton variant="outline">Qayta urinish</UiButton></template>
        </UiFeedback>
      </div>
      <div class="grid gap-6 md:grid-cols-2">
        <UiSkeleton variant="card" />
        <UiSkeleton variant="list" />
      </div>
    </section>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Modal / Drawer</h2>
      <div class="flex flex-wrap gap-4">
        <UiButton variant="outline" @click="modalOpen = true">Modal</UiButton>
        <UiButton variant="outline" @click="drawerOpen = true">Drawer</UiButton>
      </div>
      <UiModal v-model="modalOpen" title="Arizani tasdiqlash">
        Ma’lumotlaringiz to‘g‘riligini tasdiqlang. Bu namuna ariza, haqiqiy murojaat emas.
        <template #actions>
          <UiButton block @click="modalOpen = false">Tasdiqlash</UiButton>
          <UiButton block variant="ghost" @click="modalOpen = false">Bekor qilish</UiButton>
        </template>
      </UiModal>
      <UiDrawer v-model="drawerOpen" title="Kredit ma’lumotlari">
        12 000 000 UZS · 24% yillik · 12 oy. Ushbu qiymatlar faqat namuna uchun.
        <template #actions>
          <UiButton block @click="drawerOpen = false">Yopish</UiButton>
          <UiButton block variant="ghost" @click="drawerOpen = false">Bekor qilish</UiButton>
        </template>
      </UiDrawer>
    </section>

    <section class="flex flex-col gap-4 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Badge</h2>
      <div class="flex flex-wrap gap-3">
        <UiBadge>Mashhur</UiBadge>
        <UiBadge tone="brand">Nasiya</UiBadge>
        <UiBadge tone="success">Yangi</UiBadge>
        <UiBadge tone="warning">Top</UiBadge>
        <UiBadge tone="error">-15%</UiBadge>
      </div>
    </section>

    <section class="flex flex-col gap-2 rounded-xl border border-border bg-surface p-6">
      <h2 class="text-xl font-semibold">Typography</h2>
      <p class="text-4xl font-semibold">Moliyaviy imkoniyatlar</p>
      <p class="text-3xl font-semibold">Ishonchli moliyaviy yechim</p>
      <p class="text-2xl font-semibold">Kredit shartlari</p>
      <p class="text-xl font-semibold">Условия микрокредита</p>
      <p class="text-base">Choose a payment term that works for you.</p>
      <p class="text-sm font-medium">Oylik to‘lov · Ежемесячный платёж · Ў Ғ Қ Ҳ</p>
      <p class="text-xs text-text-secondary">Namuna hisob-kitob. Haqiqiy taklif emas.</p>
      <p class="text-2xl font-semibold tabular-nums">1 134 715 UZS</p>
    </section>
  </main>
</template>
