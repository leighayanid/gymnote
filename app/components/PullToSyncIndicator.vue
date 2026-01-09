<template>
  <div
    v-show="isPulling"
    :style="{ transform: `translateY(${Math.min(pullDistance, 80)}px)` }"
    class="fixed top-0 left-0 right-0 z-50 flex items-center justify-center transition-transform duration-200"
  >
    <div
      :class="[
        'flex flex-col items-center gap-2 px-6 py-3 rounded-full shadow-lg transition-all duration-200',
        isThresholdReached
          ? 'bg-primary-500 text-white'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
      ]"
    >
      <!-- Spinner or arrow -->
      <div
        :class="[
          'transition-transform duration-200',
          isThresholdReached ? 'rotate-180' : 'rotate-0'
        ]"
      >
        <ArrowPathIcon
          v-if="isThresholdReached"
          class="w-5 h-5 animate-spin"
        />
        <ArrowDownIcon v-else class="w-5 h-5" />
      </div>

      <!-- Text -->
      <span class="text-xs font-medium">
        {{ isThresholdReached ? 'Release to sync' : 'Pull to sync' }}
      </span>

      <!-- Progress bar -->
      <div class="w-16 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          :style="{ width: `${Math.min(pullProgress, 100)}%` }"
          :class="[
            'h-full transition-all duration-200',
            isThresholdReached ? 'bg-white' : 'bg-primary-500'
          ]"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ArrowDownIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const props = defineProps<{
  isPulling: boolean
  pullDistance: number
  isThresholdReached: boolean
  pullProgress: number
}>()
</script>
