<template>
  <div class="space-y-3">
    <div class="relative">
      <input
        ref="inputRef"
        v-model="inputValue"
        type="text"
        placeholder="e.g., Squat 3x10 @225, Bench 5x5 185, Plank 3x30"
        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
        @keydown.enter="handleEnter"
        @input="handleInput"
      />
      <button
        v-if="inputValue"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        @click="clearInput"
      >
        <XMarkIcon class="w-5 h-5" />
      </button>
    </div>

    <!-- Parsed preview -->
    <div v-if="parsed && !error" class="flex items-center gap-2 text-sm">
      <CheckCircleIcon class="w-5 h-5 text-green-500 flex-shrink-0" />
      <span class="text-gray-600 dark:text-gray-400">
        <span class="font-semibold text-gray-900 dark:text-white">{{ parsed.name }}</span>
        <span v-if="parsed.sets && parsed.reps">
          • {{ parsed.sets }} sets × {{ parsed.reps }} reps
        </span>
        <span v-if="parsed.weight">
          • {{ parsed.weight }} lbs
        </span>
      </span>
    </div>

    <!-- Error message -->
    <div v-if="error" class="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
      <ExclamationCircleIcon class="w-5 h-5 flex-shrink-0" />
      <span>{{ error }}</span>
    </div>

    <!-- Keyboard hint -->
    <div class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
      <span>Press</span>
      <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">
        Enter
      </kbd>
      <span>to add</span>
      <span class="mx-1">•</span>
      <kbd class="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded border border-gray-300 dark:border-gray-600 font-mono">
        {{ isMac ? '⌘' : 'Ctrl' }} + E
      </kbd>
      <span>to focus</span>
    </div>

    <!-- Quick suggestions -->
    <div v-if="showSuggestions" class="flex flex-wrap gap-2">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        class="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        @click="applySuggestion(suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import type { QuickEntryParsed } from '~/types'

const emit = defineEmits<{
  add: [parsed: QuickEntryParsed]
}>()

const inputValue = ref('')
const inputRef = ref<HTMLInputElement | null>(null)
const showSuggestions = ref(false)

const { parseQuickEntry, validateParsedEntry, getQuickEntrySuggestions } = useQuickEntry()

const isMac = computed(() => {
  if (process.client) {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0
  }
  return false
})

const parsed = computed(() => {
  if (!inputValue.value.trim()) return null
  return parseQuickEntry(inputValue.value)
})

const error = computed(() => {
  if (!inputValue.value.trim()) return null
  return validateParsedEntry(parsed.value)
})

const suggestions = computed(() => getQuickEntrySuggestions())

const handleInput = () => {
  // Show suggestions if input is empty
  showSuggestions.value = !inputValue.value.trim()
}

const handleEnter = () => {
  if (error.value || !parsed.value) return

  emit('add', parsed.value)
  clearInput()
}

const clearInput = () => {
  inputValue.value = ''
  showSuggestions.value = true
}

const applySuggestion = (suggestion: string) => {
  inputValue.value = suggestion
  showSuggestions.value = false
}

const focus = () => {
  inputRef.value?.focus()
}

// Expose focus method for parent components
defineExpose({
  focus
})

// Show suggestions on mount
onMounted(() => {
  showSuggestions.value = true
})
</script>
