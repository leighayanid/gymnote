import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { logger } from '~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(rateLimitPresets.moderate)(event)

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

    // Verify workout exists and user owns it
    const existingWorkout = await prisma.workout.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!existingWorkout) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Workout not found',
      })
    }

    // Delete workout (cascade will delete exercises)
    await prisma.workout.delete({
      where: { id },
    })

    logger.info({ userId: user.id, workoutId: id }, 'Workout deleted successfully')

    return { success: true, message: 'Workout deleted successfully' }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to delete workout')

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to delete workout',
    })
  }
})
