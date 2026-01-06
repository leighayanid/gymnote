<template>
  <div class="min-h-screen flex">
    <!-- Left side - Hero with athlete image -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 relative overflow-hidden">
      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-10">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-start p-16 text-white">
        <div ref="heroContent" class="space-y-8">
          <div class="space-y-4">
            <div class="flex items-center gap-3">
              <div class="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                <span class="text-3xl font-bold">G</span>
              </div>
              <div>
                <h1 class="text-4xl font-bold">Gymnote</h1>
                <p class="text-primary-200">Your Fitness Journey</p>
              </div>
            </div>
          </div>

          <div class="space-y-4 max-w-md">
            <h2 class="text-3xl font-bold leading-tight">
              Track every rep.<br />
              Crush every goal.
            </h2>
            <p class="text-lg text-primary-100 leading-relaxed">
              The ultimate workout tracker for athletes who demand excellence. Offline-first, always ready when you are.
            </p>
          </div>

          <div class="flex flex-wrap gap-6 pt-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div class="font-semibold">Offline First</div>
                <div class="text-sm text-primary-200">Works anywhere</div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div class="font-semibold">Track Progress</div>
                <div class="text-sm text-primary-200">Watch yourself grow</div>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div class="font-semibold">Quick & Easy</div>
                <div class="text-sm text-primary-200">Log in seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Auth form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50 dark:bg-gray-950">
      <div ref="formContainer" class="w-full max-w-md space-y-8">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center space-y-3">
          <div class="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto">
            <span class="text-white font-bold text-2xl">G</span>
          </div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Gymnote</h1>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 p-1 bg-gray-200 dark:bg-gray-900 rounded-xl">
          <button
            @click="activeTab = 'login'"
            class="flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all"
            :class="[
              activeTab === 'login'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            Sign In
          </button>
          <button
            @click="activeTab = 'signup'"
            class="flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all"
            :class="[
              activeTab === 'signup'
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Sign In
          </button>
        </form>

        <!-- Signup Form -->
        <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" class="space-y-6">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                v-model="signupForm.name"
                type="text"
                required
                placeholder="John Doe"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                v-model="signupForm.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                v-model="signupForm.password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            Create Account
          </button>
        </form>

        <!-- Demo hint -->
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
          <p>This is a demo - enter any email and password</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({
  layout: false
})

const { login, signup } = useAuth()
const router = useRouter()
const toast = useToast()

const activeTab = ref<'login' | 'signup'>('login')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  email: '',
  password: ''
})

const heroContent = ref<HTMLElement>()
const formContainer = ref<HTMLElement>()

const handleLogin = async () => {
  try {
    await login(loginForm.value.email, loginForm.value.password)
    toast.success('Login successful', 'Welcome back!')
    await router.push('/welcome')
  } catch (error) {
    console.error('Login error:', error)
    toast.handleError(error, 'Login failed')
  }
}

const handleSignup = async () => {
  try {
    await signup(signupForm.value.name, signupForm.value.email, signupForm.value.password)
    toast.success('Account created', 'Welcome to Gymnote!')
    await router.push('/welcome')
  } catch (error) {
    console.error('Signup error:', error)
    toast.handleError(error, 'Signup failed')
  }
}

onMounted(() => {
  // Animate hero content on mount
  if (heroContent.value) {
    const children = heroContent.value.children
    gsap.from(children, {
      x: -50,
      opacity: 0,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out'
    })
  }

  // Animate form container
  if (formContainer.value) {
    gsap.from(formContainer.value, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      delay: 0.3,
      ease: 'power3.out'
    })
  }
})

// Animate tab switch
watch(activeTab, () => {
  const formElements = activeTab.value === 'login'
    ? document.querySelector('form')?.children
    : document.querySelector('form')?.children

  if (formElements) {
    gsap.from(formElements, {
      y: 20,
      opacity: 0,
      duration: 0.4,
      stagger: 0.1,
      ease: 'power2.out'
    })
  }
})
</script>
