<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6">
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-16">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-primary-500 mb-4"></div>
      <p class="text-gray-500 dark:text-gray-400">Loading workout...</p>
    </div>

    <!-- Not Found State -->
    <div v-else-if="!workout" class="text-center py-16">
      <div class="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
        <ExclamationCircleIcon class="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">Workout not found</h2>
      <p class="text-gray-600 dark:text-gray-400 mb-6">This workout may have been deleted or doesn't exist</p>
      <NuxtLink to="/history">
        <UiButton variant="primary" :icon="ArrowLeftIcon">
          Back to History
        </UiButton>
      </NuxtLink>
    </div>

    <!-- Workout Details -->
    <div v-else class="space-y-6">
      <!-- Header -->
      <div class="flex items-center gap-4">
        <NuxtLink
          to="/history"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeftIcon class="w-5 h-5" />
        </NuxtLink>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <FireIcon class="w-7 h-7 text-primary-500" />
            Workout Details
          </h1>
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
            <CalendarIcon class="w-4 h-4" />
            <p class="text-sm">{{ formatDate(workout.date) }}</p>
          </div>
        </div>
        <button
          v-if="!isEditing"
          @click="isEditing = true"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-950 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900 transition-colors"
        >
          <PencilIcon class="w-5 h-5" />
        </button>
        <button
          @click="confirmDelete = true"
          class="w-10 h-10 flex items-center justify-center rounded-lg bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
        >
          <TrashIcon class="w-5 h-5" />
        </button>
      </div>

      <!-- Sync Status Card -->
      <UiCard>
        <div
          class="flex items-center gap-3 p-4 rounded-lg"
          :class="[
            workout.syncStatus === 'synced'
              ? 'bg-green-50 dark:bg-green-950/30'
              : workout.syncStatus === 'pending'
              ? 'bg-yellow-50 dark:bg-yellow-950/30'
              : 'bg-red-50 dark:bg-red-950/30'
          ]"
        >
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center"
            :class="[
              workout.syncStatus === 'synced'
                ? 'bg-green-100 dark:bg-green-900'
                : workout.syncStatus === 'pending'
                ? 'bg-yellow-100 dark:bg-yellow-900'
                : 'bg-red-100 dark:bg-red-900'
            ]"
          >
            <CheckCircleIcon
              v-if="workout.syncStatus === 'synced'"
              class="w-6 h-6 text-green-600 dark:text-green-400"
            />
            <ClockIcon
              v-else
              class="w-6 h-6"
              :class="[
                workout.syncStatus === 'pending'
                  ? 'text-yellow-600 dark:text-yellow-400'
                  : 'text-red-600 dark:text-red-400'
              ]"
            />
          </div>
          <div>
            <div
              class="font-semibold"
              :class="[
                workout.syncStatus === 'synced'
                  ? 'text-green-900 dark:text-green-300'
                  : workout.syncStatus === 'pending'
                  ? 'text-yellow-900 dark:text-yellow-300'
                  : 'text-red-900 dark:text-red-300'
              ]"
            >
              {{ workout.syncStatus === 'synced' ? 'Synced to cloud' : 'Waiting to sync' }}
            </div>
            <div
              class="text-sm"
              :class="[
                workout.syncStatus === 'synced'
                  ? 'text-green-700 dark:text-green-400'
                  : workout.syncStatus === 'pending'
                  ? 'text-yellow-700 dark:text-yellow-400'
                  : 'text-red-700 dark:text-red-400'
              ]"
            >
              {{ workout.syncStatus === 'synced' ? 'Your workout is backed up' : 'Will sync when online' }}
            </div>
          </div>
        </div>
      </UiCard>

      <!-- Notes Card -->
      <UiCard v-if="workout.notes || isEditing">
        <template #header>
          <div class="flex items-center gap-2">
            <DocumentTextIcon class="w-5 h-5 text-primary-500" />
            <h3 class="font-semibold text-gray-900 dark:text-white">Notes</h3>
          </div>
        </template>
        <UiTextArea
          v-if="isEditing"
          v-model="editForm.notes"
          placeholder="Optional workout notes..."
          :rows="3"
        />
        <p v-else class="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{{ workout.notes }}</p>
      </UiCard>

      <!-- Exercises Card -->
      <UiCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <RectangleStackIcon class="w-5 h-5 text-primary-500" />
              <h2 class="font-semibold text-gray-900 dark:text-white">Exercises</h2>
            </div>
            <span class="text-sm text-gray-500 dark:text-gray-400">
              {{ workout.exercises.length }} total
            </span>
          </div>
        </template>

        <div class="space-y-3">
          <div
            v-for="(exercise, index) in (isEditing ? editForm.exercises : workout.exercises)"
            :key="exercise.localId"
            class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700"
          >
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-3 flex-1">
                <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center">
                  <span class="text-primary-600 dark:text-primary-400 font-bold text-sm">{{ index + 1 }}</span>
                </div>
                <UiInput
                  v-if="isEditing"
                  v-model="editForm.exercises[index].name"
                  placeholder="Exercise name"
                  class="flex-1"
                />
                <h3 v-else class="font-semibold text-gray-900 dark:text-white text-lg">
                  {{ exercise.name }}
                </h3>
              </div>
              <button
                v-if="isEditing && editForm.exercises.length > 1"
                @click="removeExercise(index)"
                class="ml-2 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
              >
                <TrashIcon class="w-5 h-5" />
              </button>
            </div>

            <div v-if="isEditing" class="grid grid-cols-3 gap-3">
              <div class="space-y-1">
                <label class="text-xs text-gray-600 dark:text-gray-400 block">Sets</label>
                <UiInput
                  v-model.number="editForm.exercises[index].sets"
                  type="number"
                  :min="1"
                  class="text-center"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-600 dark:text-gray-400 block">Reps</label>
                <UiInput
                  v-model.number="editForm.exercises[index].reps"
                  type="number"
                  :min="1"
                  class="text-center"
                />
              </div>
              <div class="space-y-1">
                <label class="text-xs text-gray-600 dark:text-gray-400 block">Weight (kg)</label>
                <UiInput
                  v-model.number="editForm.exercises[index].weight"
                  type="number"
                  :min="0"
                  class="text-center"
                />
              </div>
            </div>

            <div v-else class="grid grid-cols-3 gap-3">
              <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ exercise.sets }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Sets</div>
              </div>
              <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">{{ exercise.reps }}</div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">Reps</div>
              </div>
              <div class="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {{ exercise.weight || '-' }}
                </div>
                <div class="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  {{ exercise.weight ? 'kg' : 'Weight' }}
                </div>
              </div>
            </div>

            <div v-if="exercise.notes || isEditing" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <UiTextArea
                v-if="isEditing"
                v-model="editForm.exercises[index].notes"
                placeholder="Optional exercise notes..."
                :rows="2"
              />
              <p v-else class="text-sm text-gray-600 dark:text-gray-400 italic">{{ exercise.notes }}</p>
            </div>
          </div>
        </div>

        <!-- Edit Mode Actions -->
        <div v-if="isEditing" class="flex gap-3 pt-4">
          <UiButton
            @click="addExercise"
            variant="outline"
            full-width
            :icon="PlusCircleIcon"
          >
            Add Exercise
          </UiButton>
        </div>
      </UiCard>

      <!-- Save/Cancel Buttons -->
      <div v-if="isEditing" class="flex gap-3">
        <UiButton
          @click="cancelEdit"
          variant="secondary"
          class="flex-1"
        >
          Cancel
        </UiButton>
        <UiButton
          @click="saveChanges"
          variant="primary"
          class="flex-1"
        >
          Save Changes
        </UiButton>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UiModal v-model="confirmDelete" title="Delete Workout?" size="sm">
      <div class="space-y-4">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <p class="text-center text-gray-600 dark:text-gray-400">
          This action cannot be undone. The workout will be deleted from both local storage and the cloud.
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <UiButton
            @click="confirmDelete = false"
            variant="secondary"
            class="flex-1"
          >
            Cancel
          </UiButton>
          <UiButton
            @click="handleDelete"
            variant="danger"
            class="flex-1"
          >
            Delete
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'default',
  middleware: 'auth'
})

