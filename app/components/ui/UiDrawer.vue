<script setup lang="ts">
/** Side panel. Behaviour comes from ElDrawer; the visual design comes from the tokens. */
withDefaults(
  defineProps<{
    title: string
    direction?: 'rtl' | 'ltr' | 'btt'
  }>(),
  { direction: 'rtl' },
)

const open = defineModel<boolean>({ default: false })
</script>

<template>
  <ElDrawer
    v-model="open"
    :title="title"
    :direction="direction"
    class="ui-drawer"
    :size="direction === 'btt' ? 'auto' : 'min(400px, 100vw)'"
    append-to-body
  >
    <div class="text-sm text-text-secondary"><slot /></div>
    <template v-if="$slots.actions" #footer>
      <div class="flex flex-col gap-2 border-t border-border pt-4">
        <slot name="actions" />
      </div>
    </template>
  </ElDrawer>
</template>

<style>
.ui-drawer.el-drawer {
  --el-drawer-padding-primary: 24px;
  box-shadow: 0 8px 24px -4px var(--shadow-color);
}

.ui-drawer.el-drawer.btt {
  max-height: 90dvh;
  border-radius: var(--radius-overlay) var(--radius-overlay) 0 0;
}

.ui-drawer .el-drawer__header {
  margin-bottom: 12px;
  color: var(--text);
}

.ui-drawer .el-drawer__title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.75rem;
}

.ui-drawer .el-drawer__footer {
  text-align: initial;
}
</style>
