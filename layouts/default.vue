<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col">
    <!-- Status Indicators -->
    <div v-if="!isOnline || syncing" class="relative z-50">
      <!-- Offline indicator -->
      <div
        v-if="!isOnline"
        class="bg-yellow-500 dark:bg-yellow-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2"
      >
        <WifiIcon class="w-4 h-4" />
        <span>Offline - Changes will sync when connection is restored</span>
      </div>

      <!-- Sync indicator -->
      <div
        v-if="syncing"
        class="bg-primary-500 dark:bg-primary-600 text-white px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2"
      >
        <ArrowPathIcon class="w-4 h-4 animate-spin" />
        <span>Syncing...</span>
      </div>
    </div>

    <!-- Header -->
    <header class="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Gymnote</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Track your fitness</p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <!-- Sync status badge -->
            <div v-if="isOnline" class="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-xs font-medium">
              <div class="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              Online
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main content -->
    <main class="flex-1 pb-20">
      <slot />
    </main>

    <!-- Bottom navigation -->
    <nav class="fixed bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex justify-around">
          <NuxtLink
            to="/"
            class="flex flex-col items-center gap-1 px-6 py-3 text-xs font-medium transition-colors relative group"
            :class="[
              $route.path === '/'
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
          >
            <HomeIcon class="w-6 h-6" />
            <span>Today</span>
            <div v-if="$route.path === '/'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-t-full"></div>
          </NuxtLink>

          <NuxtLink
            to="/history"
            class="flex flex-col items-center gap-1 px-6 py-3 text-xs font-medium transition-colors relative group"
            :class="[
              $route.path === '/history'
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
          >
            <ClockIcon class="w-6 h-6" />
            <span>History</span>
            <div v-if="$route.path === '/history'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-t-full"></div>
          </NuxtLink>

          <NuxtLink
            to="/settings"
            class="flex flex-col items-center gap-1 px-6 py-3 text-xs font-medium transition-colors relative group"
            :class="[
              $route.path === '/settings'
                ? 'text-primary-600 dark:text-primary-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400'
            ]"
          >
            <Cog6ToothIcon class="w-6 h-6" />
            <span>Settings</span>
            <div v-if="$route.path === '/settings'" class="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-500 rounded-t-full"></div>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { HomeIcon, ClockIcon, Cog6ToothIcon, WifiIcon, ArrowPathIcon } from '@heroicons/vue/24/outline'

const { isOnline, setupNetworkListener } = useNetwork()
const { syncing, setupAutoSync } = useSync()

onMounted(() => {
  setupNetworkListener()
  setupAutoSync()
})
</script>
