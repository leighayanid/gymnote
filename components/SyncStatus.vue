<template>
  <div v-if="showStatus" class="fixed bottom-4 right-4 z-50 max-w-sm">
    <div
      class="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 transition-all"
      :class="statusClass"
    >
      <div class="flex items-start gap-3">
        <!-- Icon -->
        <div class="flex-shrink-0">
          <component :is="statusIcon" class="w-5 h-5" :class="iconClass" />
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
            {{ statusTitle }}
          </p>
          <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {{ statusMessage }}
          </p>

          <!-- Retry button for errors -->
          <button
            v-if="syncError && canRetry"
            @click="handleRetry"
            class="mt-2 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          >
            Retry Sync
          </button>
        </div>

        <!-- Close button -->
        <button
          @click="closeStatus"
          class="flex-shrink-0 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>

      <!-- Progress bar for syncing -->
      <div v-if="isSyncing" class="mt-3">
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div class="bg-primary-600 h-1.5 rounded-full animate-pulse" :style="{ width: syncProgress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  isSyncing?: boolean
  syncError?: Error | null
  syncSuccess?: boolean
  pendingCount?: number
}>()

const emit = defineEmits<{
  retry: []
  close: []
}>()

const showStatus = ref(false)
const syncProgress = ref(0)

// Auto-show status when relevant
watch(() => [props.isSyncing, props.syncError, props.syncSuccess], () => {
  if (props.isSyncing || props.syncError || props.syncSuccess) {
    showStatus.value = true
  }

  // Auto-hide success message after 3 seconds
  if (props.syncSuccess) {
    setTimeout(() => {
      showStatus.value = false
    }, 3000)
  }
}, { immediate: true })

// Simulate progress for syncing
watch(() => props.isSyncing, (syncing) => {
  if (syncing) {
    syncProgress.value = 0
    const interval = setInterval(() => {
      syncProgress.value = Math.min(syncProgress.value + 10, 90)
    }, 200)

    return () => clearInterval(interval)
  } else {
    syncProgress.value = 100
  }
})

const statusClass = computed(() => {
  if (props.syncError) return 'border-red-300 dark:border-red-700'
  if (props.syncSuccess) return 'border-green-300 dark:border-green-700'
  if (props.isSyncing) return 'border-blue-300 dark:border-blue-700'
  return ''
})

const iconClass = computed(() => {
  if (props.syncError) return 'text-red-600 dark:text-red-400'
  if (props.syncSuccess) return 'text-green-600 dark:text-green-400'
  if (props.isSyncing) return 'text-blue-600 dark:text-blue-400 animate-spin'
  return 'text-gray-400'
})

const statusIcon = computed(() => {
  if (props.syncError) {
    return {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    }
  }
  if (props.syncSuccess) {
    return {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>'
    }
  }
  if (props.isSyncing) {
    return {
      template: '<svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>'
    }
  }
  return { template: '<div></div>' }
})

const statusTitle = computed(() => {
  if (props.syncError) return 'Sync Failed'
  if (props.syncSuccess) return 'Synced Successfully'
  if (props.isSyncing) return 'Syncing...'
  return 'Status'
})

const statusMessage = computed(() => {
  if (props.syncError) return props.syncError.message || 'Failed to sync your data. Please try again.'
  if (props.syncSuccess) return 'All your changes have been saved to the cloud.'
  if (props.isSyncing) return `Syncing ${props.pendingCount || 0} ${props.pendingCount === 1 ? 'item' : 'items'}...`
  return ''
})

const canRetry = computed(() => {
  return props.syncError && !props.isSyncing
})

const handleRetry = () => {
  emit('retry')
}

const closeStatus = () => {
  showStatus.value = false
  emit('close')
}
</script>
