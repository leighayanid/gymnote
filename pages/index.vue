<script setup lang="ts">
definePageMeta({
  layout: 'default'
})

import { gsap } from 'gsap'
import {
  CalendarIcon,
  SparklesIcon,
  FireIcon,
  RectangleStackIcon,
  PlusCircleIcon,
  BoltIcon,
  ClockIcon,
  RocketLaunchIcon,
  PlusIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const { templates, loading: templatesLoading, loadTemplates, createWorkoutFromTemplate } = useTemplates()
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

const removeExercise = (index: number) => {
  newWorkoutExercises.value.splice(index, 1)
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

  // Animate page elements on mount
  nextTick(() => {
    // Animate header
    gsap.from('.space-y-2', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    })

    // Animate template cards
    const templateCards = document.querySelectorAll('.grid.grid-cols-2 > button')
    gsap.from(templateCards, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      delay: 0.2
    })

    // Animate workout cards if they exist
    const workoutCards = document.querySelectorAll('.space-y-3 > a')
    if (workoutCards.length > 0) {
      gsap.from(workoutCards, {
        x: -30,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.4
      })
    }
  })
})
</script>

<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
    <!-- Page Header -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Today's Workout</h1>
      <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <CalendarIcon class="w-5 h-5" />
        <p>{{ formattedDate }}</p>
      </div>
    </div>

    <!-- Templates Section -->
    <div v-if="!templatesLoading && templates.length > 0" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <SparklesIcon class="w-6 h-6 text-primary-500" />
          Quick Start Templates
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="template in templates"
          :key="template.id"
          @click="startFromTemplate(template.id)"
          class="group relative bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 border-2 border-primary-200 dark:border-primary-800 rounded-xl p-4 text-left hover:border-primary-400 dark:hover:border-primary-600 hover:shadow-lg transition-all active:scale-95"
        >
          <div class="absolute top-3 right-3">
            <FireIcon class="w-5 h-5 text-primary-500 dark:text-primary-400" />
          </div>
          <div class="font-semibold text-gray-900 dark:text-white mb-2 pr-8">{{ template.name }}</div>
          <div class="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
            <RectangleStackIcon class="w-4 h-4" />
            {{ template.exercises.length }} exercises
          </div>
        </button>
      </div>
    </div>

    <!-- Templates Loading State -->
    <div v-else-if="templatesLoading" class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <SparklesIcon class="w-6 h-6 text-primary-500" />
          Quick Start Templates
        </h2>
      </div>

      <div class="grid grid-cols-2 gap-3">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl p-4 animate-pulse"
        >
          <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-3"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>

    <!-- Or divider -->
    <div class="flex items-center">
      <div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
      <span class="px-4 text-sm text-gray-500 dark:text-gray-400 font-medium">or</span>
      <div class="flex-1 border-t border-gray-300 dark:border-gray-700"></div>
    </div>

    <!-- Custom Workout Button -->
    <UiButton
      @click="showNewWorkout = true"
      variant="primary"
      size="lg"
      :icon="PlusCircleIcon"
      full-width
    >
      Create Custom Workout
    </UiButton>

    <!-- Today's Workouts -->
    <div v-if="todayWorkouts.length > 0" class="space-y-4">
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
        <BoltIcon class="w-6 h-6 text-primary-500" />
        Today's Sessions
      </h2>
      <div class="space-y-3">
        <NuxtLink
          v-for="workout in todayWorkouts"
          :key="workout.localId"
          :to="`/workout/${workout.localId}`"
        >
          <UiCard hover clickable>
            <div class="flex justify-between items-start mb-3">
              <div class="flex items-center gap-2">
                <ClockIcon class="w-5 h-5 text-gray-400 dark:text-gray-500" />
                <div class="font-semibold text-gray-900 dark:text-white">
                  {{ formatTime(workout.date) }}
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
            <div class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <RectangleStackIcon class="w-4 h-4" />
              {{ workout.exercises.length }} exercises
            </div>
            <div v-if="workout.notes" class="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-2 mt-2">
              {{ workout.notes }}
            </div>
          </UiCard>
        </NuxtLink>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12">
      <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <RocketLaunchIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">No workouts yet today</h3>
      <p class="text-gray-600 dark:text-gray-400">Start with a template or create a custom workout</p>
    </div>

    <!-- New Workout Modal -->
    <UiModal v-model="showNewWorkout" title="New Workout" size="lg">
      <div class="space-y-6">
        <UiTextArea
          v-model="newWorkoutNotes"
          label="Notes"
          placeholder="Optional workout notes..."
          :rows="3"
        />

        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <RectangleStackIcon class="w-5 h-5 text-primary-500" />
            Exercises
          </h3>

          <div v-for="(exercise, index) in newWorkoutExercises" :key="index" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Exercise {{ index + 1 }}</span>
              <button
                v-if="newWorkoutExercises.length > 1"
                @click="removeExercise(index)"
                class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>

            <UiInput
              v-model="exercise.name"
              placeholder="Exercise name"
              :icon="FireIcon"
            />

            <div class="grid grid-cols-3 gap-2">
              <UiInput
                v-model.number="exercise.sets"
                type="number"
                placeholder="Sets"
                :min="1"
              />
              <UiInput
                v-model.number="exercise.reps"
                type="number"
                placeholder="Reps"
                :min="1"
              />
              <UiInput
                v-model.number="exercise.weight"
                type="number"
                placeholder="Weight"
                :min="0"
              />
            </div>
          </div>

          <UiButton
            @click="addExercise"
            variant="outline"
            full-width
            :icon="PlusIcon"
          >
            Add Exercise
          </UiButton>
        </div>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <UiButton
            @click="showNewWorkout = false"
            variant="secondary"
            class="flex-1"
          >
            Cancel
          </UiButton>
          <UiButton
            @click="saveNewWorkout"
            variant="primary"
            class="flex-1"
            :disabled="!canSaveWorkout"
          >
            Save Workout
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>
