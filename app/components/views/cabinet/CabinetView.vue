<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()
const format = useFormat()
const { name, product, recommended, loan } = useCabinetSample()

const firstName = computed(() => name.value.split(/\s+/)[0] ?? name.value)

const unreadCount = CABINET_NOTIFICATIONS.filter((item) => item.unread).length
const latestNotification = CABINET_NOTIFICATIONS[0]

const stats = computed(() => [
  { label: t('cabinet.stats.contracts'), value: CABINET_SAMPLE.activeContracts },
  { label: t('cabinet.stats.payments'), value: DEFAULT_TERM_MONTHS },
  { label: t('cabinet.stats.messages'), value: unreadCount },
])
</script>

<template>
  <CabinetShell section="overview" :title="$t('cabinet.greeting', { name: firstName })">
    <dl class="grid gap-3 sm:grid-cols-3">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4"
      >
        <dt class="text-compact text-text-secondary">{{ stat.label }}</dt>
        <dd class="text-xl font-semibold text-text tabular-nums">{{ stat.value }}</dd>
      </div>
    </dl>

    <template v-if="product">
      <ApplicationProductList :items="[{ product, quantity: 1 }]" />

      <div class="grid gap-4 md:grid-cols-2">
        <CabinetCard :title="$t('cabinet.payment.title')">
          <UiBadge tone="success" class="self-start">{{ $t('cabinet.payment.status') }}</UiBadge>
          <p class="text-2xl font-semibold text-text tabular-nums">
            {{ format.currency(loan.monthlyPayment) }}
          </p>
          <p class="text-2xs text-text-secondary">
            {{ format.date(CABINET_SAMPLE.nextPaymentDate) }} · {{ $t('cabinet.payment.first') }}
          </p>
          <dl class="flex flex-col text-compact">
            <div class="flex justify-between gap-4 border-t border-border py-2">
              <dt class="text-text-secondary">{{ $t('cabinet.payment.contract') }}</dt>
              <dd class="font-semibold text-text">{{ CABINET_SAMPLE.contractNumber }}</dd>
            </div>
            <div class="flex justify-between gap-4 border-t border-border py-2">
              <dt class="text-text-secondary">{{ $t('cabinet.payment.remaining') }}</dt>
              <dd class="font-semibold text-text tabular-nums">
                {{ format.currency(loan.totalPayment) }}
              </dd>
            </div>
          </dl>
          <UiButton block class="mt-auto" :to="localePath(ROUTES.cabinetContracts)">
            {{ $t('cabinet.payment.schedule') }}
          </UiButton>
        </CabinetCard>

        <CabinetCard :title="$t('cabinet.application.title')">
          <UiBadge tone="success" class="self-start">
            {{ $t('cabinet.application.status') }}
          </UiBadge>
          <p class="text-lg font-semibold text-text">{{ CABINET_SAMPLE.applicationNumber }}</p>
          <p class="text-compact text-text">{{ product.title }}</p>
          <p class="text-2xs text-text-secondary">
            {{ format.date(CABINET_SAMPLE.date) }} · {{ $t('cabinet.application.note') }}
          </p>
          <UiButton
            block
            variant="outline"
            class="mt-auto"
            :to="localePath(ROUTES.cabinetApplications)"
          >
            {{ $t('cabinet.application.view') }}
          </UiButton>
        </CabinetCard>
      </div>
    </template>

    <section class="flex flex-col gap-3">
      <h2 class="text-base font-semibold text-text">{{ $t('cabinet.overview.latest') }}</h2>
      <CabinetNotificationItem :item="latestNotification" />
    </section>

    <div class="grid gap-3 sm:grid-cols-3">
      <UiButton variant="outline" block :to="localePath(ROUTES.cabinetProfile)">
        {{ $t('cabinet.nav.profile') }}
      </UiButton>
      <UiButton variant="outline" block :to="localePath(ROUTES.cabinetFavorites)">
        {{ $t('cabinet.titles.favorites') }}
      </UiButton>
      <UiButton variant="outline" block :to="localePath(ROUTES.cabinetSupport)">
        {{ $t('cabinet.overview.support') }}
      </UiButton>
    </div>

    <section v-if="recommended.length" class="flex flex-col gap-3">
      <h2 class="text-base font-semibold text-text">{{ $t('cabinet.overview.recommended') }}</h2>
      <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3">
        <li v-for="item in recommended" :key="item.id">
          <ProductCard :product="item" class="h-full" />
        </li>
      </ul>
    </section>
  </CabinetShell>
</template>
