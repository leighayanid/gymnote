import { localDB } from '~/utils/db'
import type { RestTimerSettings } from '~/types'

export const useRestTimer = () => {
  const isActive = ref(false)
  const isPaused = ref(false)
  const remainingTime = ref(0) // in seconds
  const settings = ref<RestTimerSettings>({
    enabled: true,
    defaultDuration: 120, // 2 minutes
    soundEnabled: true,
    vibrationEnabled: true
  })

  let intervalId: NodeJS.Timeout | null = null
  const { showNotification, hasPermission } = useNotifications()
  const { hapticHeavy, hapticSuccess, isEnabled: hapticsEnabled } = useHaptics()

  /**
   * Load settings from IndexedDB
   */
  const loadSettings = async (): Promise<void> => {
    try {
      const saved = await localDB.getRestTimerSettings()
      if (saved) {
        settings.value = { ...settings.value, ...saved }
      }
    } catch (error) {
      console.error('Error loading rest timer settings:', error)
    }
  }

  /**
   * Save settings to IndexedDB
   */
  const saveSettings = async (newSettings: Partial<RestTimerSettings>): Promise<void> => {
    try {
      settings.value = { ...settings.value, ...newSettings }
      await localDB.saveRestTimerSettings(settings.value)
    } catch (error) {
      console.error('Error saving rest timer settings:', error)
    }
  }

  /**
   * Start the timer
   * @param duration - Optional duration in seconds, defaults to settings
   */
  const startTimer = (duration?: number): void => {
    if (isActive.value && !isPaused.value) {
      // Timer already running
      return
    }

    if (isPaused.value) {
      // Resume from pause
      isPaused.value = false
    } else {
      // Start fresh
      remainingTime.value = duration ?? settings.value.defaultDuration
    }

    isActive.value = true

    // Clear any existing interval
    if (intervalId) {
      clearInterval(intervalId)
    }

    // Start countdown
    intervalId = setInterval(() => {
      if (remainingTime.value > 0) {
        remainingTime.value--
      } else {
        // Timer complete
        onTimerComplete()
      }
    }, 1000)
  }

  /**
   * Pause the timer
   */
  const pauseTimer = (): void => {
    isPaused.value = true
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /**
   * Reset the timer
   */
  const resetTimer = (): void => {
    isActive.value = false
    isPaused.value = false
    remainingTime.value = 0

    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  /**
   * Handle timer completion
   */
  const onTimerComplete = (): void => {
    resetTimer()

    // Show notification
    if (settings.value.soundEnabled && hasPermission.value) {
      showNotification('Rest Complete!', {
        body: 'Time to get back to work 💪',
        silent: false,
        requireInteraction: false
      })
    }

    // Trigger haptic feedback
    if (settings.value.vibrationEnabled && hapticsEnabled.value) {
      hapticSuccess()
    }
  }

  /**
   * Format time for display (MM:SS)
   */
  const formattedTime = computed(() => {
    const minutes = Math.floor(remainingTime.value / 60)
    const seconds = remainingTime.value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  })

  /**
   * Progress percentage (0-100)
   */
  const progress = computed(() => {
    if (!settings.value.defaultDuration) return 0
    const total = settings.value.defaultDuration
    return ((total - remainingTime.value) / total) * 100
  })

  // Load settings on mount
  onMounted(async () => {
    await loadSettings()
  })

  // Cleanup on unmount
  onUnmounted(() => {
    if (intervalId) {
      clearInterval(intervalId)
    }
  })

  return {
    isActive,
    isPaused,
    remainingTime,
    settings,
    formattedTime,
    progress,
    startTimer,
    pauseTimer,
    resetTimer,
    loadSettings,
    saveSettings
  }
}
