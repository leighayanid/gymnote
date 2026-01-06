<template>
  <div v-if="error" class="min-h-screen flex items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
    <div class="max-w-md w-full">
      <Card>
        <template #header>
          <div class="flex items-center gap-3 text-red-600 dark:text-red-400">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 class="text-xl font-semibold">Something went wrong</h2>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600 dark:text-gray-400">
            We encountered an unexpected error. Don't worry, your data is safe.
          </p>

          <div v-if="showDetails" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <p class="text-sm font-mono text-red-800 dark:text-red-300 break-all">
              {{ error.message || 'Unknown error' }}
            </p>
            <p v-if="error.statusCode" class="text-sm text-red-600 dark:text-red-400 mt-2">
              Status Code: {{ error.statusCode }}
            </p>
          </div>

          <div class="flex gap-3">
            <Button variant="primary" @click="handleRetry" class="flex-1">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Try Again
            </Button>
            <Button variant="outline" @click="showDetails = !showDetails">
              {{ showDetails ? 'Hide' : 'Show' }} Details
            </Button>
          </div>

          <div class="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              If this problem persists, please
              <nuxt-link to="/settings" class="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline">
                contact support
              </nuxt-link>
              or try clearing your app data.
            </p>
          </div>
        </div>
      </Card>
    </div>
  </div>

  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const error = ref<any>(null)
const showDetails = ref(false)

onErrorCaptured((err) => {
  error.value = err
  console.error('Error captured:', err)
  return false
})

const handleRetry = () => {
  error.value = null
  window.location.reload()
}
</script>
