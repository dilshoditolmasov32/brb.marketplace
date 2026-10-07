<script setup lang="ts">
const FAQ_KEYS = ['documents', 'limits', 'accuracy', 'early', 'returns'] as const

const { t } = useI18n()

const openKey = ref<string | null>(FAQ_KEYS[0])

const items = computed(() =>
  FAQ_KEYS.map((key) => ({
    key,
    question: t(`home.faq.items.${key}.question`),
    answer: t(`home.faq.items.${key}.answer`),
  })),
)

// Structured data so search engines can show the questions directly
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: () =>
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.value.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: { '@type': 'Answer', text: item.answer },
          })),
        }),
    },
  ],
})
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
    </div>
  </section>
</template>
