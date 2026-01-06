<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

import {
  ClockIcon,
  DocumentTextIcon,
  PlusCircleIcon,
  CalendarDaysIcon,
  FireIcon,
  RectangleStackIcon
} from '@heroicons/vue/24/outline'
import type { LocalWorkout } from '~/types'

const { workouts, loading, loadWorkouts } = useWorkouts()

const groupedWorkouts = computed(() => {
  const groups: Record<string, LocalWorkout[]> = {}

  workouts.value.forEach(workout => {
    const date = new Date(workout.date)
    date.setHours(0, 0, 0, 0)
    const dateKey = date.toISOString()

    if (!groups[dateKey]) {
      groups[dateKey] = []
    }
    groups[dateKey].push(workout)
  })

  return groups
})

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (date.getTime() === today.getTime()) {
    return 'Today'
  } else if (date.getTime() === yesterday.getTime()) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }
}

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

onMounted(async () => {
  await loadWorkouts()
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
          <ClockIcon class="w-6 h-6 text-white" />
        </div>
        Workout History
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2 ml-13">Track your progress over time</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading your workouts...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="workouts.length === 0" class="text-center py-16">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <DocumentTextIcon class="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">No workouts yet</h3>
      <p class="text-gray-600 dark:text-gray-400 mb-6">Start your first workout to see it here</p>
      <NuxtLink to="/dashboard">
        <UiButton variant="primary" :icon="PlusCircleIcon">
          Create Workout
        </UiButton>
      </NuxtLink>
    </div>

    <!-- Workout History -->
    <div v-else class="space-y-6">
      <div v-for="(group, date) in groupedWorkouts" :key="date">
        <div class="sticky top-16 z-30 bg-gray-50 dark:bg-gray-950 py-3 mb-4">
          <div class="flex items-center gap-2">
            <CalendarDaysIcon class="w-5 h-5 text-primary-500" />
            <h2 class="text-lg font-bold text-gray-900 dark:text-white">
              {{ formatDate(date) }}
            </h2>
            <span class="text-sm text-gray-500 dark:text-gray-400 ml-auto">
              {{ group.length }} {{ group.length === 1 ? 'workout' : 'workouts' }}
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <NuxtLink
            v-for="workout in group"
            :key="workout.localId"
            :to="`/workout/${workout.localId}`"
          >
            <UiCard hover clickable>
              <div class="flex justify-between items-start mb-3">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                    <FireIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <div class="font-semibold text-gray-900 dark:text-white mb-1">
                      {{ formatTime(workout.date) }}
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <RectangleStackIcon class="w-4 h-4" />
                      {{ workout.exercises.length }} {{ workout.exercises.length === 1 ? 'exercise' : 'exercises' }}
                    </div>
                  </div>
                </div>
                <div
                  class="text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1"
                  :class="[
                    workout.syncStatus === 'synced'
                      ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                      : workout.syncStatus === 'pending'
                      ? 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                      : 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-400'
                  ]"
                >
                  <div class="w-1.5 h-1.5 rounded-full" :class="[
                    workout.syncStatus === 'synced' ? 'bg-green-500' :
                    workout.syncStatus === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                  ]"></div>
                  {{ workout.syncStatus }}
                </div>
              </div>

              <div class="space-y-2 mt-4">
                <div
                  v-for="exercise in workout.exercises.slice(0, 3)"
                  :key="exercise.localId"
                  class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg px-3 py-2"
                >
                  <div class="w-1 h-1 bg-primary-500 rounded-full"></div>
                  <span class="font-medium text-gray-900 dark:text-white">{{ exercise.name }}</span>
                  <span class="text-gray-500 dark:text-gray-500">-</span>
                  <span>{{ exercise.sets }}×{{ exercise.reps }}</span>
                  <span v-if="exercise.weight" class="text-primary-600 dark:text-primary-400 font-medium">
                    @ {{ exercise.weight }}kg
                  </span>
                </div>
                <div
                  v-if="workout.exercises.length > 3"
                  class="text-sm text-gray-500 dark:text-gray-400 pl-5"
                >
                  +{{ workout.exercises.length - 3 }} more exercise{{ workout.exercises.length - 3 > 1 ? 's' : '' }}
                </div>
              </div>

              <div v-if="workout.notes" class="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <DocumentTextIcon class="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span class="italic">{{ workout.notes }}</span>
                </div>
              </div>
            </UiCard>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
