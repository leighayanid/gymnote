<template>
  <div class="w-full" ref="containerRef">
    <div class="relative">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5 text-gray-400 dark:text-gray-500" />
      </div>
      <input
        ref="inputRef"
        type="text"
        :value="searchQuery"
        :placeholder="placeholder"
        :class="inputClasses"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        autocomplete="off"
      />
      <div
        v-if="loading"
        class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none"
      >
        <div class="animate-spin h-4 w-4 border-2 border-primary-500 border-t-transparent rounded-full"></div>
      </div>
    </div>

    <!-- Dropdown Results -->
    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="showDropdown && (results.length > 0 || searchQuery.length > 0)"
        class="absolute z-50 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto"
      >
        <div v-if="results.length > 0" class="py-1">
          <button
            v-for="(exercise, index) in results"
            :key="exercise.name"
            type="button"
            @mousedown.prevent="selectExercise(exercise)"
            @mouseenter="highlightedIndex = index"
            class="w-full text-left"
          >
            <ExercisePreviewCard
              :exercise="exercise"
              :selected="highlightedIndex === index"
            />
          </button>
        </div>

        <!-- No Results -->
        <div
          v-else-if="searchQuery.length > 0 && !loading"
          class="p-4 text-sm text-gray-500 dark:text-gray-400 text-center"
        >
          No exercises found. Press Enter to use "{{ searchQuery }}" as a custom exercise.
        </div>

        <!-- Custom Exercise Option -->
        <div
          v-if="searchQuery.length > 0 && allowCustom"
          class="border-t border-gray-200 dark:border-gray-700"
        >
          <button
            type="button"
            @mousedown.prevent="useCustomExercise"
            class="w-full p-3 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
          >
            <span class="font-medium">Use custom:</span> "{{ searchQuery }}"
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import type { ExerciseSearchResult } from '~/types'

interface Props {
  modelValue: string
  placeholder?: string
  icon?: any
  allowCustom?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Search exercises...',
  allowCustom: true
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'select': [exercise: ExerciseSearchResult | null]
}>()

const { searchExercises, loading } = useExercises()

const containerRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)
const searchQuery = ref(props.modelValue)
const showDropdown = ref(false)
const results = ref<ExerciseSearchResult[]>([])
const highlightedIndex = ref(0)
const debounceTimer = ref<NodeJS.Timeout | null>(null)

const inputClasses = computed(() => {
  return [
    'block w-full rounded-lg border',
    'transition-colors duration-200',
    'text-gray-900 dark:text-white',
    'placeholder-gray-400 dark:placeholder-gray-500',
    'bg-white dark:bg-gray-800',
    'border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-primary-500',
    'focus:outline-none focus:ring-2 focus:ring-offset-0',
    props.icon ? 'pl-10 pr-10' : 'px-4 pr-10',
    'py-2.5'
  ].join(' ')
})

const handleInput = (event: Event) => {
  const value = (event.target as HTMLInputElement).value
  searchQuery.value = value
  emit('update:modelValue', value)

  // Debounce search
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }

  debounceTimer.value = setTimeout(async () => {
    await performSearch(value)
  }, 300)
}

const performSearch = async (query: string) => {
  if (!query || query.trim() === '') {
    results.value = []
    return
  }

  try {
    const searchResults = await searchExercises(query, 10)
    results.value = searchResults
    highlightedIndex.value = 0
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  }
}

const handleFocus = () => {
  showDropdown.value = true
  if (searchQuery.value) {
    performSearch(searchQuery.value)
  }
}

const handleBlur = () => {
  // Delay to allow click events on dropdown items
  setTimeout(() => {
    showDropdown.value = false
  }, 200)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (!showDropdown.value) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      showDropdown.value = true
      if (searchQuery.value) {
        performSearch(searchQuery.value)
      }
    }
    return
  }

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, results.value.length - 1)
      break

    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, 0)
      break

    case 'Enter':
      event.preventDefault()
      if (results.value.length > 0 && highlightedIndex.value >= 0) {
        selectExercise(results.value[highlightedIndex.value])
      } else if (props.allowCustom && searchQuery.value.trim()) {
        useCustomExercise()
      }
      break

    case 'Escape':
      event.preventDefault()
      showDropdown.value = false
      inputRef.value?.blur()
      break

    case 'Tab':
      // Allow tab to close dropdown and move focus
      showDropdown.value = false
      break
  }
}

const selectExercise = (exercise: ExerciseSearchResult) => {
  searchQuery.value = exercise.name
  emit('update:modelValue', exercise.name)
  emit('select', exercise)
  showDropdown.value = false
  inputRef.value?.blur()
}

const useCustomExercise = () => {
  emit('update:modelValue', searchQuery.value)
  emit('select', null)
  showDropdown.value = false
  inputRef.value?.blur()
}

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  if (newValue !== searchQuery.value) {
    searchQuery.value = newValue
  }
})

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    showDropdown.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  if (debounceTimer.value) {
    clearTimeout(debounceTimer.value)
  }
})
</script>
