<template>
  <div class="max-w-screen-xl mx-auto px-4 py-6">
    <h1 class="text-3xl font-bold text-gray-900 mb-6">Settings</h1>

    <!-- Sync Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Sync</h2>

      <div class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-900">Connection Status</div>
            <div class="text-sm text-gray-600">
              {{ isOnline ? 'Online' : 'Offline' }}
            </div>
          </div>
          <div
            class="w-3 h-3 rounded-full"
            :class="[isOnline ? 'bg-green-500' : 'bg-gray-400']"
          ></div>
        </div>

        <div class="flex items-center justify-between">
          <div>
            <div class="font-medium text-gray-900">Last Sync</div>
            <div class="text-sm text-gray-600">
              {{ lastSyncText }}
            </div>
          </div>
        </div>

        <button
          @click="handleManualSync"
          :disabled="syncing || !isOnline"
          class="w-full bg-blue-600 text-white rounded-lg py-3 px-4 font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {{ syncing ? 'Syncing...' : 'Sync Now' }}
        </button>
      </div>
    </div>

    <!-- Storage Section -->
    <div class="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">Storage</h2>

      <div class="space-y-3 text-sm">
        <div class="flex justify-between">
          <span class="text-gray-600">Total Workouts</span>
          <span class="font-medium text-gray-900">{{ workouts.length }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Pending Sync</span>
          <span class="font-medium text-gray-900">{{ pendingCount }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-gray-600">Templates</span>
          <span class="font-medium text-gray-900">{{ templates.length }}</span>
        </div>
      </div>
    </div>

    <!-- App Info -->
    <div class="bg-white border border-gray-200 rounded-lg p-6">
      <h2 class="text-xl font-semibold text-gray-900 mb-4">About</h2>

      <div class="space-y-3 text-sm text-gray-600">
        <div>
          <div class="font-medium text-gray-900 mb-1">Gymnote</div>
          <div>Version 1.0.0</div>
        </div>
        <div>
          <div class="font-medium text-gray-900 mb-1">Features</div>
          <ul class="list-disc list-inside space-y-1">
            <li>Offline-first workout tracking</li>
            <li>Automatic cloud sync</li>
            <li>Workout templates</li>
            <li>PWA installable</li>
          </ul>
        </div>
        <div class="pt-4 border-t border-gray-200">
          <p class="text-xs text-gray-500">
            All data is stored locally on your device and synced to the cloud when online.
            Your workouts are always accessible, even without internet.
          </p>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="mt-6 bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 class="text-lg font-semibold text-red-900 mb-3">Danger Zone</h3>
      <p class="text-sm text-red-700 mb-4">
        Clear all local data. This will delete all workouts from your device.
        Synced workouts will remain in the cloud.
      </p>
      <button
        @click="showClearData = true"
        class="bg-red-600 text-white rounded-lg py-2 px-4 font-medium hover:bg-red-700"
      >
        Clear Local Data
      </button>
    </div>

    <!-- Clear Data Confirmation -->
    <div
      v-if="showClearData"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
      @click.self="showClearData = false"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full">
        <h3 class="text-lg font-semibold mb-2">Clear All Data?</h3>
        <p class="text-gray-600 mb-6">
          This will delete all local workouts and templates. Synced data will remain in the cloud.
        </p>
        <div class="flex gap-3">
          <button
            @click="showClearData = false"
            class="flex-1 border border-gray-300 rounded-lg py-2 font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            @click="handleClearData"
            class="flex-1 bg-red-600 text-white rounded-lg py-2 font-medium hover:bg-red-700"
          >
            Clear Data
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { isOnline } = useNetwork()
const { syncing, lastSyncTime, syncData } = useSync()
const { workouts, loadWorkouts } = useWorkouts()
const { templates, loadTemplates } = useTemplates()

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
