export const useNotifications = () => {
  const permission = ref<NotificationPermission>('default')
  const isSupported = ref(false)

  // Check if Notifications API is supported
  onMounted(() => {
    isSupported.value = 'Notification' in window
    if (isSupported.value) {
      permission.value = Notification.permission
    }
  })

  /**
   * Request notification permission from user
   */
  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported.value) {
      console.warn('Notifications not supported')
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      permission.value = result
      return result
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }

  /**
   * Show a notification
   * @param title - Notification title
   * @param options - Notification options
   */
  const showNotification = (title: string, options?: NotificationOptions): void => {
    if (!isSupported.value) {
      console.warn('Notifications not supported')
      return
    }

    if (permission.value !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    try {
      new Notification(title, {
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        ...options
      })
    } catch (error) {
      console.error('Error showing notification:', error)
    }
  }

  /**
   * Computed property to check if permission is granted
   */
  const hasPermission = computed(() => permission.value === 'granted')

  /**
   * Check if user should be prompted for permission
   * Returns true if permission is 'default' (never asked)
   */
  const shouldPrompt = computed(() => permission.value === 'default')

  return {
    permission,
    isSupported,
    hasPermission,
    shouldPrompt,
    requestPermission,
    showNotification
  }
}
