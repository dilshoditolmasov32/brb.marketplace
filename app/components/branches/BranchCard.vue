<script setup lang="ts">
defineProps<{ branch: Branch }>()
</script>

<template>
  <article class="flex h-full flex-col gap-3 rounded-lg border border-border bg-surface p-4 md:p-5">
    <div class="flex items-start justify-between gap-3">
      <h2 class="text-base font-semibold text-text">
        {{ $t(`branches.items.${branch.key}.name`) }}
      </h2>
      <UiBadge>{{ $t(`branches.regions.${branch.region}`) }}</UiBadge>
    </div>

    <dl class="flex flex-col gap-2 text-compact">
      <div class="flex gap-2">
        <dt>
          <Icon name="lucide:map-pin" size="16" class="mt-0.5 text-text-secondary" />
          <span class="sr-only">{{ $t('branches.address') }}</span>
        </dt>
        <dd class="text-text">{{ $t(`branches.items.${branch.key}.address`) }}</dd>
      </div>
      <div class="flex gap-2">
        <dt>
          <Icon name="lucide:clock" size="16" class="mt-0.5 text-text-secondary" />
          <span class="sr-only">{{ $t('branches.hours') }}</span>
        </dt>
        <dd class="text-text">{{ $t('branches.hoursValue') }}</dd>
      </div>
      <div class="flex gap-2">
        <dt>
          <Icon name="lucide:phone" size="16" class="mt-0.5 text-text-secondary" />
          <span class="sr-only">{{ $t('forms.phone') }}</span>
        </dt>
        <dd>
          <a :href="toTelHref(branch.phone)" class="text-text tabular-nums hover:text-primary">
            {{ branch.phone }}
          </a>
        </dd>
      </div>
    </dl>

    <ul class="mt-auto flex flex-wrap gap-1.5" :aria-label="$t('branches.servicesLabel')">
      <li v-for="service in branch.services" :key="service">
        <UiBadge tone="success">{{ $t(`branches.services.${service}`) }}</UiBadge>
      </li>
    </ul>
  </article>
</template>
