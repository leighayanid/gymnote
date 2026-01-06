import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const workouts = await prisma.workout.findMany({
      include: {
        exercises: true
      },
      orderBy: {
        date: 'desc'
      }
    })

    return workouts
  } catch (error) {
    console.error('Failed to fetch workouts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch workouts'
    })
  }
})
