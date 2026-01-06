<template>
  <div class="min-h-screen bg-black text-white overflow-x-hidden">
    <!-- Hero Section -->
    <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
      <!-- Dark background with subtle grain texture -->
      <div class="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
        <div class="absolute inset-0 opacity-[0.015]" style="background-image: url('data:image/svg+xml,%3Csvg width=\'200\' height=\'200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E');"></div>
      </div>

      <!-- Accent gradient orb -->
      <div ref="heroOrb" class="absolute top-1/4 right-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-[128px] opacity-20"></div>

      <!-- Grid pattern overlay -->
      <div class="absolute inset-0 opacity-[0.02]" style="background-image: linear-gradient(rgba(111, 88, 201, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(111, 88, 201, 0.3) 1px, transparent 1px); background-size: 50px 50px;"></div>

      <div class="relative z-10 max-w-7xl mx-auto px-6 py-20 text-center">
        <!-- Floating Trophy SVG Decoration -->
        <svg class="absolute top-20 right-10 w-32 h-32 opacity-10 animate-pulse hidden lg:block" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 30h40M50 30v15M35 45h30v20a15 15 0 01-30 0v-20zM45 85v10M55 85v10M40 95h20" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary-500"/>
          <path d="M30 45h-5a5 5 0 01-5-5v-5a5 5 0 015-5h5M70 45h5a5 5 0 005-5v-5a5 5 0 00-5-5h-5" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-primary-500"/>
          <circle cx="50" cy="55" r="3" fill="currentColor" class="text-primary-500"/>
        </svg>

        <!-- Floating Dumbbell SVG Decoration -->
        <svg class="absolute top-40 left-10 w-40 h-40 opacity-10 hidden lg:block" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 60h60M30 50v20M90 50v20M30 50h-5a5 5 0 01-5-5v-10a5 5 0 015-5h5M30 70h-5a5 5 0 00-5 5v10a5 5 0 005 5h5M90 50h5a5 5 0 005-5v-10a5 5 0 00-5-5h-5M90 70h5a5 5 0 015 5v10a5 5 0 01-5 5h-5" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" class="text-primary-500"/>
          <circle cx="25" cy="45" r="8" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
          <circle cx="25" cy="75" r="8" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
          <circle cx="95" cy="45" r="8" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
          <circle cx="95" cy="75" r="8" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
        </svg>

        <!-- Logo Mark -->
        <div ref="heroLogo" class="inline-flex items-center justify-center mb-12">
          <div class="w-16 h-16 bg-primary-500 flex items-center justify-center relative">
            <div class="absolute inset-0 bg-primary-500 blur-xl opacity-50"></div>
            <span class="relative text-3xl font-black text-black" style="font-family: 'Arial Black', sans-serif;">G</span>
          </div>
        </div>

        <!-- Main Headline -->
        <h1 ref="heroHeadline" class="text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter leading-none">
          <span class="block text-white">TRACK EVERY REP.</span>
          <span class="block bg-gradient-to-r from-primary-500 via-primary-400 to-primary-500 bg-clip-text text-transparent">EARN EVERY PR.</span>
        </h1>

        <!-- Subheadline -->
        <p ref="heroSubheadline" class="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 font-medium leading-relaxed">
          Offline-first workout tracker built for real training.<br class="hidden md:block" />
          Simple, fast logging. No distractions. Just progress.
        </p>

        <!-- CTA Buttons -->
        <div ref="heroCTA" class="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <button
            @click="showAuthModal = true; authMode = 'signup'"
            class="group px-10 py-5 bg-primary-500 text-black font-black text-lg uppercase tracking-wide hover:bg-primary-400 transition-all relative overflow-hidden"
          >
            <span class="relative z-10">Start Training</span>
            <div class="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
          <button
            @click="scrollToFeatures"
            class="px-10 py-5 bg-transparent border-2 border-white text-white font-bold text-lg uppercase tracking-wide hover:bg-white hover:text-black transition-all"
          >
            See How It Works
          </button>
        </div>

        <!-- App Preview Mockup -->
        <div ref="heroMockup" class="relative max-w-4xl mx-auto">
          <div class="bg-gray-900 border-2 border-gray-800 p-8 relative overflow-hidden">
            <!-- Subtle scan line effect -->
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary-500/5 to-transparent animate-pulse"></div>

            <div class="grid grid-cols-3 gap-4 text-left font-mono">
              <!-- Workout Log Display -->
              <div class="col-span-3 border-l-4 border-primary-500 pl-4 py-3 bg-black/30">
                <div class="text-xs text-gray-500 uppercase tracking-wider mb-1">Today's Session</div>
                <div class="text-2xl font-bold">Bench Press</div>
                <div class="text-sm text-gray-400">5 × 5 @ 225 lbs</div>
              </div>

              <div class="bg-gray-950 p-4 border border-gray-800">
                <div class="text-primary-500 text-3xl font-bold mb-1">156</div>
                <div class="text-xs text-gray-500 uppercase">Total Volume</div>
              </div>

              <div class="bg-gray-950 p-4 border border-gray-800">
                <div class="text-primary-500 text-3xl font-bold mb-1">23</div>
                <div class="text-xs text-gray-500 uppercase">Day Streak</div>
              </div>

              <div class="bg-gray-950 p-4 border border-gray-800 relative">
                <div class="absolute top-2 right-2 w-2 h-2 bg-primary-500 rounded-full animate-pulse"></div>
                <div class="text-primary-500 text-3xl font-bold mb-1">PR</div>
                <div class="text-xs text-gray-500 uppercase">New Record</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="relative py-32 bg-gradient-to-b from-black via-gray-950 to-black">
      <div class="max-w-7xl mx-auto px-6">
        <!-- Train Without Friction -->
        <div class="grid lg:grid-cols-2 gap-16 mb-32 items-center">
          <div ref="feature1" class="order-2 lg:order-1">
            <div class="inline-block px-4 py-1 border border-primary-500 text-primary-500 text-xs font-black uppercase tracking-widest mb-6">
              Friction-Free
            </div>
            <h2 class="text-5xl md:text-6xl font-black mb-6 leading-tight">
              TRAIN WITHOUT<br />FRICTION
            </h2>
            <div class="space-y-4 text-gray-400 text-lg leading-relaxed">
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">One-tap logging.</strong> Get in, log your sets, get out.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">No clutter, no social noise.</strong> Just you and your training.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Works offline, syncs automatically.</strong> Train anywhere, anytime.</span>
              </p>
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <div class="bg-gray-900 border border-gray-800 p-8 relative overflow-hidden">
              <!-- Background SVG decoration -->
              <svg class="absolute top-0 right-0 w-48 h-48 opacity-5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 100h30M130 100h30M70 80v40M130 80v40M70 80h60M70 120h60" stroke="currentColor" stroke-width="8" stroke-linecap="round" class="text-primary-500"/>
                <circle cx="85" cy="90" r="15" stroke="currentColor" stroke-width="6" fill="none" class="text-primary-500"/>
                <circle cx="85" cy="110" r="15" stroke="currentColor" stroke-width="6" fill="none" class="text-primary-500"/>
                <circle cx="115" cy="90" r="15" stroke="currentColor" stroke-width="6" fill="none" class="text-primary-500"/>
                <circle cx="115" cy="110" r="15" stroke="currentColor" stroke-width="6" fill="none" class="text-primary-500"/>
              </svg>

              <div class="relative z-10 font-mono">
                <div class="flex items-center justify-between mb-4 text-xs text-gray-500">
                  <span>WORKOUT.LOG</span>
                  <span class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                    SYNCED
                  </span>
                </div>
                <div class="space-y-2 text-sm">
                  <div class="flex justify-between py-2 border-b border-gray-800">
                    <span>Squat</span>
                    <span class="text-primary-500">3×8 @ 315</span>
                  </div>
                  <div class="flex justify-between py-2 border-b border-gray-800">
                    <span>Bench</span>
                    <span class="text-primary-500">5×5 @ 225</span>
                  </div>
                  <div class="flex justify-between py-2">
                    <span>Deadlift</span>
                    <span class="text-primary-500">1×5 @ 405</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress That Matters -->
        <div class="grid lg:grid-cols-2 gap-16 mb-32 items-center">
          <div ref="feature2Visual" class="bg-gray-900 border border-gray-800 p-8 relative overflow-hidden">
            <!-- Progress Chart SVG Decoration -->
            <svg class="absolute bottom-0 left-0 w-64 h-64 opacity-5" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 180L50 140L80 150L110 100L140 80L170 40" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" class="text-primary-500"/>
              <circle cx="20" cy="180" r="8" fill="currentColor" class="text-primary-500"/>
              <circle cx="50" cy="140" r="8" fill="currentColor" class="text-primary-500"/>
              <circle cx="80" cy="150" r="8" fill="currentColor" class="text-primary-500"/>
              <circle cx="110" cy="100" r="8" fill="currentColor" class="text-primary-500"/>
              <circle cx="140" cy="80" r="8" fill="currentColor" class="text-primary-500"/>
              <circle cx="170" cy="40" r="8" fill="currentColor" class="text-primary-500"/>
              <path d="M10 190h180M10 190v-180" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-gray-700"/>
            </svg>

            <div class="relative z-10 mb-6">
              <div class="text-xs text-gray-500 uppercase tracking-wider mb-2">Volume Progression</div>
              <div class="space-y-3">
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-mono">Week 1</span>
                    <span class="text-primary-500 font-bold">12,450 lbs</span>
                  </div>
                  <div class="h-2 bg-gray-950 relative overflow-hidden">
                    <div ref="progressBar1" class="absolute inset-y-0 left-0 bg-primary-500" style="width: 0%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-mono">Week 2</span>
                    <span class="text-primary-500 font-bold">14,200 lbs</span>
                  </div>
                  <div class="h-2 bg-gray-950 relative overflow-hidden">
                    <div ref="progressBar2" class="absolute inset-y-0 left-0 bg-primary-500" style="width: 0%"></div>
                  </div>
                </div>
                <div>
                  <div class="flex justify-between text-sm mb-1">
                    <span class="font-mono">Week 3</span>
                    <span class="text-primary-500 font-bold">16,850 lbs</span>
                  </div>
                  <div class="h-2 bg-gray-950 relative overflow-hidden">
                    <div ref="progressBar3" class="absolute inset-y-0 left-0 bg-primary-500" style="width: 0%"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div ref="feature2">
            <div class="inline-block px-4 py-1 border border-primary-500 text-primary-500 text-xs font-black uppercase tracking-widest mb-6">
              Data-Driven
            </div>
            <h2 class="text-5xl md:text-6xl font-black mb-6 leading-tight">
              PROGRESS THAT<br />MATTERS
            </h2>
            <div class="space-y-4 text-gray-400 text-lg leading-relaxed">
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Volume tracking.</strong> See your total work capacity grow.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">PR highlights.</strong> Celebrate every personal record.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Consistency metrics.</strong> Streaks and weekly trends that matter.</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Built for Athletes -->
        <div class="grid lg:grid-cols-2 gap-16 mb-32 items-center">
          <div ref="feature3" class="order-2 lg:order-1">
            <div class="inline-block px-4 py-1 border border-primary-500 text-primary-500 text-xs font-black uppercase tracking-widest mb-6">
              Athlete-First
            </div>
            <h2 class="text-5xl md:text-6xl font-black mb-6 leading-tight">
              BUILT FOR<br />ATHLETES
            </h2>
            <div class="space-y-4 text-gray-400 text-lg leading-relaxed">
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Templates for strength, hypertrophy, endurance.</strong> Start fast.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Custom workouts.</strong> Build exactly what you need.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Minimal setup, maximum focus.</strong> Made by lifters, for lifters.</span>
              </p>
            </div>
          </div>
          <div class="order-1 lg:order-2">
            <div class="grid grid-cols-2 gap-4 font-mono text-sm">
              <div class="bg-gray-900 border border-gray-800 p-6 hover:border-primary-500 transition-colors cursor-default relative overflow-hidden group">
                <svg class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 50h15M65 50h15M35 30v40M65 30v40M35 30h30M35 70h30" stroke="currentColor" stroke-width="4" stroke-linecap="round" class="text-primary-500"/>
                  <circle cx="42" cy="38" r="7" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
                  <circle cx="42" cy="62" r="7" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
                  <circle cx="58" cy="38" r="7" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
                  <circle cx="58" cy="62" r="7" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
                </svg>
                <div class="relative z-10">
                  <div class="text-primary-500 mb-2 text-2xl">⚡</div>
                  <div class="font-bold mb-1">STRENGTH</div>
                  <div class="text-xs text-gray-500">5×5, 5/3/1, Linear</div>
                </div>
              </div>
              <div class="bg-gray-900 border border-gray-800 p-6 hover:border-primary-500 transition-colors cursor-default relative overflow-hidden group">
                <svg class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M30 80Q30 40 50 40T70 80" stroke="currentColor" stroke-width="6" stroke-linecap="round" fill="none" class="text-primary-500"/>
                  <circle cx="50" cy="25" r="8" fill="currentColor" class="text-primary-500"/>
                </svg>
                <div class="relative z-10">
                  <div class="text-primary-500 mb-2 text-2xl">💪</div>
                  <div class="font-bold mb-1">HYPERTROPHY</div>
                  <div class="text-xs text-gray-500">Volume, PPL, Bro Split</div>
                </div>
              </div>
              <div class="bg-gray-900 border border-gray-800 p-6 hover:border-primary-500 transition-colors cursor-default relative overflow-hidden group">
                <svg class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 50Q30 20 50 50T80 50" stroke="currentColor" stroke-width="5" stroke-linecap="round" fill="none" class="text-primary-500"/>
                  <path d="M75 45l5 5-5 5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="text-primary-500"/>
                </svg>
                <div class="relative z-10">
                  <div class="text-primary-500 mb-2 text-2xl">🏃</div>
                  <div class="font-bold mb-1">ENDURANCE</div>
                  <div class="text-xs text-gray-500">Running, Cycling, HIIT</div>
                </div>
              </div>
              <div class="bg-gray-900 border border-gray-800 p-6 hover:border-primary-500 transition-colors cursor-default relative overflow-hidden group">
                <svg class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="25" stroke="currentColor" stroke-width="3" fill="none" class="text-primary-500"/>
                  <circle cx="50" cy="50" r="5" fill="currentColor" class="text-primary-500"/>
                  <path d="M50 50L65 35M50 50L70 50" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="text-primary-500"/>
                </svg>
                <div class="relative z-10">
                  <div class="text-primary-500 mb-2 text-2xl">🎯</div>
                  <div class="font-bold mb-1">CUSTOM</div>
                  <div class="text-xs text-gray-500">Your Way</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Community Without Distraction -->
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div ref="feature4Visual" class="bg-gray-900 border border-gray-800 p-8 font-mono">
            <div class="space-y-4 text-sm">
              <div class="border-l-2 border-primary-500 pl-4">
                <div class="text-xs text-gray-500 mb-1">@stronglifter94</div>
                <div class="text-gray-300">23-day streak, +15% volume this month</div>
              </div>
              <div class="border-l-2 border-gray-700 pl-4">
                <div class="text-xs text-gray-500 mb-1">@marathon_mike</div>
                <div class="text-gray-300">Logged 847 workouts, 2,156 miles</div>
              </div>
              <div class="border-l-2 border-gray-700 pl-4">
                <div class="text-xs text-gray-500 mb-1">@crossfit_sarah</div>
                <div class="text-gray-300">PR in Clean & Jerk: 185 lbs → 205 lbs</div>
              </div>
            </div>
          </div>
          <div ref="feature4">
            <div class="inline-block px-4 py-1 border border-primary-500 text-primary-500 text-xs font-black uppercase tracking-widest mb-6">
              Community-Driven
            </div>
            <h2 class="text-5xl md:text-6xl font-black mb-6 leading-tight">
              COMMUNITY<br />WITHOUT DISTRACTION
            </h2>
            <div class="space-y-4 text-gray-400 text-lg leading-relaxed">
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Optional sharing.</strong> Show your progress when you want.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Compare progress, not bodies.</strong> Real metrics, not likes.</span>
              </p>
              <p class="flex items-start gap-3">
                <span class="text-primary-500 mt-1">▸</span>
                <span><strong class="text-white">Motivation through consistency.</strong> Keep each other accountable.</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Social Proof -->
    <section class="relative py-32 bg-black">
      <div class="max-w-7xl mx-auto px-6">
        <div ref="socialProof" class="text-center mb-20">
          <h2 class="text-4xl md:text-5xl font-black mb-4">BUILT BY ATHLETES, FOR ATHLETES</h2>
          <p class="text-xl text-gray-400">Join thousands who train with purpose</p>
        </div>

        <!-- Metrics -->
        <div ref="metricsSection" class="grid md:grid-cols-3 gap-8 mb-20">
          <div class="text-center p-8 bg-gray-950 border border-gray-900">
            <div class="text-6xl font-black text-primary-500 mb-2 font-mono">
              <span ref="metric1">0</span>M+
            </div>
            <div class="text-sm text-gray-500 uppercase tracking-widest">Total Workouts Logged</div>
          </div>
          <div class="text-center p-8 bg-gray-950 border border-gray-900">
            <div class="text-6xl font-black text-primary-500 mb-2 font-mono">
              <span ref="metric2">0</span>M+
            </div>
            <div class="text-sm text-gray-500 uppercase tracking-widest">Total Reps Tracked</div>
          </div>
          <div class="text-center p-8 bg-gray-950 border border-gray-900">
            <div class="text-6xl font-black text-primary-500 mb-2 font-mono">
              <span ref="metric3">0</span>K+
            </div>
            <div class="text-sm text-gray-500 uppercase tracking-widest">Active Streaks</div>
          </div>
        </div>

        <!-- Testimonials - Training Log Style -->
        <div ref="testimonials" class="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div class="bg-gray-950 border-l-4 border-primary-500 p-6 font-mono">
            <div class="text-sm text-gray-500 mb-3">LOG_NOTE.TXT</div>
            <p class="text-lg mb-4 leading-relaxed">"This feels like a real training journal. No BS, just tracking. Finally."</p>
            <div class="text-sm text-gray-400">— @powerlifter_23</div>
          </div>
          <div class="bg-gray-950 border-l-4 border-gray-700 p-6 font-mono">
            <div class="text-sm text-gray-500 mb-3">LOG_NOTE.TXT</div>
            <p class="text-lg mb-4 leading-relaxed">"Best tracker I've used. Fast, offline, gets out of my way. Perfect."</p>
            <div class="text-sm text-gray-400">— @runner_elite</div>
          </div>
          <div class="bg-gray-950 border-l-4 border-gray-700 p-6 font-mono">
            <div class="text-sm text-gray-500 mb-3">LOG_NOTE.TXT</div>
            <p class="text-lg mb-4 leading-relaxed">"Built by someone who actually trains. You can tell."</p>
            <div class="text-sm text-gray-400">— @gym_veteran</div>
          </div>
          <div class="bg-gray-950 border-l-4 border-gray-700 p-6 font-mono">
            <div class="text-sm text-gray-500 mb-3">LOG_NOTE.TXT</div>
            <p class="text-lg mb-4 leading-relaxed">"Watching my volume go up week after week is addicting. Love it."</p>
            <div class="text-sm text-gray-400">— @bodybuilder_pro</div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="relative py-40 bg-gradient-to-b from-black to-gray-950">
      <div class="absolute inset-0 opacity-20">
        <div class="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full filter blur-[128px]"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <div ref="finalCTA" class="space-y-8">
          <h2 class="text-6xl md:text-7xl font-black leading-tight">
            BUILT FOR THOSE<br />WHO SHOW UP
          </h2>
          <p class="text-2xl text-gray-400 max-w-2xl mx-auto">
            Free to start. No ads. Your data, your progress.
          </p>
          <button
            @click="showAuthModal = true; authMode = 'signup'"
            class="group inline-flex items-center px-12 py-6 bg-primary-500 text-black font-black text-xl uppercase tracking-wider hover:bg-primary-400 transition-all relative overflow-hidden"
          >
            <span class="relative z-10">Start Tracking Today</span>
            <span class="relative z-10 ml-3 text-2xl group-hover:translate-x-1 transition-transform">→</span>
            <div class="absolute inset-0 bg-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
          </button>
        </div>
      </div>
    </section>

    <!-- Auth Modal -->
    <Transition
      enter-active-class="transition-all duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="showAuthModal"
        class="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click.self="showAuthModal = false"
      >
        <Transition
          enter-active-class="transition-all duration-300"
          enter-from-class="opacity-0 scale-95"
          enter-to-class="opacity-100 scale-100"
          leave-active-class="transition-all duration-200"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="showAuthModal" class="bg-gray-950 border-2 border-gray-800 max-w-md w-full p-8 relative">
            <!-- Close button -->
            <button
              @click="showAuthModal = false"
              class="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Logo -->
            <div class="flex items-center gap-3 mb-8">
              <div class="w-12 h-12 bg-primary-500 flex items-center justify-center">
                <span class="text-2xl font-black text-black">G</span>
              </div>
              <div>
                <div class="text-2xl font-black">GYMNOTE</div>
                <div class="text-xs text-gray-500 uppercase tracking-wider">Training Log</div>
              </div>
            </div>

            <!-- Tabs -->
            <div class="flex gap-2 mb-8 p-1 bg-black border border-gray-800">
              <button
                @click="authMode = 'login'"
                class="flex-1 py-3 font-bold uppercase tracking-wide text-sm transition-all"
                :class="[
                  authMode === 'login'
                    ? 'bg-primary-500 text-black'
                    : 'text-gray-400 hover:text-white'
                ]"
              >
                Sign In
              </button>
              <button
                @click="authMode = 'signup'"
                class="flex-1 py-3 font-bold uppercase tracking-wide text-sm transition-all"
                :class="[
                  authMode === 'signup'
                    ? 'bg-primary-500 text-black'
                    : 'text-gray-400 hover:text-white'
                ]"
              >
                Sign Up
              </button>
            </div>

            <!-- Login Form -->
            <form v-if="authMode === 'login'" @submit.prevent="handleLogin" class="space-y-5">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  v-model="loginForm.email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 bg-black border-2 border-gray-800 text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  v-model="loginForm.password"
                  type="password"
                  required
                  placeholder="••••••••"
                  class="w-full px-4 py-3 bg-black border-2 border-gray-800 text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none transition-colors font-mono"
                />
              </div>

              <!-- Error Message -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="loginError" class="p-4 bg-red-950/50 border-2 border-red-500 text-red-400 font-mono text-sm">
                  <div class="flex items-start gap-2">
                    <span class="text-red-500 font-bold">✕</span>
                    <div>
                      <div class="font-bold mb-1">Login Failed</div>
                      <div class="text-xs">{{ loginError }}</div>
                    </div>
                  </div>
                </div>
              </Transition>

              <button
                type="submit"
                :disabled="isLoading"
                class="w-full py-4 bg-primary-500 text-black font-black uppercase tracking-wider hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Signing In...' : 'Sign In' }}
              </button>
            </form>

            <!-- Signup Form -->
            <form v-if="authMode === 'signup'" @submit.prevent="handleSignup" class="space-y-5">
              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Full Name
                </label>
                <input
                  v-model="signupForm.name"
                  type="text"
                  required
                  placeholder="John Doe"
                  class="w-full px-4 py-3 bg-black border-2 border-gray-800 text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Email
                </label>
                <input
                  v-model="signupForm.email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  class="w-full px-4 py-3 bg-black border-2 border-gray-800 text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none transition-colors font-mono"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Password
                </label>
                <input
                  v-model="signupForm.password"
                  type="password"
                  required
                  placeholder="••••••••"
                  @focus="showPasswordRequirements = true"
                  class="w-full px-4 py-3 bg-black border-2 border-gray-800 text-white placeholder-gray-600 focus:border-primary-500 focus:outline-none transition-colors font-mono"
                />

                <!-- Password Requirements -->
                <div v-if="showPasswordRequirements || signupForm.password" class="mt-3 p-3 bg-black border border-gray-800 text-xs space-y-1.5">
                  <div class="flex items-center gap-2" :class="passwordValidation.minLength ? 'text-primary-500' : 'text-gray-600'">
                    <span>{{ passwordValidation.minLength ? '✓' : '○' }}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div class="flex items-center gap-2" :class="passwordValidation.hasUppercase ? 'text-primary-500' : 'text-gray-600'">
                    <span>{{ passwordValidation.hasUppercase ? '✓' : '○' }}</span>
                    <span>One uppercase letter</span>
                  </div>
                  <div class="flex items-center gap-2" :class="passwordValidation.hasLowercase ? 'text-primary-500' : 'text-gray-600'">
                    <span>{{ passwordValidation.hasLowercase ? '✓' : '○' }}</span>
                    <span>One lowercase letter</span>
                  </div>
                  <div class="flex items-center gap-2" :class="passwordValidation.hasNumber ? 'text-primary-500' : 'text-gray-600'">
                    <span>{{ passwordValidation.hasNumber ? '✓' : '○' }}</span>
                    <span>One number</span>
                  </div>
                </div>
              </div>

              <!-- Error Message -->
              <Transition
                enter-active-class="transition-all duration-300"
                enter-from-class="opacity-0 -translate-y-2"
                enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-200"
                leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div v-if="signupError" class="p-4 bg-red-950/50 border-2 border-red-500 text-red-400 font-mono text-sm">
                  <div class="flex items-start gap-2">
                    <span class="text-red-500 font-bold">✕</span>
                    <div>
                      <div class="font-bold mb-1">Signup Failed</div>
                      <div class="text-xs">{{ signupError }}</div>
                    </div>
                  </div>
                </div>
              </Transition>

              <button
                type="submit"
                :disabled="isLoading || !isPasswordValid"
                class="w-full py-4 bg-primary-500 text-black font-black uppercase tracking-wider hover:bg-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ isLoading ? 'Creating Account...' : 'Create Account' }}
              </button>
            </form>

            <div class="mt-6 text-center text-xs text-gray-500 font-mono">
              Demo app - Use strong password for sign up
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

