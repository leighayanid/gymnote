<template>
  <div class="min-h-screen bg-white flex flex-col">
    <!-- Offline indicator -->
    <div
      v-if="!isOnline"
      class="bg-yellow-500 text-white px-4 py-2 text-center text-sm font-medium"
    >
      Offline - Changes will sync when connection is restored
    </div>

    <!-- Sync indicator -->
    <div
      v-if="syncing"
      class="bg-blue-500 text-white px-4 py-2 text-center text-sm font-medium"
    >
      Syncing...
    </div>

    <!-- Main content -->
    <main class="flex-1">
      <slot />
    </main>

    <!-- Bottom navigation -->
    <nav class="border-t border-gray-200 bg-white">
      <div class="max-w-screen-xl mx-auto px-4">
        <div class="flex justify-around py-3">
          <NuxtLink
            to="/"
            class="flex flex-col items-center gap-1 px-6 py-2 text-sm"
            :class="[
              $route.path === '/'
                ? 'text-blue-600 font-medium'
                : 'text-gray-600'
            ]"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Today</span>
          </NuxtLink>

          <NuxtLink
            to="/history"
            class="flex flex-col items-center gap-1 px-6 py-2 text-sm"
            :class="[
              $route.path === '/history'
                ? 'text-blue-600 font-medium'
                : 'text-gray-600'
            ]"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>History</span>
          </NuxtLink>

          <NuxtLink
            to="/settings"
            class="flex flex-col items-center gap-1 px-6 py-2 text-sm"
            :class="[
              $route.path === '/settings'
                ? 'text-blue-600 font-medium'
                : 'text-gray-600'
            ]"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Settings</span>
          </NuxtLink>
        </div>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
const { isOnline, setupNetworkListener } = useNetwork()
const { syncing, setupAutoSync } = useSync()

onMounted(() => {
  setupNetworkListener()
  setupAutoSync()
})
</script>
