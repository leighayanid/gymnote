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

    const body = await readBody(event)

    // Delete existing exercises
    await prisma.exercise.deleteMany({
      where: { workoutId: id }
    })

    // Update workout with new exercises
    const workout = await prisma.workout.update({
      where: { id },
      data: {
        date: new Date(body.date),
        notes: body.notes,
        exercises: {
          create: body.exercises.map((exercise: any) => ({
            name: exercise.name,
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            notes: exercise.notes
          }))
        }
      },
      include: {
        exercises: true
      }
    })

    return workout
  } catch (error) {
    console.error('Failed to update workout:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update workout'
    })
  }
})