definePageMeta({
  layout: false
})

const { login, signup } = useAuth()
const router = useRouter()
const toast = useToast()

const showAuthModal = ref(false)
const authMode = ref<'login' | 'signup'>('signup')
const isLoading = ref(false)
const showPasswordRequirements = ref(false)
const loginError = ref('')
const signupError = ref('')

const loginForm = ref({
  email: '',
  password: ''
})

const signupForm = ref({
  name: '',
  email: '',
  password: ''
})

// Clear errors when user starts typing
watch(() => loginForm.value.email, () => { loginError.value = '' })
watch(() => loginForm.value.password, () => { loginError.value = '' })
watch(() => signupForm.value.name, () => { signupError.value = '' })
watch(() => signupForm.value.email, () => { signupError.value = '' })
watch(() => signupForm.value.password, () => { signupError.value = '' })

// Clear errors when switching between login and signup modes
watch(authMode, () => {
  loginError.value = ''
  signupError.value = ''
})

// Password validation
const passwordValidation = computed(() => ({
  minLength: signupForm.value.password.length >= 8,
  hasUppercase: /[A-Z]/.test(signupForm.value.password),
  hasLowercase: /[a-z]/.test(signupForm.value.password),
  hasNumber: /[0-9]/.test(signupForm.value.password)
}))

