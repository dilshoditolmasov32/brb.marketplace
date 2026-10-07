<script setup lang="ts">
import { Icon } from '#components'

const { locale, locales } = useI18n()
const { switchLocale } = useLocaleSwitch()

const ChevronIcon = () => h(Icon, { name: 'brb:chevron-down', size: 14 })
</script>

<template>
  <ElSelect
    :model-value="locale"
    size="small"
    class="language-select"
    popper-class="ui-select__popper language-select__popper"
    :aria-label="$t('header.language')"
    :suffix-icon="ChevronIcon"
    :teleported="true"
    @change="switchLocale"
  >
    <template #prefix>
      <Icon name="lucide:globe" size="14" />
    </template>
    <ElOption
      v-for="item in locales"
      :key="item.code"
      :label="item.name"
      :value="item.code"
      :lang="item.language"
    >
      <span class="min-w-0 flex-1">{{ item.name }}</span>
      <Icon v-if="item.code === locale" name="brb:check" size="16" class="shrink-0" />
    </ElOption>
  </ElSelect>
</template>

<style>
.language-select.el-select {
  width: 132px;
}

.language-select .el-select__wrapper {
  min-height: 28px;
  padding: 0 8px;
  gap: 6px;
  font-size: 0.8125rem;
  line-height: 1.25rem;
  background-color: var(--surface);
  box-shadow: 0 0 0 1px var(--border-strong) inset;
}

.language-select .el-select__wrapper.is-focused {
  box-shadow: 0 0 0 2px var(--focus) inset;
}

.language-select__popper .el-select-dropdown__item {
  padding: 8px 10px;
  font-size: 0.8125rem;
}
</style>
