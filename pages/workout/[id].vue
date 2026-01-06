<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6">
    <div v-if="loading" class="text-center py-12 text-gray-500">Loading...</div>

    <div v-else-if="!workout" class="text-center py-12">
      <p class="text-gray-600 text-lg">Workout not found</p>
      <NuxtLink to="/history" class="text-blue-600 hover:underline mt-4 inline-block">
        Back to History
      </NuxtLink>
    </div>

    <div v-else>
      <!-- Header -->
      <div class="flex items-center gap-4 mb-6">
        <NuxtLink
          to="/history"
          class="text-gray-600 hover:text-gray-900"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </NuxtLink>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900">Workout Details</h1>
          <p class="text-gray-600">{{ formatDate(workout.date) }}</p>
        </div>
        <button
          @click="confirmDelete = true"
          class="text-red-600 hover:text-red-700 p-2"
        >
          <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>

      <!-- Sync Status -->
      <div
        class="mb-6 px-4 py-3 rounded-lg flex items-center gap-2"
        :class="[
          workout.syncStatus === 'synced'
            ? 'bg-green-50 text-green-700'
            : workout.syncStatus === 'pending'
            ? 'bg-yellow-50 text-yellow-700'
            : 'bg-red-50 text-red-700'
        ]"
      >
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            v-if="workout.syncStatus === 'synced'"
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
          <path
            v-else
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="text-sm font-medium">
          {{ workout.syncStatus === 'synced' ? 'Synced to cloud' : 'Waiting to sync' }}
        </span>
      </div>

      <!-- Notes -->
      <div v-if="workout.notes" class="mb-6 bg-gray-50 rounded-lg p-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Notes</h3>
        <p class="text-gray-900">{{ workout.notes }}</p>
      </div>

      <!-- Exercises -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold text-gray-900">Exercises</h2>
        <div
          v-for="exercise in workout.exercises"
          :key="exercise.localId"
          class="bg-white border border-gray-200 rounded-lg p-4"
        >
          <h3 class="font-medium text-gray-900 text-lg mb-2">
            {{ exercise.name }}
          </h3>
          <div class="flex gap-6 text-sm text-gray-600">
            <div>
              <span class="font-medium">Sets:</span> {{ exercise.sets }}
            </div>
            <div>
              <span class="font-medium">Reps:</span> {{ exercise.reps }}
            </div>
            <div v-if="exercise.weight">
              <span class="font-medium">Weight:</span> {{ exercise.weight }}kg
            </div>
          </div>
          <div v-if="exercise.notes" class="mt-2 text-sm text-gray-500 italic">
            {{ exercise.notes }}
          </div>
        </div>
      </div>

      <!-- Delete Confirmation -->
      <div
        v-if="confirmDelete"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
        @click.self="confirmDelete = false"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm w-full">
          <h3 class="text-lg font-semibold mb-2">Delete Workout?</h3>
          <p class="text-gray-600 mb-6">
            This action cannot be undone. The workout will be deleted from both local storage and the cloud.
          </p>
          <div class="flex gap-3">
            <button
              @click="confirmDelete = false"
              class="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              @click="handleDelete"
              class="flex-1 bg-red-600 text-white rounded-lg py-2 font-medium hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LocalWorkout } from '~/types'

const route = useRoute()
const router = useRouter()
const { getWorkout, deleteWorkout } = useWorkouts()

const workout = ref<LocalWorkout | undefined>()
const loading = ref(true)
const confirmDelete = ref(false)

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  })
}

const handleDelete = async () => {
  if (workout.value) {
    await deleteWorkout(workout.value.localId)
    router.push('/history')
  }
}

onMounted(async () => {
  const id = route.params.id as string
  workout.value = await getWorkout(id)
  loading.value = false
})
</script>
