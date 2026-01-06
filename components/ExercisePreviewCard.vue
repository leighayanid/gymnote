<template>
  <div
    class="flex items-start gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg cursor-pointer transition-colors"
    :class="{ 'bg-primary-50 dark:bg-primary-900/20': selected }"
  >
    <div class="flex-1 min-w-0">
      <div class="font-medium text-gray-900 dark:text-white truncate">
        {{ exercise.name }}
      </div>
      <div class="flex items-center gap-2 mt-1 text-xs text-gray-600 dark:text-gray-400">
        <span
          v-if="exercise.bodyPart"
          class="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
        >
          {{ exercise.bodyPart }}
        </span>
        <span
          v-if="exercise.equipment"
          class="inline-flex items-center px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
        >
          {{ exercise.equipment }}
        </span>
      </div>
      <div v-if="exercise.target" class="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Target: {{ exercise.target }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ExerciseSearchResult } from '~/types'

interface Props {
  exercise: ExerciseSearchResult
  selected?: boolean
}

withDefaults(defineProps<Props>(), {
  selected: false
})
</script>
