<script setup lang="ts">
import type { CabinetSection } from '~/constants/cabinet'

/** Cabinet navigation: a sidebar card on desktop, a scrollable row of tabs below it. */
const props = defineProps<{
  /** Customer name as shown in the cabinet */
  name: string
  active: CabinetSection
}>()

const emit = defineEmits<{ signOut: [] }>()

const localePath = useLocalePath()

// The tab row scrolls sideways on small screens: keep the current section in view
const tabs = useTemplateRef<HTMLUListElement>('tabs')

onMounted(() => {
  const list = tabs.value
  const current = list?.querySelector<HTMLElement>('[aria-current="page"]')
  if (!list || !current) return
  list.scrollLeft = current.offsetLeft - (list.clientWidth - current.offsetWidth) / 2
})

const initials = computed(() =>
  props.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join(''),
)
</script>

<template>
  <nav :aria-label="$t('cabinet.nav.label')">
    <!-- Desktop sidebar -->
    <div class="hidden flex-col gap-4 rounded-lg border border-border bg-surface p-4 lg:flex">
      <div class="flex flex-col gap-2">
        <span
          class="flex size-10 items-center justify-center rounded-full bg-surface-muted text-sm font-semibold text-text"
          aria-hidden="true"
        >
          {{ initials }}
        </span>
        <p class="text-sm font-semibold text-text">{{ name }}</p>
        <p class="text-2xs text-text-secondary">{{ $t('cabinet.sampleCustomer') }}</p>
      </div>
      <ul class="flex flex-col gap-1">
        <li v-for="item in CABINET_NAV" :key="item.key">
          <NuxtLink
            :to="localePath(item.to)"
            class="flex min-h-10 items-center rounded-sm px-3 text-compact font-medium"
            :class="
              item.key === active
                ? 'bg-primary-soft text-primary-hover'
                : 'text-text hover:bg-surface-muted'
            "
            :aria-current="item.key === active ? 'page' : undefined"
          >
            {{ $t(`cabinet.nav.${item.key}`) }}
          </NuxtLink>
        </li>
      </ul>
      <div class="border-t border-border pt-3">
        <button
          type="button"
          class="flex min-h-10 w-full items-center gap-1 rounded-sm px-3 text-compact text-text-secondary transition-colors hover:bg-primary hover:text-on-primary"
          @click="emit('signOut')"
        >
          {{ $t('cabinet.signOut') }}
          <Icon name="lucide:arrow-right" size="14" />
        </button>
      </div>
    </div>

    <!-- Tablet and mobile tabs -->
    <ul
      ref="tabs"
      class="relative flex gap-1 overflow-x-auto rounded-lg border border-border bg-surface p-1 text-compact whitespace-nowrap scrollbar-none lg:hidden [&::-webkit-scrollbar]:hidden"
    >
      <li v-for="item in CABINET_NAV" :key="item.key" class="shrink-0">
        <NuxtLink
          :to="localePath(item.to)"
          class="flex min-h-10 items-center rounded-sm px-3 font-medium sm:px-4"
          :class="item.key === active ? 'bg-primary-soft text-primary-hover' : 'text-text'"
          :aria-current="item.key === active ? 'page' : undefined"
        >
          {{ $t(`cabinet.nav.${item.key}`) }}
        </NuxtLink>
      </li>
      <li class="shrink-0">
        <button
          type="button"
          class="flex min-h-10 items-center rounded-sm px-3 text-text-secondary sm:px-4 transition-colors hover:bg-primary hover:text-on-primary"
          @click="emit('signOut')"
        >
          {{ $t('cabinet.signOut') }}
        </button>
      </li>
    </ul>
  </nav>
</template>
