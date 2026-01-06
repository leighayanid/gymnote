import prisma from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const workout = await prisma.workout.create({
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
    console.error('Failed to create workout:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create workout'
    })
  }
})
