<script setup lang="ts">
/**
 * Centered dialog. Focus trapping, Escape handling and the scrim come from ElDialog;
 * the visual design comes from the tokens.
 */
defineProps<{
  title: string
  /** Blocks closing while an action is in progress */
  busy?: boolean
}>()

const open = defineModel<boolean>({ default: false })
</script>

<template>
  <ElDialog
    v-model="open"
    :title="title"
    class="ui-modal"
    width="min(400px, calc(100vw - 32px))"
    align-center
    append-to-body
    :close-on-click-modal="!busy"
    :close-on-press-escape="!busy"
    :show-close="!busy"
  >
    <div class="text-sm text-text-secondary"><slot /></div>
    <template v-if="$slots.actions" #footer>
      <div class="flex flex-col gap-2 border-t border-border pt-4">
        <slot name="actions" />
      </div>
    </template>
  </ElDialog>
</template>

<style>
.ui-modal.el-dialog {
  --el-dialog-padding-primary: 24px;
  --el-dialog-border-radius: var(--radius-overlay);
  --el-dialog-title-font-size: 1.25rem;
  --el-dialog-box-shadow: 0 8px 24px -4px var(--shadow-color);
}

.ui-modal .el-dialog__title {
  font-weight: 600;
  line-height: 1.75rem;
  color: var(--text);
}

.ui-modal .el-dialog__header {
  padding-bottom: 12px;
}

.ui-modal .el-dialog__footer {
  padding-top: 16px;
  text-align: initial;
}
</style>
