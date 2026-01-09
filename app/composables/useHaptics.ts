export const useHaptics = () => {
  const isSupported = ref(false)
  const isEnabled = useLocalStorage('haptics-enabled', true)

  // Check if Vibration API is supported
  onMounted(() => {
    isSupported.value = 'vibrate' in navigator
  })

  /**
   * Trigger vibration with pattern or duration
   * @param pattern - Single number (duration in ms) or array of durations
   */
  const vibrate = (pattern: number | number[]): void => {
    if (!isSupported.value || !isEnabled.value) return

    try {
      navigator.vibrate(pattern)
    } catch (error) {
      console.error('Vibration error:', error)
    }
  }

  /**
   * Light haptic feedback (10ms)
   * For subtle interactions like taps, hovers
   */
  const hapticLight = (): void => {
    vibrate(10)
  }

  /**
   * Medium haptic feedback (20ms)
   * For button presses, selections
   */
  const hapticMedium = (): void => {
    vibrate(20)
  }

  /**
   * Heavy haptic feedback (30ms)
   * For important actions, completions
   */
  const hapticHeavy = (): void => {
    vibrate(30)
  }

  /**
   * Success pattern (short-pause-short)
   */
  const hapticSuccess = (): void => {
    vibrate([15, 50, 15])
  }

  /**
   * Error pattern (long vibration)
   */
  const hapticError = (): void => {
    vibrate([40, 100, 40])
  }

  /**
   * Stop any ongoing vibration
   */
  const stopVibration = (): void => {
    if (!isSupported.value) return
    navigator.vibrate(0)
  }

  /**
   * Enable or disable haptic feedback
   */
  const setHapticsEnabled = (enabled: boolean): void => {
    isEnabled.value = enabled
  }

  return {
    isSupported,
    isEnabled,
    vibrate,
    hapticLight,
    hapticMedium,
    hapticHeavy,
    hapticSuccess,
    hapticError,
    stopVibration,
    setHapticsEnabled
  }
}
