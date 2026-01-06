<template>
  <div class="min-h-screen flex overflow-hidden">
    <!-- Left side - Hero with athlete image -->
    <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-950 relative overflow-hidden">
      <!-- Animated gradient orbs -->
      <div class="absolute inset-0">
        <div ref="orb1" class="absolute top-0 -left-20 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl opacity-30"></div>
        <div ref="orb2" class="absolute bottom-0 -right-20 w-96 h-96 bg-primary-600 rounded-full filter blur-3xl opacity-30"></div>
        <div ref="orb3" class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-400 rounded-full filter blur-3xl opacity-20"></div>
      </div>

      <!-- Background pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
      </div>

      <!-- Content -->
      <div class="relative z-10 flex flex-col justify-center items-start p-12 lg:p-16 text-white w-full">
        <div ref="heroContent" class="space-y-10 max-w-xl">
          <!-- Logo Section -->
          <div ref="logoSection" class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                <span class="text-4xl font-black bg-gradient-to-br from-white to-primary-100 bg-clip-text text-transparent">G</span>
              </div>
              <div>
                <h1 class="text-5xl font-black tracking-tight">GYMNOTE</h1>
                <p class="text-primary-200 text-lg font-semibold">Your Fitness Journey</p>
              </div>
            </div>
          </div>

          <!-- Main Headline -->
          <div ref="headline" class="space-y-6">
            <h2 class="text-5xl lg:text-6xl font-black leading-[1.1] tracking-tight">
              Track Every Rep.<br />
              <span class="bg-gradient-to-r from-white via-primary-100 to-white bg-clip-text text-transparent">Crush Every Goal.</span>
            </h2>
            <p class="text-xl text-primary-100 leading-relaxed font-medium">
              The ultimate workout tracker for athletes who demand excellence. Offline-first, always ready when you are.
            </p>
          </div>

          <!-- Feature Pills -->
          <div ref="features" class="flex flex-wrap gap-4 pt-2">
            <div class="feature-pill group">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div class="font-bold text-lg">Offline First</div>
                <div class="text-sm text-primary-200 font-medium">Works anywhere</div>
              </div>
            </div>

            <div class="feature-pill group">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <div class="font-bold text-lg">Track Progress</div>
                <div class="text-sm text-primary-200 font-medium">Watch yourself grow</div>
              </div>
            </div>

            <div class="feature-pill group">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div class="font-bold text-lg">Quick & Easy</div>
                <div class="text-sm text-primary-200 font-medium">Log in seconds</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right side - Auth form -->
    <div class="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
      <!-- Subtle background gradient -->
      <div class="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-primary-100/30 dark:from-primary-950/20 dark:via-transparent dark:to-primary-900/10"></div>

      <div ref="formContainer" class="w-full max-w-md space-y-8 relative z-10">
        <!-- Mobile logo -->
        <div class="lg:hidden text-center space-y-4">
          <div class="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl border-2 border-primary-400">
            <span class="text-white font-black text-3xl">G</span>
          </div>
          <div>
            <h1 class="text-4xl font-black text-gray-900 dark:text-white tracking-tight">GYMNOTE</h1>
            <p class="text-primary-600 dark:text-primary-400 font-semibold">Your Fitness Journey</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex gap-2 p-1.5 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border-2 border-gray-200 dark:border-gray-800">
          <button
            @click="activeTab = 'login'"
            class="flex-1 py-3.5 px-4 rounded-xl font-bold text-base transition-all"
            :class="[
              activeTab === 'login'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            Sign In
          </button>
          <button
            @click="activeTab = 'signup'"
            class="flex-1 py-3.5 px-4 rounded-xl font-bold text-base transition-all"
            :class="[
              activeTab === 'signup'
                ? 'bg-gradient-to-br from-primary-500 to-primary-600 text-white shadow-md'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800'
            ]"
          >
            Sign Up
          </button>
        </div>

        <!-- Login Form -->
        <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" ref="loginFormRef" class="space-y-6">
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                v-model="loginForm.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none font-medium"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                v-model="loginForm.password"
                type="password"
                required
                placeholder="••••••••"
                class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ isLoading ? 'Signing In...' : 'Sign In' }}
          </button>
        </form>

        <!-- Signup Form -->
        <form v-if="activeTab === 'signup'" @submit.prevent="handleSignup" ref="signupFormRef" class="space-y-6">
          <div class="space-y-5">
            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Full Name
              </label>
              <input
                v-model="signupForm.name"
                type="text"
                required
                placeholder="John Doe"
                class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none font-medium"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              <input
                v-model="signupForm.email"
                type="email"
                required
                placeholder="you@example.com"
                class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none font-medium"
              />
            </div>

            <div>
              <label class="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                Password
              </label>
              <input
                v-model="signupForm.password"
                type="password"
                required
                placeholder="••••••••"
                @focus="showPasswordRequirements = true"
                class="w-full px-4 py-3.5 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary-500 dark:focus:border-primary-500 focus:ring-4 focus:ring-primary-500/20 transition-all outline-none font-medium"
              />

              <!-- Password Requirements -->
              <div v-if="showPasswordRequirements || signupForm.password" class="mt-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <p class="text-xs font-bold text-gray-700 dark:text-gray-300 mb-2">Password must contain:</p>
                <div class="space-y-1.5">
                  <div class="flex items-center gap-2 text-xs">
                    <div class="flex-shrink-0">
                      <svg v-if="passwordValidation.minLength" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span :class="passwordValidation.minLength ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400'">
                      At least 8 characters
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <div class="flex-shrink-0">
                      <svg v-if="passwordValidation.hasUppercase" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span :class="passwordValidation.hasUppercase ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400'">
                      One uppercase letter
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <div class="flex-shrink-0">
                      <svg v-if="passwordValidation.hasLowercase" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span :class="passwordValidation.hasLowercase ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400'">
                      One lowercase letter
                    </span>
                  </div>
                  <div class="flex items-center gap-2 text-xs">
                    <div class="flex-shrink-0">
                      <svg v-if="passwordValidation.hasNumber" class="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                      </svg>
                      <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clip-rule="evenodd" />
                      </svg>
                    </div>
                    <span :class="passwordValidation.hasNumber ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-gray-600 dark:text-gray-400'">
                      One number
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            :disabled="isLoading || !isPasswordValid"
            class="w-full py-4 px-6 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-700 hover:to-primary-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {{ isLoading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>

        <!-- Demo hint -->
        <div class="text-center text-sm text-gray-500 dark:text-gray-400 pt-2">
          <p class="font-medium">Demo app - Use strong password for sign up</p>
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
const isLoading = ref(false)
const showPasswordRequirements = ref(false)

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  email: '',
  password: ''
})