const isPasswordValid = computed(() => {
  return Object.values(passwordValidation.value).every(v => v === true)
})

// Refs for animations
const heroOrb = ref<HTMLElement>()
const heroLogo = ref<HTMLElement>()
const heroHeadline = ref<HTMLElement>()
const heroSubheadline = ref<HTMLElement>()
const heroCTA = ref<HTMLElement>()
const heroMockup = ref<HTMLElement>()
const featuresSection = ref<HTMLElement>()
const feature1 = ref<HTMLElement>()
const feature2 = ref<HTMLElement>()
const feature2Visual = ref<HTMLElement>()
const feature3 = ref<HTMLElement>()
const feature4 = ref<HTMLElement>()
const feature4Visual = ref<HTMLElement>()
const progressBar1 = ref<HTMLElement>()
const progressBar2 = ref<HTMLElement>()
const progressBar3 = ref<HTMLElement>()
const socialProof = ref<HTMLElement>()
const metricsSection = ref<HTMLElement>()
const metric1 = ref<HTMLElement>()
const metric2 = ref<HTMLElement>()
const metric3 = ref<HTMLElement>()
const testimonials = ref<HTMLElement>()
const finalCTA = ref<HTMLElement>()

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

const handleLogin = async () => {
  isLoading.value = true
  loginError.value = ''
  try {
    await login(loginForm.value.email, loginForm.value.password)
    toast.success('Login successful', 'Welcome back!')
    showAuthModal.value = false
    await router.push('/dashboard')
  } catch (error: any) {
    console.error('Login error:', error)

    // Extract error message from the error object
    let errorMessage = 'An error occurred during login. Please try again.'

    if (error?.data?.message) {
      errorMessage = error.data.message
    } else if (error?.message) {
      errorMessage = error.message
    } else if (error?.statusMessage) {
      errorMessage = error.statusMessage
    }

    loginError.value = errorMessage
    toast.handleError(error, 'Login failed')
  } finally {
    isLoading.value = false
  }
}

