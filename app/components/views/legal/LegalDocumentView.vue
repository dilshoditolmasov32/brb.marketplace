<script setup lang="ts">
/**
 * Legal document page (privacy policy, terms of use): numbered sections with a table of
 * contents. The wording is a placeholder until the legal team supplies the final text.
 */
const props = defineProps<{ document: LegalDocument }>()

const { t } = useI18n()

const title = computed(() => t(`legal.${props.document}.title`))
const description = computed(() => t(`legal.${props.document}.intro`))

const sections = computed(() =>
  LEGAL_SECTIONS[props.document].map((key, index) => ({
    id: `section-${key}`,
    title: `${index + 1}. ${t(`legal.${props.document}.sections.${key}.title`)}`,
    body: t(`legal.${props.document}.sections.${key}.body`),
  })),
)

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: title }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ title }}</h1>
    <p class="mt-1 max-w-3xl text-sm text-text-secondary">{{ description }}</p>

    <UiAlert tone="warning" class="mt-6" :title="$t('legal.sample.title')">
      {{ $t('legal.sample.description') }}
    </UiAlert>

    <div class="mt-6 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
      <nav
        :aria-label="$t('legal.contents')"
        class="rounded-lg border border-border bg-surface p-4 lg:sticky lg:top-44"
      >
        <h2 class="text-sm font-semibold text-text">{{ $t('legal.contents') }}</h2>
        <ol class="mt-2 flex flex-col">
          <li v-for="section in sections" :key="section.id">
            <NuxtLink
              :to="{ hash: `#${section.id}` }"
              class="flex min-h-9 items-center text-compact text-text-secondary hover:text-text"
            >
              {{ section.title }}
            </NuxtLink>
          </li>
        </ol>
      </nav>

      <article class="flex flex-col gap-6 rounded-lg border border-border bg-surface p-4 md:p-6">
        <section
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="scroll-mt-48"
        >
          <h2 class="text-base font-semibold text-text">{{ section.title }}</h2>
          <p class="mt-2 text-sm text-text-secondary">{{ section.body }}</p>
        </section>
      </article>
    </div>
  </main>
</template>
