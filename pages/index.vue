<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6">
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 mb-2">Today's Workout</h1>
      <p class="text-gray-600">{{ formattedDate }}</p>
    </div>

    <!-- Templates Section -->
    <div class="mb-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Start from Template
      </h2>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="template in templates"
          :key="template.id"
          @click="startFromTemplate(template.id)"
          class="bg-white border-2 border-gray-200 rounded-lg p-4 text-left hover:border-blue-500 hover:shadow-md transition-all active:scale-95"
        >
          <div class="font-medium text-gray-900 mb-1">{{ template.name }}</div>
          <div class="text-sm text-gray-500">
            {{ template.exercises.length }} exercises
          </div>
        </button>
      </div>
    </div>

    <!-- Or divider -->
    <div class="flex items-center mb-8">
      <div class="flex-1 border-t border-gray-200"></div>
      <span class="px-4 text-sm text-gray-500">or</span>
      <div class="flex-1 border-t border-gray-200"></div>
    </div>

    <!-- Custom Workout Button -->
    <button
      @click="showNewWorkout = true"
      class="w-full bg-blue-600 text-white rounded-lg py-4 px-6 font-medium text-lg hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
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
          d="M12 4v16m8-8H4"
        />
      </svg>
      Create Custom Workout
    </button>

    <!-- Today's Workouts -->
    <div v-if="todayWorkouts.length > 0" class="mt-8">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">
        Today's Sessions
      </h2>
      <div class="space-y-3">
        <NuxtLink
          v-for="workout in todayWorkouts"
          :key="workout.localId"
          :to="`/workout/${workout.localId}`"
          class="block bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
        >
          <div class="flex justify-between items-start mb-2">
            <div class="font-medium text-gray-900">
              {{ formatTime(workout.date) }}
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
          <div class="text-sm text-gray-600">
            {{ workout.exercises.length }} exercises
          </div>
          <div v-if="workout.notes" class="text-sm text-gray-500 mt-1">
            {{ workout.notes }}
          </div>
        </NuxtLink>
      </div>
    </div>

    <!-- New Workout Modal -->
    <div
      v-if="showNewWorkout"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-end sm:items-center justify-center z-50"
      @click.self="showNewWorkout = false"
    >
      <div
        class="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-lg p-6 max-h-[90vh] overflow-y-auto"
      >
        <h2 class="text-2xl font-bold mb-4">New Workout</h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            v-model="newWorkoutNotes"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="Optional notes..."
          ></textarea>
        </div>

        <div class="mb-4">
          <h3 class="text-lg font-semibold mb-3">Exercises</h3>
          <div v-for="(exercise, index) in newWorkoutExercises" :key="index" class="mb-4 p-4 bg-gray-50 rounded-lg">
            <input
              v-model="exercise.name"
              type="text"
              placeholder="Exercise name"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 mb-2"
            />
            <div class="grid grid-cols-3 gap-2">
              <input
                v-model.number="exercise.sets"
                type="number"
                placeholder="Sets"
                class="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                v-model.number="exercise.reps"
                type="number"
                placeholder="Reps"
                class="border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                v-model.number="exercise.weight"
                type="number"
                placeholder="Weight"
                class="border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>
          </div>

          <button
            @click="addExercise"
            class="w-full border-2 border-dashed border-gray-300 rounded-lg py-3 text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
          >
            + Add Exercise
          </button>
        </div>

        <div class="flex gap-3">
          <button
            @click="showNewWorkout = false"
            class="flex-1 border border-gray-300 rounded-lg py-3 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="saveNewWorkout"
            class="flex-1 bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700"
            :disabled="!canSaveWorkout"
          >
            Save Workout
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { templates, loadTemplates, createWorkoutFromTemplate } = useTemplates()
const { workouts, loadWorkouts, createWorkout } = useWorkouts()

const showNewWorkout = ref(false)
const newWorkoutNotes = ref('')
const newWorkoutExercises = ref([
  { name: '', sets: 3, reps: 10, weight: 0 }
])

const formattedDate = computed(() => {
  const now = new Date()
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const todayWorkouts = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return workouts.value.filter(w => {
    const workoutDate = new Date(w.date)
    return workoutDate >= today && workoutDate < tomorrow
  })
})

const canSaveWorkout = computed(() => {
  return newWorkoutExercises.value.some(e => e.name.trim() !== '')
})

const formatTime = (date: Date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  })
}

const addExercise = () => {
  newWorkoutExercises.value.push({ name: '', sets: 3, reps: 10, weight: 0 })
}

const startFromTemplate = async (templateId: string) => {
  await createWorkoutFromTemplate(templateId)
  await loadWorkouts()
}

const saveNewWorkout = async () => {
  const validExercises = newWorkoutExercises.value.filter(e => e.name.trim() !== '')

  await createWorkout({
    date: new Date(),
    notes: newWorkoutNotes.value || undefined,
    exercises: validExercises
  })

  // Reset form
  showNewWorkout.value = false
  newWorkoutNotes.value = ''
  newWorkoutExercises.value = [{ name: '', sets: 3, reps: 10, weight: 0 }]

  await loadWorkouts()
}

onMounted(async () => {
  await loadTemplates()
  await loadWorkouts()
})
</script>
