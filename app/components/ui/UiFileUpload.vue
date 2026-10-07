<script setup lang="ts">
/**
 * Single-file picker with drag and drop. It checks the type and the size itself;
 * the upload is the caller's job, reported back through `progress`.
 */
const props = withDefaults(
  defineProps<{
    label?: string
    /** Allowed file extensions, lower case, without the dot */
    extensions?: string[]
    maxSizeMb?: number
    /** Upload progress in percent; the file counts as uploaded once it is omitted or 100 */
    progress?: number
    /** Error from the caller (for example, a failed upload) */
    error?: string
    disabled?: boolean
  }>(),
  {
    label: undefined,
    extensions: () => ['pdf', 'jpg', 'jpeg', 'png'],
    maxSizeMb: 5,
    progress: undefined,
    error: undefined,
  },
)

const model = defineModel<File | null>({ default: null })

const { t } = useI18n()
const format = useFormat()

const BYTES_IN_MB = 1024 * 1024
const BYTES_IN_KB = 1024

const id = useId()
const messageId = `${id}-message`
const input = ref<HTMLInputElement>()
const isDragging = ref(false)
const ownError = ref<string>()

const message = computed(() => props.error || ownError.value)
const isUploading = computed(
  () => model.value !== null && props.progress !== undefined && props.progress < 100,
)

// "PDF, JPG, PNG": jpeg is the same format as jpg and is not listed twice
const formats = computed(() =>
  props.extensions
    .filter((extension) => extension !== 'jpeg')
    .map((extension) => extension.toUpperCase())
    .join(', '),
)

const sizeLabel = computed(() => {
  const size = model.value?.size ?? 0
  return size >= BYTES_IN_MB
    ? `${format.number(size / BYTES_IN_MB, 1)} MB`
    : `${format.number(Math.max(1, Math.round(size / BYTES_IN_KB)))} KB`
})

function select(file: File | undefined) {
  if (!file || props.disabled) return
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  if (!props.extensions.includes(extension)) {
    ownError.value = t('upload.errors.wrongType', { formats: formats.value })
    return
  }
  if (file.size > props.maxSizeMb * BYTES_IN_MB) {
    ownError.value = t('upload.errors.tooLarge', { size: props.maxSizeMb })
    return
  }
  ownError.value = undefined
  model.value = file
}

function onChange(event: Event) {
  const target = event.target as HTMLInputElement
  select(target.files?.[0])
  // Allows picking the same file again after it was removed
  target.value = ''
}

function onDrop(event: DragEvent) {
  isDragging.value = false
  select(event.dataTransfer?.files[0])
}

function remove() {
  ownError.value = undefined
  model.value = null
}

const zoneClasses = computed(() => {
  if (props.disabled) return 'border-dashed border-border bg-surface-disabled'
  if (model.value) return 'border-border bg-surface'
  if (isDragging.value) return 'border-dashed border-focus bg-surface outline-1 outline-focus'
  if (message.value) return 'border-dashed border-error bg-surface'
  return 'border-dashed border-border-strong bg-surface'
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      v-if="label"
      :for="id"
      class="text-sm font-medium"
      :class="disabled ? 'text-text-disabled' : 'text-text'"
    >
      {{ label }}
    </label>

    <div
      class="flex min-h-36 flex-col items-center justify-center gap-3 rounded-sm border px-4 py-5 text-center transition-colors"
      :class="zoneClasses"
      @dragover.prevent="isDragging = !disabled && !model"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="onDrop"
    >
      <input
        :id="id"
        ref="input"
        type="file"
        class="sr-only"
        tabindex="-1"
        :accept="extensions.map((extension) => `.${extension}`).join(',')"
        :disabled="disabled"
        :aria-describedby="messageId"
        @change="onChange"
      />

      <!-- Uploading -->
      <template v-if="model && isUploading">
        <Icon name="lucide:loader-circle" size="22" class="animate-spin text-text-secondary" />
        <p class="max-w-full truncate text-compact text-text">
          {{ model.name }} · <span class="tabular-nums">{{ Math.round(progress ?? 0) }}%</span>
        </p>
        <div
          class="h-1 w-full overflow-hidden rounded-full bg-surface-muted"
          role="progressbar"
          aria-valuemin="0"
          aria-valuemax="100"
          :aria-valuenow="Math.round(progress ?? 0)"
          :aria-label="$t('upload.uploading')"
        >
          <div
            class="h-full rounded-full bg-text transition-[width]"
            :style="{ width: `${progress}%` }"
          />
        </div>
      </template>

      <!-- Uploaded -->
      <template v-else-if="model">
        <Icon name="lucide:file-check" size="22" class="text-success" />
        <p class="max-w-full truncate text-compact text-text">
          {{ model.name }} · <span class="tabular-nums">{{ sizeLabel }}</span>
        </p>
        <UiButton variant="outline" :disabled="disabled" @click="remove">
          {{ $t('upload.remove') }}
        </UiButton>
      </template>

      <!-- Empty, dragging over, error or disabled -->
      <template v-else>
        <Icon
          :name="message && !disabled ? 'lucide:file-warning' : 'lucide:upload'"
          size="22"
          :class="disabled ? 'text-text-disabled' : message ? 'text-error' : 'text-text-secondary'"
        />
        <p class="text-compact" :class="disabled ? 'text-text-disabled' : 'text-text'">
          {{ $t('upload.prompt') }}
        </p>
        <UiButton variant="outline" :disabled="disabled" @click="input?.click()">
          {{ $t('upload.choose') }}
        </UiButton>
      </template>
    </div>

    <p
      :id="messageId"
      class="text-2xs"
      :class="message && !disabled ? 'text-error' : 'text-text-secondary'"
      :role="message && !disabled ? 'alert' : undefined"
    >
      {{ message && !disabled ? message : $t('upload.hint', { formats, size: maxSizeMb }) }}
    </p>
  </div>
</template>
