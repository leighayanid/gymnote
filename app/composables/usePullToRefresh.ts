export const usePullToRefresh = () => {
  const isPulling = ref(false)
  const pullDistance = ref(0)
  const threshold = 80 // px
  const maxPullDistance = 120

  let startY = 0
  let currentY = 0

  /**
   * Setup pull-to-refresh gesture handling
   * @param callback - Function to call when pull threshold is reached
   */
  const setupPullToRefresh = (callback: () => Promise<void>) => {
    const handleTouchStart = (e: TouchEvent) => {
      // Only start if page is scrolled to top
      if (window.scrollY > 0) return

      startY = e.touches[0].clientY
      isPulling.value = true
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.value) return

      currentY = e.touches[0].clientY
      const distance = currentY - startY

      // Only pull down (positive distance)
      if (distance > 0) {
        // Apply resistance to pull distance
        pullDistance.value = Math.min(
          distance * 0.5, // 50% resistance
          maxPullDistance
        )

        // Prevent default scrolling when pulling
        if (pullDistance.value > 10) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling.value) return

      // Check if threshold was reached
      if (pullDistance.value >= threshold) {
        try {
          await callback()
        } catch (error) {
          console.error('Pull-to-refresh error:', error)
        }
      }

      // Reset state
      isPulling.value = false
      pullDistance.value = 0
      startY = 0
      currentY = 0
    }

    // Add event listeners
    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    // Return cleanup function
    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }

  /**
   * Check if threshold is reached (for UI feedback)
   */
  const isThresholdReached = computed(() => pullDistance.value >= threshold)

  /**
   * Progress percentage (0-100)
   */
  const pullProgress = computed(() => {
    return Math.min((pullDistance.value / threshold) * 100, 100)
  })

  return {
    isPulling,
    pullDistance,
    isThresholdReached,
    pullProgress,
    setupPullToRefresh
  }
}
