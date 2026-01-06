import { requireAuth } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { logger } from '~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(rateLimitPresets.strict)(event)

  try {
    // Require authentication
    const user = await requireAuth(event)

    const query = getQuery(event)
    const format = query.format || 'json'

    // Fetch all user data
    const workouts = await prisma.workout.findMany({
      where: { userId: user.id },
      include: {
        exercises: true,
      },
      orderBy: {
        date: 'desc',
      },
    })

    const exportData = {
      exportDate: new Date().toISOString(),
      user: {
        email: user.email,
        name: user.name,
      },
      workouts,
      totalWorkouts: workouts.length,
      totalExercises: workouts.reduce((sum, w) => sum + w.exercises.length, 0),
    }

    logger.info({ userId: user.id, format }, 'Data exported successfully')

    if (format === 'csv') {
      // Generate CSV format
      const csvHeader = 'Date,Exercise,Sets,Reps,Weight,Notes\n'
      const csvRows = workouts
        .flatMap((workout) =>
          workout.exercises.map((exercise) =>
            [
              new Date(workout.date).toISOString().split('T')[0],
              exercise.name,
              exercise.sets,
              exercise.reps,
              exercise.weight || '',
              `"${(exercise.notes || '').replace(/"/g, '""')}"`,
            ].join(',')
          )
        )
        .join('\n')

      const csv = csvHeader + csvRows

      setHeader(event, 'Content-Type', 'text/csv')
      setHeader(event, 'Content-Disposition', `attachment; filename="gymnote-export-${Date.now()}.csv"`)

      return csv
    }

    // Default: JSON format
    setHeader(event, 'Content-Type', 'application/json')
    setHeader(event, 'Content-Disposition', `attachment; filename="gymnote-export-${Date.now()}.json"`)

    return exportData
  } catch (error: any) {
    logger.error({ error: error.message }, 'Data export failed')

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'Failed to export data',
    })
  }
})
