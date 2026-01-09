<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
        {{ exerciseName }} History
      </h3>
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {{ history.length }} session{{ history.length !== 1 ? 's' : '' }}
      </span>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="space-y-3">
      <div v-for="i in 3" :key="i" class="animate-pulse flex gap-3">
        <div class="w-2 h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div class="flex-1 space-y-2">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Timeline -->
    <div v-else-if="history.length > 0" class="relative space-y-6">
      <!-- Vertical line -->
      <div class="absolute left-1 top-2 bottom-2 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

      <!-- Timeline items -->
      <div
        v-for="(entry, index) in displayedHistory"
        :key="index"
        class="relative flex gap-4"
      >
        <!-- Dot -->
        <div
          :class="[
            'relative z-10 flex-shrink-0 w-3 h-3 rounded-full ring-4 ring-white dark:ring-gray-800 mt-1',
            index === 0 ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
          ]"
        ></div>

        <!-- Content -->
        <div class="flex-1 pb-6">
          <div class="flex items-start justify-between gap-4 mb-2">
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ formatDate(entry.workoutDate) }}
            </span>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatRelativeDate(entry.workoutDate) }}
            </span>
          </div>

          <!-- Stats -->
          <div class="flex items-center gap-4 text-sm">
            <div class="flex items-center gap-1.5">
              <span class="text-gray-600 dark:text-gray-400">Sets:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ entry.sets }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <span class="text-gray-600 dark:text-gray-400">Reps:</span>
              <span class="font-semibold text-gray-900 dark:text-white">{{ entry.reps }}</span>
            </div>
            <div v-if="entry.weight" class="flex items-center gap-1.5">
              <span class="text-gray-600 dark:text-gray-400">Weight:</span>
              <span class="font-semibold text-primary-600 dark:text-primary-400">
                {{ entry.weight }} lbs
              </span>
            </div>
          </div>

          <!-- Volume calculation -->
          <div class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Volume: {{ calculateVolume(entry) }} lbs
          </div>

          <!-- Weight change indicator -->
          <div v-if="index > 0 && entry.weight && history[index - 1].weight" class="mt-2">
            <span
              :class="[
                'inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded',
                getWeightChange(entry, history[index - 1]) > 0
                  ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
                  : getWeightChange(entry, history[index - 1]) < 0
                  ? 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
                  : 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-700'
              ]"
            >
              <component
                :is="getWeightChange(entry, history[index - 1]) > 0 ? ArrowUpIcon : getWeightChange(entry, history[index - 1]) < 0 ? ArrowDownIcon : MinusIcon"
                class="w-3 h-3"
              />
              {{ Math.abs(getWeightChange(entry, history[index - 1])) }} lbs
            </span>
          </div>

          <!-- Notes -->
          <p v-if="entry.notes" class="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
            "{{ entry.notes }}"
          </p>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else class="text-center py-8">
      <DocumentTextIcon class="w-12 h-12 mx-auto text-gray-400 dark:text-gray-600 mb-2" />
      <p class="text-sm text-gray-500 dark:text-gray-400">
        No history found for this exercise
      </p>
    </div>

    <!-- Load more button -->
    <div v-if="history.length > limit && displayedHistory.length < history.length" class="text-center">
      <Button variant="outline" size="sm" @click="loadMore">
        Load More
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, DocumentTextIcon } from '@heroicons/vue/24/outline'
import { format, formatDistanceToNow } from 'date-fns'
import type { ExerciseHistoryEntry } from '~/types'

const props = withDefaults(
  defineProps<{
    exerciseName: string
    limit?: number
  }>(),
  {
    limit: 5
  }
)

const loading = ref(true)
const history = ref<ExerciseHistoryEntry[]>([])
const displayCount = ref(props.limit)

const { getExerciseHistory } = useExerciseHistory()

const displayedHistory = computed(() => {
  return history.value.slice(0, displayCount.value)
})

const calculateVolume = (entry: ExerciseHistoryEntry): number => {
  return entry.sets * entry.reps * (entry.weight || 0)
}

const getWeightChange = (current: ExerciseHistoryEntry, previous: ExerciseHistoryEntry): number => {
  return (current.weight || 0) - (previous.weight || 0)
}

const formatDate = (date: Date): string => {
  try {
    return format(new Date(date), 'MMM d, yyyy')
  } catch {
    return ''
  }
}

const formatRelativeDate = (date: Date): string => {
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return ''
  }
}

const loadMore = () => {
  displayCount.value = Math.min(displayCount.value + props.limit, history.value.length)
}

onMounted(async () => {
  try {
    const data = await getExerciseHistory(props.exerciseName)
    history.value = data
  } catch (error) {
    console.error('Error loading exercise history:', error)
  } finally {
    loading.value = false
  }
})
</script>
