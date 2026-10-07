<script setup lang="ts">
/** Confirmation shown in place of a demonstration form after it was "sent" */
defineEmits<{ again: [] }>()
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <UiAlert tone="success" :title="$t('forms.sent.title')" class="w-full">
      {{ $t('forms.sent.description') }}
    </UiAlert>
    <UiButton variant="outline" @click="$emit('again')">{{ $t('forms.again') }}</UiButton>
  </div>
</template>
