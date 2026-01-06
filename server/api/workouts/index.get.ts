import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { logger } from '~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(rateLimitPresets.lenient)(event)

  try {
    // Require authentication
    const user = await requireAuth(event)

    // Get pagination params
    const query = getQuery(event)
    const page = Number(query.page) || 1
    const limit = Math.min(Number(query.limit) || 20, 100)
    const skip = (page - 1) * limit

    // Fetch workouts for the authenticated user
    const [workouts, total] = await Promise.all([
      prisma.workout.findMany({
        where: { userId: user.id },
        include: {
          exercises: true,
        },
        orderBy: {
          date: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.workout.count({
        where: { userId: user.id },
      }),
    ])

    return {
      workouts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch workouts')

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch workouts',
    })
  }
})
