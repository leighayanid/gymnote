<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Workout History</h1>

    <div v-if="loading" class="text-center py-12 text-gray-500">
      Loading...
    </div>

    <div v-else-if="workouts.length === 0" class="text-center py-12">
      <svg
        class="w-16 h-16 mx-auto text-gray-400 mb-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
      </svg>
      <p class="text-gray-600 text-lg">No workouts yet</p>
      <p class="text-gray-500 mt-2">Start your first workout to see it here</p>
    </div>

    <div v-else class="space-y-6">
      <div v-for="(group, date) in groupedWorkouts" :key="date">
        <h2 class="text-lg font-semibold text-gray-700 mb-3 sticky top-0 bg-white py-2">
          {{ formatDate(date) }}
        </h2>
        <div class="space-y-3">
          <NuxtLink
            v-for="workout in group"
            :key="workout.localId"
            :to="`/workout/${workout.localId}`"
            class="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div class="flex justify-between items-start mb-3">
              <div>
                <div class="font-medium text-gray-900 mb-1">
                  {{ formatTime(workout.date) }}
                </div>
                <div class="text-sm text-gray-600">
                  {{ workout.exercises.length }} exercises
                </div>
              </div>
              <div
                class="text-xs px-2 py-1 rounded"
                :class="[
                  workout.syncStatus === 'synced'
                    ? 'bg-green-100 text-green-700'
                    : workout.syncStatus === 'pending'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                ]"
              >
                {{ workout.syncStatus }}
              </div>
            </div>

            <div class="space-y-1">
              <div
                v-for="exercise in workout.exercises.slice(0, 3)"
                :key="exercise.localId"
                class="text-sm text-gray-600"
              >
                {{ exercise.name }} - {{ exercise.sets }}×{{ exercise.reps }}
                <span v-if="exercise.weight"> @ {{ exercise.weight }}kg</span>
              </div>
              <div
                v-if="workout.exercises.length > 3"
                class="text-sm text-gray-500"
              >
                +{{ workout.exercises.length - 3 }} more
              </div>
            </div>

            <div v-if="workout.notes" class="mt-3 text-sm text-gray-500 italic">
              {{ workout.notes }}
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
