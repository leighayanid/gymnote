import { localDB } from '~/utils/db'
import type { ExerciseSearchResult } from '~/types'

export const useExercises = () => {
  const loading = ref(false)
  const error = ref<string | null>(null)

  /**
   * Search exercises with cache-first strategy
   * 1. Check IndexedDB cache first
   * 2. If cache miss or insufficient results, call API
   * 3. Cache API results for future use
   */
  const searchExercises = async (query: string, limit = 10): Promise<ExerciseSearchResult[]> => {
    loading.value = true
    error.value = null

    try {
      // If query is empty, return cached popular exercises
      if (!query || query.trim() === '') {
        const cached = await localDB.getCachedExercises()
        loading.value = false
        return cached.slice(0, limit)
      }

      const trimmedQuery = query.trim().toLowerCase()

      // First, try to get from cache
      const cachedResults = await localDB.getCachedExercises(trimmedQuery)

      // If we have enough cached results, return them immediately
      if (cachedResults.length >= Math.min(limit, 5)) {
        loading.value = false
        return cachedResults.slice(0, limit)
      }

      // Otherwise, fetch from API
      try {
        const response = await $fetch<{ results: ExerciseSearchResult[], source: string }>(
          '/api/exercises/search',
          {
            params: {
              q: trimmedQuery,
              limit,
            },
          }
        )

        const results = response.results || []

        // Cache the results for future use
        if (results.length > 0) {
          // Cache each exercise in the background (don't await)
          results.forEach(async (exercise) => {
            try {
              await localDB.saveExerciseToCache(exercise)
            } catch (cacheError) {
              console.error('Failed to cache exercise:', cacheError)
            }
          })
        }

        loading.value = false
        return results
      } catch (apiError: any) {
        console.error('API error, falling back to cache:', apiError)

        // On API error, return whatever we have in cache
        const fallbackResults = await localDB.getCachedExercises(trimmedQuery)

        if (fallbackResults.length > 0) {
          error.value = 'Using cached results (offline)'
          loading.value = false
          return fallbackResults.slice(0, limit)
        }

        // If cache is also empty, throw error
        throw apiError
      }
    } catch (err: any) {
      console.error('Exercise search error:', err)
      error.value = err.message || 'Failed to search exercises'
      loading.value = false
      return []
    }
  }

  /**
   * Get cached exercises only (useful for offline mode)
   */
  const getCachedExercises = async (query?: string, limit = 10): Promise<ExerciseSearchResult[]> => {
    try {
      const cached = await localDB.getCachedExercises(query)
      return cached.slice(0, limit)
    } catch (err) {
      console.error('Failed to get cached exercises:', err)
      return []
    }
  }

  /**
   * Clear exercise cache
   */
  const clearCache = async (): Promise<void> => {
    try {
      await localDB.clearExerciseCache()
    } catch (err) {
      console.error('Failed to clear exercise cache:', err)
      throw err
    }
  }

  /**
   * Remove old cached exercises (older than 7 days)
   */
  const cleanupCache = async (daysOld = 7): Promise<void> => {
    try {
      await localDB.removeOldCachedExercises(daysOld)
    } catch (err) {
      console.error('Failed to cleanup exercise cache:', err)
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    searchExercises,
    getCachedExercises,
    clearCache,
    cleanupCache,
  }
}