const handleSignup = async () => {
  if (!isPasswordValid.value) {
    signupError.value = 'Please meet all password requirements'
    toast.error('Invalid password', 'Please meet all password requirements')
    return
  }

  isLoading.value = true
  signupError.value = ''
  try {
    await signup(signupForm.value.name, signupForm.value.email, signupForm.value.password)
    toast.success('Account created', 'Welcome to Gymnote!')
    showAuthModal.value = false
    await router.push('/welcome')
  } catch (error: any) {
    console.error('Signup error:', error)

    // Extract error message from the error object
    let errorMessage = 'An error occurred during signup. Please try again.'

    if (error?.data?.message) {
      errorMessage = error.data.message
    } else if (error?.message) {
      errorMessage = error.message
    } else if (error?.statusMessage) {
      errorMessage = error.statusMessage
    }

    signupError.value = errorMessage
    toast.handleError(error, 'Signup failed')
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  // Animate hero orb
  if (heroOrb.value) {
    gsap.to(heroOrb.value, {
      scale: 1.2,
      x: 50,
      y: 50,
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    })
  }

  // Hero entrance animations
  const heroTimeline = gsap.timeline()

  if (heroLogo.value) {
    heroTimeline.from(heroLogo.value, {
      scale: 0.5,
      opacity: 0,
      duration: 0.8,
      ease: 'back.out(2)'
    })
  }

  if (heroHeadline.value) {
    heroTimeline.from(heroHeadline.value, {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    }, '-=0.3')
  }

  if (heroSubheadline.value) {
    heroTimeline.from(heroSubheadline.value, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
  }

  if (heroCTA.value) {
    heroTimeline.from(heroCTA.value, {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
  }

  if (heroMockup.value) {
    heroTimeline.from(heroMockup.value, {
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    }, '-=0.5')
  }

  // Scroll-triggered animations for features
  if (feature1.value) {
    gsap.from(feature1.value, {
      scrollTrigger: {
        trigger: feature1.value,
        start: 'top 80%',
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  if (feature2.value) {
    gsap.from(feature2.value, {
      scrollTrigger: {
        trigger: feature2.value,
        start: 'top 80%',
      },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  // Animate progress bars when visible
  if (feature2Visual.value && progressBar1.value && progressBar2.value && progressBar3.value) {
    gsap.to(progressBar1.value, {
      scrollTrigger: {
        trigger: feature2Visual.value,
        start: 'top 70%',
      },
      width: '70%',
      duration: 1.5,
      ease: 'power2.out'
    })

    gsap.to(progressBar2.value, {
      scrollTrigger: {
        trigger: feature2Visual.value,
        start: 'top 70%',
      },
      width: '85%',
      duration: 1.5,
      delay: 0.2,
      ease: 'power2.out'
    })

    gsap.to(progressBar3.value, {
      scrollTrigger: {
        trigger: feature2Visual.value,
        start: 'top 70%',
      },
      width: '100%',
      duration: 1.5,
      delay: 0.4,
      ease: 'power2.out'
    })
  }

  if (feature3.value) {
    gsap.from(feature3.value, {
      scrollTrigger: {
        trigger: feature3.value,
        start: 'top 80%',
      },
      x: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  if (feature4.value) {
    gsap.from(feature4.value, {
      scrollTrigger: {
        trigger: feature4.value,
        start: 'top 80%',
      },
      x: 100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  // Animate metrics counting up
  if (metric1.value && metric2.value && metric3.value) {
    const animateCounter = (element: HTMLElement, target: number, suffix: string = '') => {
      gsap.to(element, {
        scrollTrigger: {
          trigger: metricsSection.value,
          start: 'top 70%',
        },
        innerText: target,
        duration: 2,
        snap: { innerText: 1 },
        ease: 'power1.out',
        onUpdate: function() {
          element.innerText = Math.ceil(parseFloat(element.innerText)) + suffix
        }
      })
    }

    animateCounter(metric1.value, 2.4, '')
    animateCounter(metric2.value, 15, '')
    animateCounter(metric3.value, 48, '')
  }

  // Animate social proof section
  if (socialProof.value) {
    gsap.from(socialProof.value, {
      scrollTrigger: {
        trigger: socialProof.value,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    })
  }

  if (testimonials.value) {
    const testimonialCards = testimonials.value.querySelectorAll(':scope > div')
    gsap.from(testimonialCards, {
      scrollTrigger: {
        trigger: testimonials.value,
        start: 'top 80%',
      },
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power2.out'
    })
  }

  // Animate final CTA
  if (finalCTA.value) {
    gsap.from(finalCTA.value, {
      scrollTrigger: {
        trigger: finalCTA.value,
        start: 'top 80%',
      },
      scale: 0.9,
      opacity: 0,
      duration: 1,
      ease: 'back.out(1.5)'
    })
  }
})
</script>
