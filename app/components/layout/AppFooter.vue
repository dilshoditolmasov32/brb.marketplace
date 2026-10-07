<script setup lang="ts">
const localePath = useLocalePath()

const columns = [
  {
    titleKey: 'footer.about.title',
    links: [
      { to: ROUTES.about, labelKey: 'footer.about.company' },
      { to: ROUTES.branches, labelKey: 'footer.about.branches' },
      { to: ROUTES.careers, labelKey: 'footer.about.careers' },
    ],
  },
  {
    titleKey: 'footer.users.title',
    links: [
      { to: ROUTES.contacts, labelKey: 'footer.users.contact' },
      { to: ROUTES.faq, labelKey: 'footer.users.faq' },
      { to: ROUTES.calculator, labelKey: 'footer.users.calculator' },
    ],
  },
  {
    titleKey: 'footer.partners.title',
    links: [{ to: ROUTES.partners, labelKey: 'footer.partners.become' }],
  },
]

const socialLinks = SOCIAL_LINKS.filter((link) => link.href)
const year = new Date().getFullYear()
</script>

<template>
  <footer class="bg-surface">
    <div class="container-page">
      <div class="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4 lg:py-14">
        <section v-for="column in columns" :key="column.titleKey">
          <h2 class="text-base font-semibold text-text">{{ $t(column.titleKey) }}</h2>
          <ul class="mt-3 flex flex-col">
            <li v-for="link in column.links" :key="link.to">
              <NuxtLink
                :to="localePath(link.to)"
                class="flex min-h-11 items-center text-sm text-text-secondary hover:text-text"
              >
                {{ $t(link.labelKey) }}
              </NuxtLink>
            </li>
          </ul>
        </section>

        <section>
          <AppLogo />
          <template v-if="socialLinks.length">
            <h2 class="mt-6 text-base font-semibold text-text">{{ $t('footer.social') }}</h2>
            <ul class="mt-3 flex gap-2">
              <li v-for="link in socialLinks" :key="link.name">
                <a
                  :href="link.href"
                  target="_blank"
                  rel="noopener noreferrer"
                  :aria-label="link.name"
                  class="flex size-11 items-center justify-center rounded-lg bg-surface-muted text-text hover:bg-primary-soft hover:text-primary-hover"
                >
                  <Icon :name="link.icon" size="22" />
                </a>
              </li>
            </ul>
          </template>
        </section>
      </div>

      <div
        class="flex flex-col gap-3 border-t border-border py-6 text-sm lg:flex-row lg:items-center lg:gap-6"
      >
        <NuxtLink :to="localePath(ROUTES.privacy)" class="font-medium text-text hover:text-primary">
          {{ $t('footer.privacy') }}
        </NuxtLink>
        <NuxtLink :to="localePath(ROUTES.terms)" class="font-medium text-text hover:text-primary">
          {{ $t('footer.terms') }}
        </NuxtLink>
        <p class="text-xs text-text-secondary lg:ml-auto">
          {{ $t('footer.copyright', { year }) }}
        </p>
      </div>
    </div>
  </footer>
</template>
