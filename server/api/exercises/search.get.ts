import { requireAuth } from '~/server/utils/auth'
import { logger } from '~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~/server/utils/rateLimit'
import { searchDefaultExercises } from '~/utils/defaultExercises'
import type { ExerciseSearchResult } from '~/types'

// In-memory cache for exercise searches
const searchCache = new Map<string, { results: ExerciseSearchResult[], timestamp: number }>()
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

export default defineEventHandler(async (event) => {
  // Rate limiting - more lenient for search
  await rateLimit(rateLimitPresets.lenient)(event)

  try {
    // Require authentication
    await requireAuth(event)

    // Get search query
    const query = getQuery(event)
    const searchTerm = (query.q as string || '').trim()
    const limit = Math.min(Number(query.limit) || 10, 20)

    // Return default exercises if no search term
    if (!searchTerm) {
      const defaults = searchDefaultExercises('', limit)
      return {
        results: defaults.map(ex => ({
          name: ex.name,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
        })),
        source: 'default',
      }
    }

    // Check cache first
    const cacheKey = `${searchTerm.toLowerCase()}_${limit}`
    const cachedData = searchCache.get(cacheKey)

    if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL) {
      logger.info({ query: searchTerm }, 'Exercise search cache hit')
      return {
        results: cachedData.results,
        source: 'cache',
      }
    }

    // Get API credentials from environment
    const apiKey = process.env.RAPIDAPI_KEY
    const apiHost = process.env.RAPIDAPI_HOST || 'exercisedb.p.rapidapi.com'

    // If API key is not configured, fall back to default exercises
    if (!apiKey || apiKey === 'your-rapidapi-key-here') {
      logger.warn('ExerciseDB API key not configured, using default exercises')
      const defaults = searchDefaultExercises(searchTerm, limit)
      return {
        results: defaults.map(ex => ({
          name: ex.name,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
        })),
        source: 'default',
      }
    }

    // Fetch from ExerciseDB API
    try {
      const apiUrl = `https://${apiHost}/exercises/name/${encodeURIComponent(searchTerm)}`

      logger.info({ query: searchTerm, url: apiUrl }, 'Fetching from ExerciseDB API')

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': apiKey,
          'X-RapidAPI-Host': apiHost,
        },
      })

      if (!response.ok) {
        logger.error({
          status: response.status,
          statusText: response.statusText
        }, 'ExerciseDB API error')

        // Fallback to default exercises on API error
        const defaults = searchDefaultExercises(searchTerm, limit)
        return {
          results: defaults.map(ex => ({
            name: ex.name,
            bodyPart: ex.bodyPart,
            target: ex.target,
            equipment: ex.equipment,
          })),
          source: 'default',
        }
      }

      const data = await response.json()

      // Transform API response to our format
      const results: ExerciseSearchResult[] = (Array.isArray(data) ? data : [])
        .slice(0, limit)
        .map((exercise: any) => ({
          id: exercise.id,
          name: exercise.name,
          bodyPart: exercise.bodyPart,
          target: exercise.target,
          equipment: exercise.equipment,
          gifUrl: exercise.gifUrl,
        }))

      // If API returned no results, fallback to default exercises
      if (results.length === 0) {
        const defaults = searchDefaultExercises(searchTerm, limit)
        return {
          results: defaults.map(ex => ({
            name: ex.name,
            bodyPart: ex.bodyPart,
            target: ex.target,
            equipment: ex.equipment,
          })),
          source: 'default',
        }
      }

      // Cache the successful results
      searchCache.set(cacheKey, {
        results,
        timestamp: Date.now(),
      })

      // Clean old cache entries (keep cache size under control)
      if (searchCache.size > 1000) {
        const sortedEntries = Array.from(searchCache.entries())
          .sort((a, b) => b[1].timestamp - a[1].timestamp)

        searchCache.clear()
        sortedEntries.slice(0, 500).forEach(([key, value]) => {
          searchCache.set(key, value)
        })
      }

      logger.info({ query: searchTerm, count: results.length }, 'Exercise search successful')

      return {
        results,
        source: 'api',
      }
    } catch (apiError: any) {
      logger.error({ error: apiError.message }, 'ExerciseDB API request failed')

      // Fallback to default exercises
      const defaults = searchDefaultExercises(searchTerm, limit)
      return {
        results: defaults.map(ex => ({
          name: ex.name,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
        })),
        source: 'default',
      }
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to search exercises')

    if (error.statusCode) {
      throw error
    }

    // Even on error, try to return default exercises
    try {
      const query = getQuery(event)
      const searchTerm = (query.q as string || '').trim()
      const limit = Math.min(Number(query.limit) || 10, 20)
      const defaults = searchDefaultExercises(searchTerm, limit)

      return {
        results: defaults.map(ex => ({
          name: ex.name,
          bodyPart: ex.bodyPart,
          target: ex.target,
          equipment: ex.equipment,
        })),
        source: 'default',
      }
    } catch {
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Failed to search exercises',
      })
    }
  }
})