// Password validation computed properties
const passwordValidation = computed(() => ({
  minLength: signupForm.value.password.length >= 8,
  hasUppercase: /[A-Z]/.test(signupForm.value.password),
  hasLowercase: /[a-z]/.test(signupForm.value.password),
  hasNumber: /[0-9]/.test(signupForm.value.password)
}))

const isPasswordValid = computed(() => {
  return Object.values(passwordValidation.value).every(v => v === true)
})

// Refs for animation
const heroContent = ref<HTMLElement>()
const formContainer = ref<HTMLElement>()
const logoSection = ref<HTMLElement>()
const headline = ref<HTMLElement>()
const features = ref<HTMLElement>()
const orb1 = ref<HTMLElement>()
const orb2 = ref<HTMLElement>()
const orb3 = ref<HTMLElement>()
const loginFormRef = ref<HTMLElement>()
const signupFormRef = ref<HTMLElement>()

const handleLogin = async () => {
  isLoading.value = true
  try {
    await login(loginForm.value.email, loginForm.value.password)
    toast.success('Login successful', 'Welcome back!')
    await router.push('/welcome')
  } catch (error) {
    console.error('Login error:', error)
    toast.handleError(error, 'Login failed')
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  if (!isPasswordValid.value) {
    toast.error('Invalid password', 'Please meet all password requirements')
    return
  }

  isLoading.value = true
  try {
    await signup(signupForm.value.name, signupForm.value.email, signupForm.value.password)
    toast.success('Account created', 'Welcome to Gymnote!')
    await router.push('/welcome')
  } catch (error) {
    console.error('Signup error:', error)
    toast.handleError(error, 'Signup failed')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Animate gradient orbs with continuous motion
  if (orb1.value && orb2.value && orb3.value) {
    gsap.to(orb1.value, {
      x: 50,
      y: 30,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to(orb2.value, {
      x: -30,
      y: -50,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })

    gsap.to(orb3.value, {
      scale: 1.3,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // Animate hero content sections
  if (logoSection.value) {
    gsap.from(logoSection.value, {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power4.out'
    })
  }

  if (headline.value) {
    gsap.from(headline.value, {
      x: -80,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power4.out'
    })
  }

  if (features.value) {
    const featurePills = features.value.querySelectorAll('.feature-pill')
    gsap.from(featurePills, {
      scale: 0.8,
      opacity: 0,
      duration: 0.8,
      stagger: 0.15,
      delay: 0.5,
      ease: 'back.out(2)'
    })
  }

  // Animate form container
  if (formContainer.value) {
    gsap.from(formContainer.value, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.4,
      ease: 'power3.out'
    })
  }
})

// Animate tab switch with improved transitions
watch(activeTab, (newTab) => {
  nextTick(() => {
    const formRef = newTab === 'login' ? loginFormRef.value : signupFormRef.value
    if (formRef) {
      const children = formRef.children
      gsap.from(children, {
        y: 20,
        opacity: 0,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      })
    }
  })
})
</script>

<style scoped>
.feature-pill {
  @apply flex items-center gap-3 p-3 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 transition-all cursor-default;
}
</style>
