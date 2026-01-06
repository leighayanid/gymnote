<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6 space-y-6">
    <!-- Page Header -->
    <div class="mb-6">
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
        <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
          <Cog6ToothIcon class="w-6 h-6 text-white" />
        </div>
        Settings
      </h1>
      <p class="text-gray-600 dark:text-gray-400 mt-2 ml-13">Manage your preferences</p>
    </div>

    <!-- Appearance Section -->
    <UiCard>
      <template #header>
        <div class="flex items-center gap-2">
          <PaintBrushIcon class="w-5 h-5 text-primary-500" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Appearance</h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-900 dark:text-white">Theme</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">
              Choose your preferred theme
            </div>
          </div>
          <button
            @click="toggleTheme"
            class="relative inline-flex h-11 w-20 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            :class="[
              colorMode === 'dark' ? 'bg-primary-600' : 'bg-gray-300'
            ]"
          >
            <span class="sr-only">Toggle theme</span>
            <span
              class="inline-block h-9 w-9 transform rounded-full bg-white shadow-lg transition-transform flex items-center justify-center"
              :class="[
                colorMode === 'dark' ? 'translate-x-10' : 'translate-x-1'
              ]"
            >
              <MoonIcon v-if="colorMode === 'dark'" class="w-5 h-5 text-primary-600" />
              <SunIcon v-else class="w-5 h-5 text-gray-600" />
            </span>
          </button>
        </div>
      </div>
    </UiCard>

    <!-- Sync Section -->
    <UiCard>
      <template #header>
        <div class="flex items-center gap-2">
          <ArrowPathIcon class="w-5 h-5 text-primary-500" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Sync</h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="flex items-center gap-3">
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :class="[isOnline ? 'bg-green-100 dark:bg-green-950' : 'bg-gray-200 dark:bg-gray-700']"
            >
              <WifiIcon
                class="w-5 h-5"
                :class="[isOnline ? 'text-green-600 dark:text-green-400' : 'text-gray-400']"
              />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Connection Status</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ isOnline ? 'Online' : 'Offline' }}
              </div>
            </div>
          </div>
          <div
            class="w-3 h-3 rounded-full animate-pulse"
            :class="[isOnline ? 'bg-green-500' : 'bg-gray-400']"
          ></div>
        </div>

        <div class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center">
              <ClockIcon class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div class="font-medium text-gray-900 dark:text-white">Last Sync</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {{ lastSyncText }}
              </div>
            </div>
          </div>
        </div>

        <UiButton
          @click="handleManualSync"
          :disabled="syncing || !isOnline"
          :loading="syncing"
          variant="primary"
          size="lg"
          full-width
          :icon="ArrowPathIcon"
        >
          {{ syncing ? 'Syncing...' : 'Sync Now' }}
        </UiButton>
      </div>
    </UiCard>

    <!-- Storage Section -->
    <UiCard>
      <template #header>
        <div class="flex items-center gap-2">
          <CircleStackIcon class="w-5 h-5 text-primary-500" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Storage</h2>
        </div>
      </template>

      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <RectangleStackIcon class="w-5 h-5" />
            <span>Total Workouts</span>
          </div>
          <span class="font-semibold text-gray-900 dark:text-white text-lg">{{ workouts.length }}</span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <ClockIcon class="w-5 h-5" />
            <span>Pending Sync</span>
          </div>
          <span
            class="font-semibold text-lg"
            :class="[pendingCount > 0 ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-900 dark:text-white']"
          >
            {{ pendingCount }}
          </span>
        </div>
        <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <div class="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <DocumentDuplicateIcon class="w-5 h-5" />
            <span>Templates</span>
          </div>
          <span class="font-semibold text-gray-900 dark:text-white text-lg">{{ templates.length }}</span>
        </div>
      </div>
    </UiCard>

    <!-- App Info -->
    <UiCard>
      <template #header>
        <div class="flex items-center gap-2">
          <InformationCircleIcon class="w-5 h-5 text-primary-500" />
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">About</h2>
        </div>
      </template>

      <div class="space-y-4">
        <div class="p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-lg border border-primary-200 dark:border-primary-800">
          <div class="flex items-center gap-3 mb-2">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <div class="font-bold text-gray-900 dark:text-white">Gymnote</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">Version 1.0.0</div>
            </div>
          </div>
        </div>

        <div>
          <div class="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
            <SparklesIcon class="w-4 h-4 text-primary-500" />
            Features
          </div>
          <ul class="space-y-2">
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircleIcon class="w-5 h-5 text-green-500 flex-shrink-0" />
              Offline-first workout tracking
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircleIcon class="w-5 h-5 text-green-500 flex-shrink-0" />
              Automatic cloud sync
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircleIcon class="w-5 h-5 text-green-500 flex-shrink-0" />
              Workout templates
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircleIcon class="w-5 h-5 text-green-500 flex-shrink-0" />
              PWA installable
            </li>
            <li class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircleIcon class="w-5 h-5 text-green-500 flex-shrink-0" />
              Dark mode support
            </li>
          </ul>
        </div>

        <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-400 flex items-start gap-2">
            <ShieldCheckIcon class="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-500" />
            <span>All data is stored locally on your device and synced to the cloud when online. Your workouts are always accessible, even without internet.</span>
          </p>
        </div>
      </div>
    </UiCard>

    <!-- Data Management -->
    <UiCard>
      <template #header>
        <div class="flex items-center gap-2">
          <ExclamationTriangleIcon class="w-5 h-5 text-red-500" />
          <h2 class="text-lg font-semibold text-red-900 dark:text-red-400">Danger Zone</h2>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Clear all local data. This will delete all workouts from your device. Synced workouts will remain in the cloud.
        </p>
        <UiButton
          @click="showClearData = true"
          variant="danger"
          size="lg"
          full-width
          :icon="TrashIcon"
        >
          Clear Local Data
        </UiButton>
      </div>
    </UiCard>

    <!-- Clear Data Confirmation -->
    <UiModal v-model="showClearData" title="Clear All Data?" size="sm">
      <div class="space-y-4">
        <div class="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mx-auto">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <p class="text-center text-gray-600 dark:text-gray-400">
          This will delete all local workouts and templates. Synced data will remain in the cloud.
        </p>
      </div>

      <template #footer>
        <div class="flex gap-3">
          <UiButton
            @click="showClearData = false"
            variant="secondary"
            class="flex-1"
          >
            Cancel
          </UiButton>
          <UiButton
            @click="handleClearData"
            variant="danger"
            class="flex-1"
          >
            Clear Data
          </UiButton>
        </div>
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import {
  Cog6ToothIcon,
  PaintBrushIcon,
  MoonIcon,
  SunIcon,
  ArrowPathIcon,
  WifiIcon,
  ClockIcon,
  CircleStackIcon,
  RectangleStackIcon,
  DocumentDuplicateIcon,
  InformationCircleIcon,
  SparklesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

const { isOnline } = useNetwork()
const { syncing, lastSyncTime, syncData } = useSync()
const { workouts, loadWorkouts } = useWorkouts()
const { templates, loadTemplates } = useTemplates()
const { colorMode, toggleTheme } = useTheme()

const showClearData = ref(false)

const lastSyncText = computed(() => {
  if (!lastSyncTime.value) return 'Never'

  const now = new Date()
  const diff = now.getTime() - new Date(lastSyncTime.value).getTime()
  const minutes = Math.floor(diff / 60000)

  if (minutes < 1) return 'Just now'
  if (minutes === 1) return '1 minute ago'
  if (minutes < 60) return `${minutes} minutes ago`

  const hours = Math.floor(minutes / 60)
  if (hours === 1) return '1 hour ago'
  if (hours < 24) return `${hours} hours ago`

  const days = Math.floor(hours / 24)
  if (days === 1) return '1 day ago'
  return `${days} days ago`
})

const pendingCount = computed(() => {
  return workouts.value.filter(w => w.syncStatus === 'pending').length
})

const handleManualSync = async () => {
  await syncData()
  await loadWorkouts()
}

const handleClearData = async () => {
  // Clear IndexedDB
  indexedDB.deleteDatabase('gymnote-db')

  // Reload
  window.location.reload()
}

onMounted(async () => {
  await loadWorkouts()
  await loadTemplates()
})
</script>
