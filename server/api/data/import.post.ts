import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { logger } from '~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~/server/utils/rateLimit'
import { z } from 'zod'

const importDataSchema = z.object({
  workouts: z.array(
    z.object({
      date: z.string().or(z.date()),
      notes: z.string().optional().nullable(),
      exercises: z.array(
        z.object({
          name: z.string(),
          sets: z.number().int(),
          reps: z.number().int(),
          weight: z.number().optional().nullable(),
          notes: z.string().optional().nullable(),
        })
      ),
    })
  ),
})

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(rateLimitPresets.strict)(event)

  try {
    // Require authentication
    const user = await requireAuth(event)

    const body = await readBody(event)
    const validatedData = importDataSchema.parse(body)

    // Import workouts in a transaction
    const results = await prisma.$transaction(
      validatedData.workouts.map((workout) =>
        prisma.workout.create({
          data: {
            userId: user.id,
            date: new Date(workout.date),
            notes: workout.notes,
            exercises: {
              create: workout.exercises.map((exercise) => ({
                name: exercise.name,
                sets: exercise.sets,
                reps: exercise.reps,
                weight: exercise.weight,
                notes: exercise.notes,
              })),
            },
          },
        })
      )
    )

    logger.info(
      { userId: user.id, imported: results.length },
      'Data imported successfully'
    )

    return {
      success: true,
      message: `Successfully imported ${results.length} workouts`,
      imported: results.length,
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Data import failed')

    if (error.statusCode) {
      throw error
    }

    // Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Invalid import data format',
        data: error.errors,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to import data',
    })
  }
})
