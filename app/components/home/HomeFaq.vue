<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const openKey = ref<string | null>(HOME_FAQ_ITEMS[0])

const items = computed(() =>
  HOME_FAQ_ITEMS.map((key) => ({
    key,
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  })),
)

useFaqStructuredData(items)
</script>

<template>
  <section class="py-10 md:py-14">
    <div class="container-page">
      <div class="text-center">
        <h2 class="text-xl font-semibold text-text md:text-2xl">{{ $t('home.faq.title') }}</h2>
        <p class="mt-1 text-sm text-text-secondary">{{ $t('home.faq.subtitle') }}</p>
      </div>
      <div class="mt-8 flex flex-col gap-2">
        <UiAccordion
          v-for="item in items"
          :key="item.key"
          :title="item.question"
          :open="openKey === item.key"
          @update:open="openKey = $event ? item.key : null"
        >
          {{ item.answer }}
        </UiAccordion>
      </div>
      <div class="mt-8 flex justify-center">
        <UiButton variant="outline" :to="localePath(ROUTES.faq)">
          {{ $t('common.viewAll') }}
        </UiButton>
      </div>
    </div>
  </section>
</template>
