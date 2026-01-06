import type { H3Event } from 'h3'

interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  keyGenerator?: (event: H3Event) => string
}

/**
 * Rate limiting middleware
 */
export function rateLimit(config: RateLimitConfig) {
  const {
    maxRequests = 100,
    windowMs = 60000, // 1 minute
    keyGenerator = (event: H3Event) => {
      // Use IP address as default key
      const forwarded = getHeader(event, 'x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : event.node.req.socket.remoteAddress
      return ip || 'unknown'
    },
  } = config

  return async (event: H3Event) => {
    const key = keyGenerator(event)
    const now = Date.now()

    let entry = rateLimitStore.get(key)

    // Reset if window has passed
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 0,
        resetTime: now + windowMs,
      }
      rateLimitStore.set(key, entry)
    }

    entry.count++

    // Set rate limit headers
    setHeader(event, 'X-RateLimit-Limit', maxRequests.toString())
    setHeader(event, 'X-RateLimit-Remaining', Math.max(0, maxRequests - entry.count).toString())
    setHeader(event, 'X-RateLimit-Reset', entry.resetTime.toString())

    if (entry.count > maxRequests) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        message: 'Rate limit exceeded. Please try again later.',
      })
    }
  }
}

/**
 * Cleanup old entries from rate limit store
 */
export function cleanupRateLimitStore() {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key)
    }
  }
}

// Clean up every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000)
}

/**
 * Predefined rate limit configurations
 */
export const rateLimitPresets = {
  strict: { maxRequests: 10, windowMs: 60000 }, // 10 requests per minute
  moderate: { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute
  lenient: { maxRequests: 100, windowMs: 60000 }, // 100 requests per minute
  auth: { maxRequests: 5, windowMs: 60000 }, // 5 requests per minute for auth endpoints
}
