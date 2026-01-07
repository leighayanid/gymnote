<template>
  <div class="min-h-screen bg-[#050505] text-white overflow-x-hidden font-sans selection:bg-primary-500 selection:text-black">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-6 mix-blend-difference">
      <div class="max-w-7xl mx-auto flex justify-between items-center">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white flex items-center justify-center">
            <span class="text-xl font-black text-black">G</span>
          </div>
          <span class="text-xl font-bold tracking-tight">GYMNOTE</span>
        </div>
        <button 
          @click="showAuthModal = true; authMode = 'login'"
          class="text-sm font-bold uppercase tracking-widest hover:text-primary-500 transition-colors"
        >
          Login
        </button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center pt-20">
      <div class="absolute inset-0 z-0">
        <div class="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505] to-[#050505] z-10"></div>
        <div class="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(100,50,255,0.15),transparent_50%)]"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        <div class="order-2 lg:order-1">
          <h1 ref="heroHeadline" class="text-7xl md:text-8xl lg:text-[10rem] font-black leading-[0.85] tracking-tighter mb-8 mix-blend-overlay">
            LIFT.<br>
            TRACK.<br>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-600">REPEAT.</span>
          </h1>
          <p ref="heroSub" class="text-xl text-gray-400 max-w-md mb-10 font-light leading-relaxed">
            The no-nonsense workout tracker for athletes who demand precision. Offline-first. Zero distractions.
          </p>
          <div ref="heroCTA" class="flex gap-6">
            <button 
              @click="showAuthModal = true; authMode = 'signup'"
              class="group relative px-8 py-4 bg-white text-black font-bold text-lg overflow-hidden"
            >
              <span class="relative z-10 group-hover:text-white transition-colors duration-300">START TRAINING</span>
              <div class="absolute inset-0 bg-primary-600 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>

        <div class="order-1 lg:order-2 relative perspective-1000">
          <div ref="heroImage" class="relative z-10 transform-gpu preserve-3d">
            <img src="/hero-app-mockup.png" alt="Gymnote App Interface" class="w-full max-w-md mx-auto drop-shadow-2xl rounded-[2rem] border-8 border-gray-900/50" />
            <!-- Floating Elements -->
            <div class="absolute -right-10 top-1/4 bg-gray-900/90 backdrop-blur-md p-4 rounded-xl border border-white/10 shadow-2xl floating-card">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <div>
                  <div class="text-sm font-bold">New PR!</div>
                  <div class="text-xs text-gray-400">Bench Press: 225 lbs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Bento Grid Features -->
    <section class="py-32 px-6 relative">
      <div class="max-w-7xl mx-auto">
        <div class="mb-20">
          <span class="text-primary-500 font-mono text-sm tracking-widest uppercase block mb-4">Features</span>
          <h2 class="text-5xl md:text-7xl font-black tracking-tighter">ENGINEERED FOR <br>PERFORMANCE</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[400px]">
          <!-- Card 1: Large Span -->
          <div ref="bento1" class="md:col-span-2 bg-[#0A0A0A] rounded-3xl p-10 border border-white/5 relative overflow-hidden group hover:border-primary-500/30 transition-colors duration-500">
            <div class="absolute inset-0 bg-gradient-to-br from-primary-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div class="relative z-10 h-full flex flex-col justify-between">
              <div>
                <h3 class="text-3xl font-black mb-4">Focus Mode</h3>
                <p class="text-gray-400 text-lg max-w-md">Distraction-free logging interface designed for the gym floor. Large buttons, dark mode, quick inputs.</p>
              </div>
              <div class="flex gap-4 opacity-50 grayscale group-hover:grayscale-0 transition-all duration-500">
                <!-- Abstract UI elements -->
                <div class="w-full h-32 bg-gray-900 rounded-xl border border-white/10 p-4">
                  <div class="w-3/4 h-4 bg-gray-800 rounded mb-3"></div>
                  <div class="w-1/2 h-4 bg-gray-800 rounded"></div>
                  <div class="mt-6 flex gap-2">
                    <div class="w-12 h-12 rounded-full bg-primary-500/20"></div>
                    <div class="flex-1 h-12 bg-gray-800 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Card 2: Analytics -->
          <div ref="bento2" class="bg-[#0A0A0A] rounded-3xl p-10 border border-white/5 relative overflow-hidden group hover:border-primary-500/30 transition-colors duration-500">
             <div class="absolute top-0 right-0 p-10 opacity-20 group-hover:scale-110 transition-transform duration-700">
               <svg class="w-32 h-32 text-primary-500" fill="currentColor" viewBox="0 0 24 24"><path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/></svg>
             </div>
             <div class="relative z-10 h-full flex flex-col justify-end">
               <h3 class="text-3xl font-black mb-2">Analytics</h3>
               <p class="text-gray-400">Vizualize your volume volume visualization and strength progression over time.</p>
             </div>
          </div>

          <!-- Card 3: Offline First -->
          <div ref="bento3" class="bg-[#0A0A0A] rounded-3xl p-10 border border-white/5 relative overflow-hidden group hover:border-primary-500/30 transition-colors duration-500">
             <div class="relative z-10">
               <div class="w-16 h-16 rounded-2xl bg-gray-900 border border-white/10 flex items-center justify-center mb-8 group-hover:bg-primary-500/20 transition-colors duration-300">
                 <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/></svg>
               </div>
               <h3 class="text-3xl font-black mb-2">Offline First</h3>
               <p class="text-gray-400">No signal? No problem. Data syncs automatically when you're back online.</p>
             </div>
          </div>

          <!-- Card 4: Templates -->
          <div ref="bento4" class="md:col-span-2 bg-[#0A0A0A] rounded-3xl p-10 border border-white/5 relative overflow-hidden group hover:border-primary-500/30 transition-colors duration-500 flex items-center">
            <div class="grid md:grid-cols-2 gap-8 w-full">
              <div>
                <h3 class="text-3xl font-black mb-4">Custom Templates</h3>
                <p class="text-gray-400 text-lg">Create routines for Push/Pull/Legs, Upper/Lower, or full body splits. Copy, paste, modify.</p>
              </div>
              <div class="grid grid-cols-2 gap-3 opacity-60 group-hover:opacity-100 transition-opacity duration-500">
                <div class="bg-gray-900 p-4 rounded-xl border border-white/10 text-center">
                  <div class="font-bold text-primary-500">PPL</div>
                  <div class="text-xs text-gray-500">Push Pull Legs</div>
                </div>
                <div class="bg-gray-900 p-4 rounded-xl border border-white/10 text-center">
                  <div class="font-bold text-blue-500">5/3/1</div>
                  <div class="text-xs text-gray-500">Strength</div>
                </div>
                <div class="bg-gray-900 p-4 rounded-xl border border-white/10 text-center">
                  <div class="font-bold text-green-500">UL</div>
                  <div class="text-xs text-gray-500">Upper Lower</div>
                </div>
                <div class="bg-gray-900 p-4 rounded-xl border border-white/10 text-center flex items-center justify-center">
                  <span class="text-xl">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Infinite Text Marquee -->
    <div class="py-20 border-y border-white/5 bg-[#0A0A0A] overflow-hidden whitespace-nowrap">
      <div ref="marquee" class="inline-block text-[120px] font-black leading-none text-transparent stroke-text opacity-20">
        STRENGTH • HYPERTROPHY • ENDURANCE • POWER • SPEED • STRENGTH • HYPERTROPHY • ENDURANCE • POWER • SPEED •
      </div>
    </div>

    <!-- Final CTA -->
    <section class="h-screen flex items-center justify-center relative overflow-hidden">
      <div class="text-center z-10 px-6">
        <h2 class="text-6xl md:text-9xl font-black mb-8 tracking-tighter">
          READY TO <span class="text-primary-500">WORK?</span>
        </h2>
        <button 
          @click="showAuthModal = true; authMode = 'signup'"
          class="px-12 py-6 bg-white text-black font-black text-2xl hover:scale-105 transition-transform duration-300 rounded-full"
        >
          JOIN NOW
        </button>
      </div>
      <!-- Background Video/Gradient Effect -->
      <div class="absolute inset-0 z-0 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent"></div>
    </section>

    <!-- Auth Modal (Reused Logic) -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div v-if="showAuthModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-xl" @click="showAuthModal = false"></div>
        <div class="bg-[#0A0A0A] border border-white/10 p-8 rounded-3xl w-full max-w-md relative z-10 shadow-2xl">
          <button @click="showAuthModal = false" class="absolute top-6 right-6 text-gray-400 hover:text-white">✕</button>
          
          <h2 class="text-3xl font-black mb-1">{{ authMode === 'login' ? 'WELCOME BACK' : 'START NOW' }}</h2>
          <p class="text-gray-500 mb-8 text-sm">Enter your details below.</p>

          <div class="flex bg-gray-900 rounded-lg p-1 mb-8">
            <button 
              @click="authMode = 'login'"
              class="flex-1 py-2 text-sm font-bold rounded-md transition-colors"
              :class="authMode === 'login' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'"
            >
              LOGIN
            </button>
            <button 
              @click="authMode = 'signup'"
              class="flex-1 py-2 text-sm font-bold rounded-md transition-colors"
              :class="authMode === 'signup' ? 'bg-white text-black' : 'text-gray-400 hover:text-white'"
            >
              SIGN UP
            </button>
          </div>

          <form @submit.prevent="authMode === 'login' ? handleLogin() : handleSignup()" class="space-y-4">
            <div v-if="authMode === 'signup'">
              <input v-model="signupForm.name" type="text" placeholder="Full Name" class="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 hover:border-white/20 transition-colors" required />
            </div>
            <div>
              <input v-if="authMode === 'login'" v-model="loginForm.email" type="email" placeholder="Email Address" class="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 hover:border-white/20 transition-colors" required />
              <input v-else v-model="signupForm.email" type="email" placeholder="Email Address" class="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 hover:border-white/20 transition-colors" required />
            </div>
            <div>
              <input v-if="authMode === 'login'" v-model="loginForm.password" type="password" placeholder="Password" class="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 hover:border-white/20 transition-colors" required />
              <input v-else v-model="signupForm.password" type="password" placeholder="Password" class="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary-500 hover:border-white/20 transition-colors" required />
            </div>

            <div v-if="error" class="text-red-500 text-sm font-bold">{{ error }}</div>

            <button type="submit" class="w-full bg-primary-600 hover:bg-primary-500 text-white font-bold py-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
              {{ isLoading ? 'PROCESSING...' : (authMode === 'login' ? 'LOGIN' : 'CREATE ACCOUNT') }}
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

