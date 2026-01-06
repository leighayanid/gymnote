import { ref, onMounted } from 'vue'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
}

interface PerformanceMetric {
  name: string
  value: number
  timestamp: number
}

export const useAnalytics = () => {
  const isInitialized = ref(false)
  const userId = ref<string | null>(null)

  /**
   * Initialize analytics
   */
  const init = (user?: { id: string; email: string }) => {
    if (isInitialized.value) return

    userId.value = user?.id || null
    isInitialized.value = true

    // Track page view on initialization
    trackPageView()

    // Monitor performance metrics
    if (typeof window !== 'undefined' && 'performance' in window) {
      monitorPerformance()
    }
  }

  /**
   * Track custom event
   */
  const trackEvent = (event: AnalyticsEvent) => {
    if (!isInitialized.value) return

    try {
      // In production, send to analytics service (Google Analytics, Mixpanel, etc.)
      console.log('[Analytics] Event:', {
        ...event,
        userId: userId.value,
        timestamp: new Date().toISOString(),
      })

      // Example: Send to Google Analytics
      // if (typeof window !== 'undefined' && window.gtag) {
      //   window.gtag('event', event.name, event.properties)
      // }
    } catch (error) {
      console.error('Failed to track event:', error)
    }
  }

  /**
   * Track page view
   */
  const trackPageView = (path?: string) => {
    const currentPath = path || (typeof window !== 'undefined' ? window.location.pathname : '')

    trackEvent({
      name: 'page_view',
      properties: {
        path: currentPath,
        title: typeof document !== 'undefined' ? document.title : '',
      },
    })
  }

  /**
   * Track user action
   */
  const trackAction = (action: string, properties?: Record<string, any>) => {
    trackEvent({
      name: action,
      properties,
    })
  }

  /**
   * Track error
   */
  const trackError = (error: Error, context?: Record<string, any>) => {
    trackEvent({
      name: 'error',
      properties: {
        message: error.message,
        stack: error.stack,
        ...context,
      },
    })
  }

  /**
   * Monitor performance metrics
   */
  const monitorPerformance = () => {
    if (typeof window === 'undefined') return

    // Track Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        const metric: PerformanceMetric = {
          name: entry.name,
          value: entry.startTime,
          timestamp: Date.now(),
        }

        // Send to analytics
        trackEvent({
          name: 'performance_metric',
          properties: metric,
        })
      }
    })

    try {
      observer.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint'] })
    } catch (error) {
      console.error('Performance monitoring not supported:', error)
    }

    // Track page load time
    window.addEventListener('load', () => {
      const perfData = window.performance.timing
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart

      trackEvent({
        name: 'page_load_time',
        properties: {
          duration: pageLoadTime,
        },
      })
    })
  }

  /**
   * Set user properties
   */
  const setUserProperties = (properties: Record<string, any>) => {
    if (!isInitialized.value) return

    try {
      console.log('[Analytics] User properties:', properties)

      // Example: Send to Google Analytics
      // if (typeof window !== 'undefined' && window.gtag) {
      //   window.gtag('set', 'user_properties', properties)
      // }
    } catch (error) {
      console.error('Failed to set user properties:', error)
    }
  }

  return {
    isInitialized,
    init,
    trackEvent,
    trackPageView,
    trackAction,
    trackError,
    setUserProperties,
  }
}
