<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
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
  TrashIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'
import { formatDistanceToNow } from 'date-fns'
import type { QuickEntryParsed } from '~/types'

const { templates, loading: templatesLoading, loadTemplates, createWorkoutFromTemplate } = useTemplates()
const { workouts, loadWorkouts, createWorkout, getLastCompletedWorkout } = useWorkouts()
const { getWeeklyVolumeData } = useVolumeStats()
const { syncData } = useSync()
const { setupPullToRefresh, isPulling, pullDistance, isThresholdReached, pullProgress } = usePullToRefresh()

const showNewWorkout = ref(false)
const newWorkoutNotes = ref('')
const newWorkoutExercises = ref([
  { name: '', sets: 3, reps: 10, weight: 0 }
])
const quickEntryRef = ref<any>(null)
const activeTab = ref<'in_progress' | 'completed'>('in_progress')
const lastWorkout = ref<any>(null)
const volumeData = ref<any[]>([])
const volumeLoading = ref(true)

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

  return workouts.value
    .filter(w => {
      const workoutDate = new Date(w.date)
      const matchesDate = workoutDate >= today && workoutDate < tomorrow
      const matchesStatus = w.status === activeTab.value
      return matchesDate && matchesStatus
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

const formatLastUsed = (date: Date | null) => {
  if (!date) return 'Never used'
  try {
    return formatDistanceToNow(new Date(date), { addSuffix: true })
  } catch {
    return 'Recently'
  }
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
  await loadTemplates() // Reload to update lastUsed
}

const handleExerciseSelect = (index: number, selected: any) => {
  if (selected) {
    newWorkoutExercises.value[index].name = selected.name
  }
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

const handleQuickEntryAdd = async (parsed: QuickEntryParsed) => {
  // Add exercise to new workout
  await createWorkout({
    date: new Date(),
    exercises: [{
      name: parsed.name,
      sets: parsed.sets || 3,
      reps: parsed.reps || 10,
      weight: parsed.weight || undefined
    }]
  })

  await loadWorkouts()
}

const handleRepeatWorkout = async (workout: any) => {
  await createWorkout({
    date: new Date(),
    notes: `Repeated from ${formatDistanceToNow(new Date(workout.date), { addSuffix: true })}`,
    exercises: workout.exercises.map((e: any) => ({
      name: e.name,
      sets: e.sets,
      reps: e.reps,
      weight: e.weight
    }))
  })

  await loadWorkouts()
}

const handleViewWorkout = (workout: any) => {
  navigateTo(`/workout/${workout.localId}`)
}

const handleFABClick = () => {
  showNewWorkout.value = true
}

const handlePullToSync = async () => {
  await syncData({ manual: true })
  await loadWorkouts()
}

const loadVolumeData = async () => {
  volumeLoading.value = true
  try {
    const data = await getWeeklyVolumeData(4)
    volumeData.value = data
  } catch (error) {
    console.error('Failed to load volume data:', error)
  } finally {
    volumeLoading.value = false
  }
}

onMounted(async () => {
  await loadTemplates()
  await loadWorkouts()

  // Load last workout
  lastWorkout.value = await getLastCompletedWorkout()

  // Load volume data
  await loadVolumeData()

  // Setup pull-to-refresh
  const cleanup = setupPullToRefresh(handlePullToSync)
  onUnmounted(cleanup)

  // Animate page elements on mount
  nextTick(() => {
    gsap.from('.space-y-2', {
      y: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power2.out'
    })

    const templateCards = document.querySelectorAll('.grid.grid-cols-2 > button')
    gsap.from(templateCards, {
      scale: 0.8,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      delay: 0.2
    })

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
    <!-- Pull-to-Sync Indicator -->
    <PullToSyncIndicator
      :is-pulling="isPulling"
      :pull-distance="pullDistance"
      :is-threshold-reached="isThresholdReached"
      :pull-progress="pullProgress"
    />

    <!-- FAB -->
    <FAB @click="handleFABClick" />

    <!-- Page Header -->
    <div class="space-y-2">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Today's Workout</h1>
      <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
        <CalendarIcon class="w-5 h-5" />
        <p>{{ formattedDate }}</p>
      </div>
    </div>

    <!-- Last Workout Card -->
    <LastWorkoutCard
      v-if="lastWorkout"
      :workout="lastWorkout"
      @repeat="handleRepeatWorkout"
      @view-full="handleViewWorkout"
    />

    <!-- Volume Chart -->
    <div v-if="volumeData.length > 0" class="space-y-4">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
        <ChartBarIcon class="w-7 h-7 text-primary-500" />
        Weekly Volume
      </h2>
      <UiCard>
        <VolumeChart :data="volumeData" :height="300" />
      </UiCard>
    </div>

    <!-- Quick Entry Input -->
    <div class="space-y-2">
      <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300">Quick Add Exercise</h3>
      <QuickEntryInput ref="quickEntryRef" @add="handleQuickEntryAdd" />
    </div>

    <!-- Templates Section -->
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <SparklesIcon class="w-7 h-7 text-primary-500" />
          Quick Start Templates
        </h2>
      </div>

      <!-- Templates Loading State -->
      <div v-if="templatesLoading" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="i in 4"
          :key="i"
          class="bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 animate-pulse"
        >
          <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Templates List -->
      <div v-else-if="templates.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="template in templates"
          :key="template.id"
          @click="startFromTemplate(template.id)"
          class="group relative bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6 text-left hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl transition-all duration-300 active:scale-98 overflow-hidden"
        >
          <!-- Background Accent -->
          <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-500/10 to-transparent rounded-full blur-2xl group-hover:from-primary-500/20 transition-all duration-300"></div>

          <!-- Icon -->
          <div class="relative mb-4">
            <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <FireIcon class="w-7 h-7 text-white" />
            </div>
          </div>

          <!-- Template Name -->
          <h3 class="relative text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {{ template.name }}
          </h3>

          <!-- Exercise Count & Last Used -->
          <div class="relative space-y-2 mb-4">
            <div class="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
              <RectangleStackIcon class="w-5 h-5 text-primary-500" />
              <span>{{ template.exercises.length }} exercises</span>
            </div>
            <div class="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <ClockIcon class="w-4 h-4" />
              <span>{{ formatLastUsed(template.lastUsed) }}</span>
            </div>
          </div>

          <!-- Exercise Preview -->
          <div class="relative space-y-1.5">
            <div
              v-for="(exercise, idx) in template.exercises.slice(0, 3)"
              :key="idx"
              class="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 rounded-lg px-3 py-2 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 transition-colors"
            >
              <div class="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
              <span class="font-medium">{{ exercise.name }}</span>
              <span class="ml-auto text-gray-500 dark:text-gray-500">{{ exercise.sets }}×{{ exercise.reps }}</span>
            </div>
            <div
              v-if="template.exercises.length > 3"
              class="text-xs text-gray-500 dark:text-gray-500 text-center py-1 font-medium"
            >
              +{{ template.exercises.length - 3 }} more
            </div>
          </div>

          <!-- Hover Action Indicator -->
          <div class="relative mt-4 flex items-center gap-2 text-sm font-semibold text-primary-600 dark:text-primary-400 opacity-0 group-hover:opacity-100 transition-opacity">
            <span>Start Workout</span>
            <svg class="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
        <RectangleStackIcon class="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
        <p class="text-gray-600 dark:text-gray-400 font-medium">No templates available</p>
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
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <BoltIcon class="w-6 h-6 text-primary-500" />
          Today's Sessions
        </h2>
      </div>

      <!-- Status Tabs -->
      <div class="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        <button
          @click="activeTab = 'in_progress'"
          :class="[
            'px-4 py-2 text-sm font-semibold transition-colors border-b-2',
            activeTab === 'in_progress'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          In Progress
        </button>
        <button
          @click="activeTab = 'completed'"
          :class="[
            'px-4 py-2 text-sm font-semibold transition-colors border-b-2',
            activeTab === 'completed'
              ? 'border-primary-500 text-primary-600 dark:text-primary-400'
              : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
          ]"
        >
          Completed
        </button>
      </div>

      <!-- Workout List -->
      <div v-if="todayWorkouts.length > 0" class="space-y-3">
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
              <div class="flex items-center gap-2">
                <!-- Status badge -->
                <div
                  class="text-xs px-2.5 py-1 rounded-full font-medium"
                  :class="[
                    workout.status === 'completed'
                      ? 'bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-400'
                      : 'bg-yellow-100 dark:bg-yellow-950 text-yellow-700 dark:text-yellow-400'
                  ]"
                >
                  {{ workout.status === 'completed' ? 'Completed' : 'In Progress' }}
                </div>
                <!-- Sync badge -->
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

      <!-- Empty State -->
      <div v-else class="text-center py-12">
        <div class="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <RocketLaunchIcon class="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No {{ activeTab === 'in_progress' ? 'in progress' : 'completed' }} workouts today
        </h3>
        <p class="text-gray-600 dark:text-gray-400">Start with a template or create a custom workout</p>
      </div>
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

            <UiExerciseAutocomplete
              v-model="exercise.name"
              placeholder="Search or enter exercise name"
              :icon="FireIcon"
              @select="(selected) => handleExerciseSelect(index, selected)"
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
