<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-primary-950 to-gray-900 relative overflow-hidden">
    <!-- Background decorative elements -->
    <div class="absolute inset-0 opacity-20">
      <div class="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full filter blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-primary-600 rounded-full filter blur-3xl"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 min-h-screen flex flex-col">
      <!-- Slides Container -->
      <div class="flex-1 flex items-center justify-center p-8">
        <div class="w-full max-w-4xl">
          <!-- Slide 1 -->
          <div v-show="currentSlide === 0" ref="slide1" class="text-center space-y-8">
            <div class="space-y-4">
              <div ref="slide1Icon" class="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border-2 border-white/20">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h1 ref="slide1Title" class="text-5xl md:text-6xl font-bold text-white">
                Welcome to Gymnote
              </h1>
              <p ref="slide1Subtitle" class="text-xl md:text-2xl text-primary-200 max-w-2xl mx-auto">
                Your ultimate fitness companion, built for athletes who never settle
              </p>
            </div>

            <div ref="slide1Image" class="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary-800 to-primary-900 border-2 border-white/10 shadow-2xl">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center space-y-4 p-8">
                  <svg class="w-24 h-24 text-white/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <p class="text-white/50 text-lg">Offline-First Architecture</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 2 -->
          <div v-show="currentSlide === 1" ref="slide2" class="text-center space-y-8">
            <div class="space-y-4">
              <div ref="slide2Icon" class="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border-2 border-white/20">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 ref="slide2Title" class="text-5xl md:text-6xl font-bold text-white">
                Track Every Rep
              </h2>
              <p ref="slide2Subtitle" class="text-xl md:text-2xl text-primary-200 max-w-2xl mx-auto">
                Log exercises, sets, reps, and weight with lightning-fast input
              </p>
            </div>

            <div ref="slide2Image" class="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary-800 to-primary-900 border-2 border-white/10 shadow-2xl">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center space-y-4 p-8">
                  <svg class="w-24 h-24 text-white/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                  <p class="text-white/50 text-lg">Detailed Progress Tracking</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Slide 3 -->
          <div v-show="currentSlide === 2" ref="slide3" class="text-center space-y-8">
            <div class="space-y-4">
              <div ref="slide3Icon" class="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto border-2 border-white/20">
                <svg class="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h2 ref="slide3Title" class="text-5xl md:text-6xl font-bold text-white">
                Crush Your Goals
              </h2>
              <p ref="slide3Subtitle" class="text-xl md:text-2xl text-primary-200 max-w-2xl mx-auto">
                Visualize progress, identify patterns, and dominate your fitness journey
              </p>
            </div>

            <div ref="slide3Image" class="relative w-full max-w-2xl mx-auto aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-primary-800 to-primary-900 border-2 border-white/10 shadow-2xl">
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center space-y-4 p-8">
                  <svg class="w-24 h-24 text-white/50 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <p class="text-white/50 text-lg">Achieve Your Best</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Navigation -->
      <div class="pb-12 space-y-8">
        <!-- Dots indicator -->
        <div class="flex justify-center gap-3">
          <button
            v-for="i in 3"
            :key="i"
            @click="goToSlide(i - 1)"
            class="transition-all"
            :class="[
              currentSlide === i - 1
                ? 'w-12 h-3 bg-white rounded-full'
                : 'w-3 h-3 bg-white/30 hover:bg-white/50 rounded-full'
            ]"
          />
        </div>

        <!-- Action buttons -->
        <div class="flex justify-center gap-4 px-8">
          <button
            v-if="currentSlide < 2"
            @click="nextSlide"
            class="px-8 py-4 bg-white text-primary-900 font-bold rounded-xl hover:bg-primary-50 transform hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Next
          </button>
          <button
            v-if="currentSlide === 2"
            @click="getStarted"
            class="px-12 py-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white font-bold rounded-xl hover:from-primary-600 hover:to-primary-700 transform hover:scale-105 active:scale-95 transition-all shadow-xl"
          >
            Get Started
          </button>
          <button
            v-if="currentSlide > 0"
            @click="prevSlide"
            class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all border border-white/20"
          >
            Back
          </button>
        </div>

        <!-- Skip button -->
        <div class="text-center">
          <button
            @click="getStarted"
            class="text-white/60 hover:text-white transition-colors text-sm font-medium"
          >
            Skip intro
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'

definePageMeta({
  layout: false,
  middleware: 'auth'
})

const { markWelcomeSeen } = useAuth()
const router = useRouter()

const currentSlide = ref(0)

const slide1 = ref<HTMLElement>()
const slide1Icon = ref<HTMLElement>()
const slide1Title = ref<HTMLElement>()
const slide1Subtitle = ref<HTMLElement>()
const slide1Image = ref<HTMLElement>()

const slide2 = ref<HTMLElement>()
const slide2Icon = ref<HTMLElement>()
const slide2Title = ref<HTMLElement>()
const slide2Subtitle = ref<HTMLElement>()
const slide2Image = ref<HTMLElement>()

const slide3 = ref<HTMLElement>()
const slide3Icon = ref<HTMLElement>()
const slide3Title = ref<HTMLElement>()
const slide3Subtitle = ref<HTMLElement>()
const slide3Image = ref<HTMLElement>()

const animateSlide = (slideNumber: number, direction: 'forward' | 'backward' = 'forward') => {
  const refs = slideNumber === 0
    ? [slide1Icon, slide1Title, slide1Subtitle, slide1Image]
    : slideNumber === 1
    ? [slide2Icon, slide2Title, slide2Subtitle, slide2Image]
    : [slide3Icon, slide3Title, slide3Subtitle, slide3Image]

  const xStart = direction === 'forward' ? 100 : -100

  refs.forEach((ref, index) => {
    if (ref.value) {
      gsap.fromTo(
        ref.value,
        {
          x: xStart,
          opacity: 0
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          delay: index * 0.15,
          ease: 'power3.out'
        }
      )
    }
  })
}

const nextSlide = () => {
  if (currentSlide.value < 2) {
    currentSlide.value++
    animateSlide(currentSlide.value, 'forward')
  }
}

const prevSlide = () => {
  if (currentSlide.value > 0) {
    currentSlide.value--
    animateSlide(currentSlide.value, 'backward')
  }
}

const goToSlide = (index: number) => {
  const direction = index > currentSlide.value ? 'forward' : 'backward'
  currentSlide.value = index
  animateSlide(currentSlide.value, direction)
}

const getStarted = async () => {
  markWelcomeSeen()
  await router.push('/dashboard')
}

onMounted(() => {
  // Initial animation for first slide
  animateSlide(0, 'forward')
})
</script>
