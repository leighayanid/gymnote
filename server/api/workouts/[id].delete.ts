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

    // Delete exercises first (cascade should handle this, but being explicit)
    await prisma.exercise.deleteMany({
      where: { workoutId: id }
    })

    // Delete workout
    await prisma.workout.delete({
      where: { id }
    })

    return { success: true }
  } catch (error) {
    console.error('Failed to delete workout:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete workout'
    })
  }
})
