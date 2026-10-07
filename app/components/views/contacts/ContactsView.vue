<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const channels = computed(() => [
  {
    key: 'phone',
    icon: 'lucide:phone',
    value: COMPANY_SAMPLE.phone,
    href: toTelHref(COMPANY_SAMPLE.phone),
    note: t('contacts.channels.phone.note'),
  },
  {
    key: 'email',
    icon: 'lucide:mail',
    value: COMPANY_SAMPLE.email,
    href: `mailto:${COMPANY_SAMPLE.email}`,
    note: t('contacts.channels.email.note'),
  },
  {
    key: 'office',
    icon: 'lucide:map-pin',
    value: t('contacts.channels.office.value'),
    href: undefined,
    note: t('contacts.channels.office.note'),
  },
  {
    key: 'hours',
    icon: 'lucide:clock',
    value: t('branches.hoursValue'),
    href: undefined,
    note: t('contacts.channels.hours.note'),
  },
])

const links = [
  { key: 'faq', icon: 'lucide:circle-help', to: ROUTES.faq },
  { key: 'branches', icon: 'lucide:building-2', to: ROUTES.branches },
  { key: 'cabinet', icon: 'lucide:user', to: ROUTES.cabinetSupport },
] as const

const socialLinks = SOCIAL_LINKS.filter((link) => link.href)

useSeoMeta({
  title: () => t('contacts.title'),
  description: () => t('contacts.seo.description'),
  ogTitle: () => t('contacts.title'),
  ogDescription: () => t('contacts.seo.description'),
})
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs :items="[{ label: $t('contacts.title') }]" />
    <h1 class="mt-3 text-2xl font-semibold text-text">{{ $t('contacts.title') }}</h1>
    <p class="mt-1 text-sm text-text-secondary">{{ $t('contacts.subtitle') }}</p>

    <ul class="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      <li
        v-for="channel in channels"
        :key="channel.key"
        class="flex flex-col gap-2 rounded-lg border border-border bg-surface p-4 md:p-5"
      >
        <span
          class="flex size-10 items-center justify-center rounded-full bg-primary-soft text-primary-hover"
          aria-hidden="true"
        >
          <Icon :name="channel.icon" size="20" />
        </span>
        <h2 class="text-compact text-text-secondary">
          {{ $t(`contacts.channels.${channel.key}.title`) }}
        </h2>
        <a
          v-if="channel.href"
          :href="channel.href"
          class="text-base font-semibold break-words text-text hover:text-primary"
        >
          {{ channel.value }}
        </a>
        <p v-else class="text-base font-semibold text-text">{{ channel.value }}</p>
        <p class="text-2xs text-text-secondary">{{ channel.note }}</p>
      </li>
    </ul>
    <p class="mt-2 text-2xs text-text-secondary">{{ $t('common.sampleData') }}</p>

    <div class="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <ContactsFeedbackForm />

      <aside class="flex flex-col gap-3">
        <h2 class="text-lg font-semibold text-text">{{ $t('contacts.links.title') }}</h2>
        <ul class="flex flex-col gap-3">
          <li v-for="link in links" :key="link.key">
            <NuxtLink
              :to="localePath(link.to)"
              class="flex items-center gap-3 rounded-lg border border-border bg-surface p-4 transition hover:border-primary"
            >
              <Icon :name="link.icon" size="20" class="shrink-0 text-text-secondary" />
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold text-text">
                  {{ $t(`contacts.links.${link.key}.title`) }}
                </span>
                <span class="block text-compact text-text-secondary">
                  {{ $t(`contacts.links.${link.key}.description`) }}
                </span>
              </span>
              <Icon name="lucide:chevron-right" size="18" class="shrink-0 text-text-secondary" />
            </NuxtLink>
          </li>
        </ul>

        <template v-if="socialLinks.length">
          <h2 class="mt-3 text-lg font-semibold text-text">{{ $t('footer.social') }}</h2>
          <ul class="flex gap-2">
            <li v-for="link in socialLinks" :key="link.name">
              <a
                :href="link.href"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="link.name"
                class="flex size-11 items-center justify-center rounded-lg bg-surface text-text hover:bg-primary-soft hover:text-primary-hover"
              >
                <Icon :name="link.icon" size="22" />
              </a>
            </li>
          </ul>
        </template>
      </aside>
    </div>
  </main>
</template>