import {
  ExclamationCircleIcon,
  ArrowLeftIcon,
  FireIcon,
  CalendarIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  RectangleStackIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  PlusCircleIcon
} from '@heroicons/vue/24/outline'
import type { LocalWorkout } from '~/types'

const route = useRoute()
const router = useRouter()
const toast = useToast()
const { getWorkout, deleteWorkout, updateWorkout } = useWorkouts()

const workout = ref<LocalWorkout | undefined>()
const loading = ref(true)
const confirmDelete = ref(false)
const isEditing = ref(false)
const editForm = ref<{
  notes: string
  exercises: Array<{
    localId: string
    name: string
    sets: number
    reps: number
    weight: number
    notes?: string
  }>
}>({
  notes: '',
  exercises: []
})

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

const addExercise = () => {
  editForm.value.exercises.push({
    localId: crypto.randomUUID(),
    name: '',
    sets: 3,
    reps: 10,
    weight: 0
  })
}

const removeExercise = (index: number) => {
  editForm.value.exercises.splice(index, 1)
}

const cancelEdit = () => {
  isEditing.value = false
  // Reset form to current workout data
  if (workout.value) {
    editForm.value = {
      notes: workout.value.notes || '',
      exercises: workout.value.exercises.map(e => ({ ...e }))
    }
  }
}

const saveChanges = async () => {
  if (!workout.value) return

  const validExercises = editForm.value.exercises.filter(e => e.name.trim() !== '')

  if (validExercises.length === 0) {
    toast.error('At least one exercise is required')
    return
  }

  await updateWorkout(workout.value.localId, {
    notes: editForm.value.notes || undefined,
    exercises: validExercises
  })

  // Reload workout data
  workout.value = await getWorkout(workout.value.localId)
  isEditing.value = false
  toast.success('Workout updated successfully')
}

watch(() => workout.value, (newWorkout) => {
  if (newWorkout) {
    editForm.value = {
      notes: newWorkout.notes || '',
      exercises: newWorkout.exercises.map(e => ({ ...e }))
    }
  }
}, { immediate: true })

onMounted(async () => {
  const id = route.params.id as string
  workout.value = await getWorkout(id)
  loading.value = false
})
</script>
