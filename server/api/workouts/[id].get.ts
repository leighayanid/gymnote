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

    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Workout ID is required',
      })
    }

    // Fetch workout and verify ownership
    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId: user.id, // Ensure user owns this workout
      },
      include: {
        exercises: true,
      },
    })

    if (!workout) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Workout not found',
      })
    }

    return workout
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to fetch workout')

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to fetch workout',
    })
  }
})
