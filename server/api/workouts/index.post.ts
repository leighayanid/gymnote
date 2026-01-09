import { requireAuth } from '~~/server/utils/auth'
import { createWorkoutSchema } from '~~/server/utils/validation'
import prisma from '~~/server/utils/prisma'
import { logger } from '~~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(rateLimitPresets.moderate)(event)

  try {
    // Require authentication
    const user = await requireAuth(event)

    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = createWorkoutSchema.parse(body)

    // Create workout for the authenticated user
    const workout = await prisma.workout.create({
      data: {
        userId: user.id,
        date: new Date(validatedData.date),
        notes: validatedData.notes,
        status: validatedData.status,
        exercises: {
          create: validatedData.exercises.map((exercise) => ({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            notes: exercise.notes,
          })),
        },
      },
      include: {
        exercises: true,
      },
    })

    logger.info({ userId: user.id, workoutId: workout.id }, 'Workout created successfully')

    return workout
  } catch (error: any) {
    logger.error({ error: error.message }, 'Failed to create workout')

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
      message: 'Failed to create workout',
    })
  }
})
