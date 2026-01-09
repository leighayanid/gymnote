import { requireAuth } from '~~/server/utils/auth'
import { updateWorkoutSchema } from '~~/server/utils/validation'
import prisma from '~~/server/utils/prisma'
import { logger } from '~~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~~/server/utils/rateLimit'

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

    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = updateWorkoutSchema.parse(body)

    // Delete existing exercises if new ones are provided
    if (validatedData.exercises) {
      await prisma.exercise.deleteMany({
        where: { workoutId: id },
      })
    }

    // Update workout
    const workout = await prisma.workout.update({
      where: { id },
      data: {
        ...(validatedData.date && { date: new Date(validatedData.date) }),
        ...(validatedData.notes !== undefined && { notes: validatedData.notes }),
        ...(validatedData.status && { status: validatedData.status }),
        ...(validatedData.exercises && {
          exercises: {
            create: validatedData.exercises.map((exercise) => ({
              name: exercise.name,
              sets: exercise.sets,
              reps: exercise.reps,
              weight: exercise.weight,
              notes: exercise.notes,
            })),
          },
        }),
      },
      include: {
        exercises: true,
      },
    })

    logger.info({ userId: user.id, workoutId: workout.id }, 'Workout updated successfully')

    return workout
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to update workout')

    if (error.statusCode) {
      throw error
    }

    // Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Validation failed',
        data: error.errors,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to update workout',
    })
  }
})
