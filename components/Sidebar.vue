<template>
  <div>
    <!-- Mobile menu button -->
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
    >
      <Bars3Icon v-if="!isOpen" class="w-6 h-6 text-gray-700 dark:text-gray-300" />
      <XMarkIcon v-else class="w-6 h-6 text-gray-700 dark:text-gray-300" />
    </button>

    <!-- Overlay for mobile -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      leave-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpen"
        @click="closeSidebar"
        class="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition
      enter-active-class="transition-transform duration-300"
      leave-active-class="transition-transform duration-300"
      enter-from-class="-translate-x-full"
      leave-to-class="-translate-x-full"
    >
      <aside
        v-if="isOpen || !isMobile"
        ref="sidebar"
        class="fixed top-0 left-0 h-screen w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 flex flex-col shadow-xl lg:shadow-none"
      >
        <!-- Logo -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <span class="text-white font-bold text-xl">G</span>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Gymnote</h1>
              <p class="text-xs text-gray-500 dark:text-gray-400">Track your fitness</p>
            </div>
          </div>
        </div>

        <!-- User info -->
        <div v-if="user" class="p-6 border-b border-gray-200 dark:border-gray-800">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
              <span class="text-white font-semibold text-sm">{{ userInitials }}</span>
            </div>
            <div class="flex-1 min-w-0">
              <div class="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {{ user.name }}
              </div>
              <div class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ user.email }}
              </div>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto p-4 space-y-1">
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            @click="closeSidebar"
            class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group"
            :class="[
              $route.path === item.to
                ? 'bg-primary-50 dark:bg-primary-950/50 text-primary-600 dark:text-primary-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            <component
              :is="item.icon"
              class="w-5 h-5 transition-transform group-hover:scale-110"
            />
            <span>{{ item.label }}</span>
            <ChevronRightIcon
              v-if="$route.path === item.to"
              class="w-4 h-4 ml-auto"
            />
          </NuxtLink>
        </nav>

        <!-- Stats -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800">
          <div class="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">This Week</span>
              <FireIcon class="w-5 h-5 text-primary-500" />
            </div>
            <div class="space-y-2">
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 dark:text-gray-400">Workouts</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ weekStats.workouts }}</span>
              </div>
              <div class="flex items-center justify-between text-xs">
                <span class="text-gray-600 dark:text-gray-400">Exercises</span>
                <span class="font-semibold text-gray-900 dark:text-white">{{ weekStats.exercises }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Theme toggle & Logout -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
          <button
            @click="toggleTheme"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <MoonIcon v-if="!isDark" class="w-5 h-5" />
            <SunIcon v-else class="w-5 h-5" />
            <span>{{ isDark ? 'Light' : 'Dark' }} Mode</span>
          </button>

          <button
            @click="handleLogout"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 transition-all"
          >
            <ArrowRightOnRectangleIcon class="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  ClockIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  FireIcon,
  MoonIcon,
  SunIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/vue/24/outline'

const { user, logout } = useAuth()
const { colorMode, toggleTheme } = useTheme()
const { workouts } = useWorkouts()
const router = useRouter()

const isDark = computed(() => colorMode.value === 'dark')

const isOpen = ref(false)
const isMobile = ref(true)
const sidebar = ref<HTMLElement>()

const navItems = [
  { label: 'Today', icon: HomeIcon, to: '/dashboard' },
  { label: 'History', icon: ClockIcon, to: '/history' },
  { label: 'Settings', icon: Cog6ToothIcon, to: '/settings' }
]

const userInitials = computed(() => {
  if (!user.value) return ''
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const weekStats = computed(() => {
  const now = new Date()
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const weekWorkouts = workouts.value.filter(w => new Date(w.date) >= weekAgo)

  return {
    workouts: weekWorkouts.length,
    exercises: weekWorkouts.reduce((sum, w) => sum + w.exercises.length, 0)
  }
})

const toggleSidebar = () => {
  isOpen.value = !isOpen.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    isOpen.value = false
  }
}

const handleLogout = async () => {
  logout()
  await router.push('/')
}

const checkMobile = () => {
  isMobile.value = window.innerWidth < 1024
  if (!isMobile.value) {
    isOpen.value = true
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  // Animate sidebar on mount
  if (sidebar.value && !isMobile.value) {
    const navItems = sidebar.value.querySelectorAll('nav a')
    gsap.from(navItems, {
      x: -20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power2.out',
      delay: 0.3
    })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
