<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

type GroupFilter = FaqGroup | 'all'

const group = ref<GroupFilter>('all')
const query = ref('')
const openKey = ref<string | null>(null)

const tabs = computed<{ value: GroupFilter; label: string }[]>(() => [
  { value: 'all', label: t('faq.groups.all') },
  ...FAQ_GROUPS.map(({ key }) => ({ value: key, label: t(`faq.groups.${key}`) })),
])

const groups = computed(() =>
  FAQ_GROUPS.map(({ key, items }) => ({
    key,
    title: t(`faq.groups.${key}`),
    items: items.map((item) => ({
      key: item,
      question: t(`faq.items.${item}.question`),
      answer: t(`faq.items.${item}.answer`),
    })),
  })),
)

// Topic and search narrow the same list; a topic left without matches is hidden
const visibleGroups = computed(() => {
  const needle = query.value.trim().toLowerCase()
  return groups.value
    .filter(({ key }) => group.value === 'all' || key === group.value)
    .map((item) => ({
      ...item,
      items: item.items.filter(
        ({ question, answer }) =>
          !needle ||
          question.toLowerCase().includes(needle) ||
          answer.toLowerCase().includes(needle),
      ),
    }))
    .filter(({ items }) => items.length)
})

// Search engines get every question, whatever is filtered on screen
useFaqStructuredData(() => groups.value.flatMap(({ items }) => items))

useSeoMeta({
  title: () => t('faq.title'),
  description: () => t('faq.seo.description'),
  ogTitle: () => t('faq.title'),
  ogDescription: () => t('faq.seo.description'),
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('faq.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('faq.title') }}</h1>
    <p class="mt-1 text-sm text-text-secondary">{{ $t('faq.subtitle') }}</p>

    <!-- UiInput forwards its attributes to the inner <input>, so the layout classes sit on a wrapper -->
    <div class="mt-6 max-w-xl">
      <UiInput
        v-model="query"
        type="search"
        :label="$t('faq.search')"
        :placeholder="$t('faq.searchPlaceholder')"
        autocomplete="off"
      >
        <template #prefix>
          <Icon name="brb:search" size="18" class="shrink-0 text-text-secondary" />
        </template>
      </UiInput>
    </div>

    <UiTabs v-model="group" class="mt-6" :tabs="tabs" :label="$t('faq.groupsLabel')" />

    <UiFeedback
      v-if="!visibleGroups.length"
      type="empty"
      class="mt-6"
      :title="$t('faq.empty.title')"
      :description="$t('faq.empty.description')"
    >
      <template #action>
        <UiButton variant="outline" @click="((query = ''), (group = 'all'))">
          {{ $t('catalog.chips.clearAll') }}
        </UiButton>
      </template>
    </UiFeedback>

    <section v-for="item in visibleGroups" :key="item.key" class="mt-8">
      <h2 class="text-lg font-semibold text-text">{{ item.title }}</h2>
      <div class="mt-3 flex flex-col gap-2">
        <UiAccordion
          v-for="entry in item.items"
          :key="entry.key"
          :title="entry.question"
          :open="openKey === entry.key"
          @update:open="openKey = $event ? entry.key : null"
        >
          {{ entry.answer }}
        </UiAccordion>
      </div>
    </section>

    <section
      class="mt-10 flex flex-col gap-4 rounded-lg bg-primary-soft p-4 md:flex-row md:items-center md:justify-between md:p-6"
    >
      <div>
        <h2 class="text-lg font-semibold text-text">{{ $t('faq.contact.title') }}</h2>
        <p class="mt-1 text-compact text-text-secondary">{{ $t('faq.contact.description') }}</p>
      </div>
      <UiButton class="shrink-0" :to="localePath(ROUTES.contacts)">
        {{ $t('footer.users.contact') }}
      </UiButton>
    </section>
  </main>
</template>