definePageMeta({ layout: false })

const { login, signup } = useAuth()
const router = useRouter()
const toast = useToast()

const showAuthModal = ref(false)
const authMode = ref<'login' | 'signup'>('signup')
const isLoading = ref(false)
const error = ref('')

// Form Data
const loginForm = ref({ email: '', password: '' })
const signupForm = ref({ name: '', email: '', password: '' })

// DOM Refs
const heroHeadline = ref<HTMLElement>()
const heroSub = ref<HTMLElement>()
const heroCTA = ref<HTMLElement>()
const heroImage = ref<HTMLElement>()
const bento1 = ref<HTMLElement>()
const bento2 = ref<HTMLElement>()
const bento3 = ref<HTMLElement>()
const bento4 = ref<HTMLElement>()
const marquee = ref<HTMLElement>()

const handleLogin = async () => {
  isLoading.value = true
  error.value = ''
  try {
    await login(loginForm.value.email, loginForm.value.password)
    showAuthModal.value = false
    router.push('/dashboard')
    toast.success('Welcome back!')
  } catch (e: any) {
    error.value = e.message || 'Login failed'
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  isLoading.value = true
  error.value = ''
  try {
    await signup(signupForm.value.name, signupForm.value.email, signupForm.value.password)
    showAuthModal.value = false
    router.push('/welcome')
    toast.success('Account created!')
  } catch (e: any) {
    error.value = e.message || 'Signup failed'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Hero Animations
  const tl = gsap.timeline()
  
  if (heroHeadline.value) {
    const chars = heroHeadline.value.children
    tl.from(heroHeadline.value, { y: 100, opacity: 0, duration: 1.2, ease: "power4.out", skewY: 5 })
  }
  
  if (heroSub.value) tl.from(heroSub.value, { y: 20, opacity: 0, duration: 0.8 }, "-=0.8")
  if (heroCTA.value) tl.from(heroCTA.value, { y: 20, opacity: 0, duration: 0.8 }, "-=0.6")
  
  if (heroImage.value) {
    gsap.from(heroImage.value, { 
      scale: 0.8, 
      opacity: 0, 
      duration: 1.5, 
      ease: "power2.out" 
    })
    
    // Floating effect
    gsap.to(heroImage.value, {
      y: -20,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    })
    
    // Parallax on scroll
    gsap.to(heroImage.value, {
      scrollTrigger: {
        trigger: heroImage.value,
        start: "top center",
        end: "bottom top",
        scrub: 1
      },
      y: 100
    })
  }

  // Bento Grid Stagger
  const bentoCards = [bento1.value, bento2.value, bento3.value, bento4.value]
  gsap.from(bentoCards, {
    scrollTrigger: {
      trigger: bento1.value, // trigger when first card visible
      start: "top 80%"
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.1,
    ease: "power2.out"
  })
  
  // Marquee
  if (marquee.value) {
    gsap.to(marquee.value, {
      xPercent: -50,
      repeat: -1,
      duration: 20,
      ease: "linear"
    })
  }
})
</script>

<style scoped>
.stroke-text {
  -webkit-text-stroke: 1px rgba(255, 255, 255, 0.2);
}

.perspective-1000 {
  perspective: 1000px;
}

.preserve-3d {
  transform-style: preserve-3d;
}

.floating-card {
  transform: translateZ(50px);
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateZ(50px) translateY(0); }
  50% { transform: translateZ(50px) translateY(-10px); }
}
</style>
