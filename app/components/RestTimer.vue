<template>
  <div
    :class="[
      'fixed z-40 transition-all duration-300',
      compact ? 'bottom-24 lg:bottom-8 right-6 lg:right-24' : 'bottom-24 lg:bottom-8 right-6 lg:right-6'
    ]"
  >
    <!-- Compact mode -->
    <button
      v-if="compact && !isActive"
      class="w-14 h-14 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg flex items-center justify-center transition-transform active:scale-95"
      @click="toggleExpanded"
    >
      <ClockIcon class="w-6 h-6" />
    </button>

    <!-- Timer running compact -->
    <button
      v-if="compact && isActive"
      class="relative w-16 h-16 rounded-full bg-primary-500 hover:bg-primary-600 text-white shadow-lg flex flex-col items-center justify-center transition-transform active:scale-95"
      @click="toggleExpanded"
    >
      <svg class="absolute inset-0 w-16 h-16 -rotate-90">
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          stroke-width="3"
          fill="none"
          class="text-primary-300 opacity-30"
        />
        <circle
          cx="32"
          cy="32"
          r="28"
          stroke="currentColor"
          stroke-width="3"
          fill="none"
          class="text-white transition-all duration-1000"
          :stroke-dasharray="circumference"
          :stroke-dashoffset="dashOffset"
          stroke-linecap="round"
        />
      </svg>
      <span class="text-xs font-bold z-10">{{ formattedTime }}</span>
    </button>

    <!-- Expanded mode -->
    <div
      v-if="!compact"
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-80 border border-gray-200 dark:border-gray-700"
    >
      <!-- Header -->
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Rest Timer</h3>
        <div class="flex items-center gap-2">
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            @click="openSettings"
          >
            <Cog6ToothIcon class="w-5 h-5" />
          </button>
          <button
            class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
            @click="toggleExpanded"
          >
            <XMarkIcon class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Timer display -->
      <div class="flex flex-col items-center justify-center py-8">
        <div class="relative w-48 h-48">
          <svg class="w-48 h-48 -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              class="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              stroke-width="8"
              fill="none"
              :class="isActive ? 'text-primary-500' : 'text-gray-300 dark:text-gray-600'"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="dashOffset"
              stroke-linecap="round"
              class="transition-all duration-1000"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-5xl font-bold text-gray-900 dark:text-white">
              {{ formattedTime }}
            </span>
            <span class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {{ isActive ? (isPaused ? 'Paused' : 'Resting') : 'Ready' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Controls -->
      <div class="flex items-center justify-center gap-3">
        <button
          v-if="!isActive"
          class="flex-1 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-semibold transition-colors"
          @click="handleStart"
        >
          Start
        </button>

        <template v-else>
          <button
            class="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
            @click="handlePause"
          >
            {{ isPaused ? 'Resume' : 'Pause' }}
          </button>
          <button
            class="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            @click="handleReset"
          >
            Reset
          </button>
        </template>
      </div>

      <!-- Quick duration buttons -->
      <div v-if="!isActive" class="flex items-center justify-center gap-2 mt-4">
        <button
          v-for="duration in [60, 90, 120, 180]"
          :key="duration"
          class="px-3 py-1.5 text-sm rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          @click="startCustomDuration(duration)"
        >
          {{ duration }}s
        </button>
      </div>
    </div>

    <!-- Settings Modal -->
    <Modal v-model:open="showSettings" title="Rest Timer Settings" size="md">
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Default Duration: {{ settings.defaultDuration }}s
          </label>
          <input
            v-model.number="settings.defaultDuration"
            type="range"
            min="30"
            max="300"
            step="30"
            class="w-full"
          />
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sound Notifications
          </label>
          <button
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.soundEnabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
            ]"
            @click="settings.soundEnabled = !settings.soundEnabled"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>

        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Vibration
          </label>
          <button
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.vibrationEnabled ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'
            ]"
            @click="settings.vibrationEnabled = !settings.vibrationEnabled"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.vibrationEnabled ? 'translate-x-6' : 'translate-x-1'
              ]"
            />
          </button>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end gap-3">
          <Button variant="outline" @click="showSettings = false">Cancel</Button>
          <Button @click="handleSaveSettings">Save</Button>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon, Cog6ToothIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const compact = ref(true)
const showSettings = ref(false)

const {
  isActive,
  isPaused,
  remainingTime,
  settings,
  formattedTime,
  progress,
  startTimer,
  pauseTimer,
  resetTimer,
  saveSettings
} = useRestTimer()

const { hapticMedium } = useHaptics()

// Calculate circle properties for progress ring
const radius = 88
const circumference = computed(() => 2 * Math.PI * radius)
const dashOffset = computed(() => {
  return circumference.value * (1 - progress.value / 100)
})

const toggleExpanded = () => {
  compact.value = !compact.value
  hapticMedium()
}

const openSettings = () => {
  showSettings.value = true
  hapticMedium()
}

const handleStart = () => {
  startTimer()
  hapticMedium()
}

const handlePause = () => {
  if (isPaused.value) {
    startTimer()
  } else {
    pauseTimer()
  }
  hapticMedium()
}

const handleReset = () => {
  resetTimer()
  hapticMedium()
}

const startCustomDuration = (duration: number) => {
  startTimer(duration)
  hapticMedium()
}

const handleSaveSettings = async () => {
  await saveSettings(settings.value)
  showSettings.value = false
  hapticMedium()
}
</script>
