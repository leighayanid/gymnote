import { localDB } from '~/utils/db'
import type { LocalWorkout, LocalExercise } from '~/types'

export const useWorkouts = () => {
  const workouts = useState<LocalWorkout[]>('workouts', () => [])
  const loading = useState('workouts-loading', () => false)

  const generateLocalId = () => `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const loadWorkouts = async () => {
    loading.value = true
    try {
      await localDB.init()
      const allWorkouts = await localDB.getWorkouts()

      // Load exercises for each workout
      const workoutsWithExercises = await Promise.all(
        allWorkouts.map(async (workout) => {
          const exercises = await localDB.getExercisesByWorkout(workout.localId)
          return { ...workout, exercises }
        })
      )

      // Sort by date descending
      workouts.value = workoutsWithExercises.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    } catch (error) {
      console.error('Failed to load workouts:', error)
    } finally {
      loading.value = false
    }
  }

  const getWorkout = async (localId: string): Promise<LocalWorkout | undefined> => {
    await localDB.init()
    const workout = await localDB.getWorkout(localId)
    if (workout) {
      const exercises = await localDB.getExercisesByWorkout(workout.localId)
      return { ...workout, exercises }
    }
    return undefined
  }

  const createWorkout = async (data: {
    date: Date
    notes?: string
    exercises: Array<{
      name: string
      sets: number
      reps: number
      weight?: number
      notes?: string
    }>
  }): Promise<LocalWorkout> => {
    await localDB.init()

    const localId = generateLocalId()
    const now = new Date()

    const workout: LocalWorkout = {
      localId,
      serverId: null,
      syncStatus: 'pending',
      date: data.date,
      notes: data.notes || null,
      exercises: [],
      createdAt: now,
      updatedAt: now
    }

    // Save workout
    await localDB.saveWorkout(workout)

    // Save exercises
    const exercises: LocalExercise[] = []
    for (const exerciseData of data.exercises) {
      const exercise: LocalExercise = {
        localId: generateLocalId(),
        serverId: null,
        workoutLocalId: localId,
        name: exerciseData.name,
        sets: exerciseData.sets,
        reps: exerciseData.reps,
        weight: exerciseData.weight || null,
        notes: exerciseData.notes || null
      }
      await localDB.saveExercise(exercise)
      exercises.push(exercise)
    }

    workout.exercises = exercises

    // Add to sync queue
    const { addToSyncQueue } = useSync()
    await addToSyncQueue({
      id: generateLocalId(),
      action: 'create',
      entityType: 'workout',
      entityId: localId,
      data: workout,
      timestamp: now,
      retryCount: 0
    })

    // Reload workouts
    await loadWorkouts()

    return workout
  }

  const updateWorkout = async (
    localId: string,
    data: {
      date?: Date
      notes?: string
      exercises?: Array<{
        localId?: string
        name: string
        sets: number
        reps: number
        weight?: number
        notes?: string
      }>
    }
  ): Promise<void> => {
    await localDB.init()

    const workout = await localDB.getWorkout(localId)
    if (!workout) throw new Error('Workout not found')

    // Update workout
    const updatedWorkout: LocalWorkout = {
      ...workout,
      date: data.date || workout.date,
      notes: data.notes !== undefined ? data.notes : workout.notes,
      syncStatus: 'pending',
      updatedAt: new Date()
    }

    await localDB.saveWorkout(updatedWorkout)

    // Update exercises if provided
    if (data.exercises) {
      // Delete old exercises
      await localDB.deleteExercisesByWorkout(localId)

      // Save new exercises
      for (const exerciseData of data.exercises) {
        const exercise: LocalExercise = {
          localId: exerciseData.localId || generateLocalId(),
          serverId: null,
          workoutLocalId: localId,
          name: exerciseData.name,
          sets: exerciseData.sets,
          reps: exerciseData.reps,
          weight: exerciseData.weight || null,
          notes: exerciseData.notes || null
        }
        await localDB.saveExercise(exercise)
      }
    }

    // Add to sync queue
    const { addToSyncQueue } = useSync()
    await addToSyncQueue({
      id: generateLocalId(),
      action: 'update',
      entityType: 'workout',
      entityId: localId,
      data: updatedWorkout,
      timestamp: new Date(),
      retryCount: 0
    })

    await loadWorkouts()
  }

  const deleteWorkout = async (localId: string): Promise<void> => {
    await localDB.init()

    // Delete exercises first
    await localDB.deleteExercisesByWorkout(localId)

    // Delete workout
    await localDB.deleteWorkout(localId)

    // Add to sync queue if it has a serverId
    const workout = workouts.value.find(w => w.localId === localId)
    if (workout?.serverId) {
      const { addToSyncQueue } = useSync()
      await addToSyncQueue({
        id: generateLocalId(),
        action: 'delete',
        entityType: 'workout',
        entityId: localId,
        data: { serverId: workout.serverId },
        timestamp: new Date(),
        retryCount: 0
      })
    }

    await loadWorkouts()
  }

  return {
    workouts,
    loading,
    loadWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout
  }
}
