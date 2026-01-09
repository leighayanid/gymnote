<template>
  <Card
    v-if="workout"
    class="border-2 border-primary-200 dark:border-primary-900 bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-800"
    :hover="true"
  >
    <div class="flex items-start justify-between gap-4">
      <!-- Icon and title -->
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <div class="flex-shrink-0 p-2 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600">
          <ClockIcon class="w-5 h-5 text-white" />
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-white">Last Workout</h3>
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ relativeDate }}
            </span>
          </div>

          <!-- Exercises preview -->
          <div class="space-y-1.5 mb-3">
            <div
              v-for="(exercise, index) in displayExercises"
              :key="index"
              class="flex items-center gap-2 text-sm"
            >
              <span class="text-gray-700 dark:text-gray-300 font-medium">
                {{ exercise.name }}
              </span>
              <span class="text-gray-500 dark:text-gray-400 text-xs">
                {{ exercise.sets }}×{{ exercise.reps }}
                <span v-if="exercise.weight">@ {{ exercise.weight }} lbs</span>
              </span>
            </div>
            <p v-if="remainingCount > 0" class="text-xs text-gray-500 dark:text-gray-400">
              +{{ remainingCount }} more exercise{{ remainingCount > 1 ? 's' : '' }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <Button size="sm" @click="handleRepeat">
              <ArrowPathIcon class="w-4 h-4 mr-1.5" />
              Repeat
            </Button>
            <Button size="sm" variant="outline" @click="handleViewFull">
              View Full
            </Button>
          </div>
        </div>
      </div>

      <!-- Stats badge -->
      <div class="flex-shrink-0 text-right">
        <div class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
          <FireIcon class="w-4 h-4 text-orange-500" />
          <span class="text-sm font-semibold text-gray-900 dark:text-white">
            {{ workout.exercises.length }}
          </span>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ClockIcon, ArrowPathIcon, FireIcon } from '@heroicons/vue/24/outline'
import type { LocalWorkout } from '~/types'
import { formatDistanceToNow } from 'date-fns'

const props = defineProps<{
  workout: LocalWorkout | null
}>()

const emit = defineEmits<{
  repeat: [workout: LocalWorkout]
  viewFull: [workout: LocalWorkout]
}>()

const { hapticMedium } = useHaptics()

const displayExercises = computed(() => {
  if (!props.workout) return []
  return props.workout.exercises.slice(0, 3)
})

const remainingCount = computed(() => {
  if (!props.workout) return 0
  return Math.max(0, props.workout.exercises.length - 3)
})

const relativeDate = computed(() => {
  if (!props.workout) return ''
  try {
    return formatDistanceToNow(new Date(props.workout.date), { addSuffix: true })
  } catch {
    return ''
  }
})

const handleRepeat = () => {
  if (props.workout) {
    hapticMedium()
    emit('repeat', props.workout)
  }
}

const handleViewFull = () => {
  if (props.workout) {
    hapticMedium()
    emit('viewFull', props.workout)
  }
}
</script>
