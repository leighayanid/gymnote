import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Workout ID is required'
      })
    }

    const workout = await prisma.workout.findUnique({
      where: { id },
      include: {
        exercises: true
      }
    })

    if (!workout) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Workout not found'
      })
    }

    return workout
  } catch (error) {
    console.error('Failed to fetch workout:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch workout'
    })
  }
})
