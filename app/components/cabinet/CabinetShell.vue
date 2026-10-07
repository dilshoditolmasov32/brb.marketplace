<script setup lang="ts">
import type { CabinetSection } from '~/constants/cabinet'

/**
 * Frame shared by every cabinet page: breadcrumbs, the sign-in gate, the navigation
 * and the page heading. The page content goes into the default slot.
 */
const props = defineProps<{
  section: CabinetSection
  /** Page heading; defaults to the section title */
  title?: string
}>()

const { t } = useI18n()
const localePath = useLocalePath()
const format = useFormat()
const auth = useAuthStore()
const authModal = useAuthModal()
const { name } = useCabinetSample()

const heading = computed(() => props.title ?? t(`cabinet.titles.${props.section}`))

// Signing out is confirmed first so a stray click does not end the session
const isSignOutOpen = ref(false)

async function signOut() {
  isSignOutOpen.value = false
  auth.signOut()
  await navigateTo(localePath(ROUTES.home))
}

// The cabinet is personal; nothing here is useful to search engines
useRobotsRule('noindex, nofollow')
useSeoMeta({ title: () => t(`cabinet.titles.${props.section}`) })
</script>

<template>
  <main class="container-page py-6 md:py-8">
    <AppBreadcrumbs
      :items="[
        { label: $t('cabinet.title'), to: section === 'overview' ? undefined : ROUTES.cabinet },
        { label: $t(`cabinet.titles.${section}`) },
      ]"
    />

    <ClientOnly>
      <UiFeedback
        v-if="!auth.isSignedIn"
        type="empty"
        class="mt-6"
        :title="$t('cabinet.guest.title')"
        :description="$t('cabinet.guest.description')"
      >
        <template #action>
          <UiButton @click="authModal.open('login')">{{ $t('header.login') }}</UiButton>
        </template>
      </UiFeedback>

      <div
        v-else
        class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[15rem_minmax(0,1fr)] lg:items-start lg:gap-6"
      >
        <CabinetNav
          class="min-w-0"
          :name="name"
          :active="section"
          @sign-out="isSignOutOpen = true"
        />

        <div class="flex min-w-0 flex-col gap-4">
          <div>
            <h1 class="text-xl font-semibold wrap-break-word text-text md:text-2xl">
              {{ heading }}
            </h1>
            <p class="mt-1 text-compact text-text-secondary">
              {{ format.date(CABINET_SAMPLE.date) }} · {{ $t('cabinet.sampleNote') }}
            </p>
          </div>
          <slot />
        </div>
      </div>

      <UiModal v-model="isSignOutOpen" :title="$t('cabinet.signOutConfirm.title')">
        {{ $t('cabinet.signOutConfirm.description') }}
        <template #actions>
          <UiButton block @click="signOut">{{ $t('cabinet.signOutConfirm.confirm') }}</UiButton>
          <UiButton block variant="ghost" @click="isSignOutOpen = false">
            {{ $t('cabinet.signOutConfirm.cancel') }}
          </UiButton>
        </template>
      </UiModal>

      <template #fallback>
        <div class="mt-6 flex flex-col gap-3" aria-busy="true">
          <UiSkeleton v-for="n in 3" :key="n" variant="list" />
        </div>
      </template>
    </ClientOnly>
  </main>
</template>
