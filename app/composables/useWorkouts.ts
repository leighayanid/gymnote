import { localDB } from '~/utils/db'
import type { LocalWorkout, LocalExercise } from '~/types'

export const useWorkouts = () => {
  const workouts = useState<LocalWorkout[]>('workouts', () => [])
  const loading = useState('workouts-loading', () => false)
  const toast = useToast()

  const generateLocalId = () => `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const loadWorkouts = async (statusFilter?: 'in_progress' | 'completed') => {
    loading.value = true
    try {
      await localDB.init()
      let allWorkouts = await localDB.getWorkouts()

      // Filter by status if provided
      if (statusFilter) {
        allWorkouts = allWorkouts.filter(w => w.status === statusFilter)
      }

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
      toast.error('Failed to load workouts', 'Please refresh the page to try again')
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
    status?: 'in_progress' | 'completed'
    exercises: Array<{
      name: string
      sets: number
      reps: number
      weight?: number
      notes?: string
    }>
  }): Promise<LocalWorkout> => {
    try {
      await localDB.init()

      const localId = generateLocalId()
      const now = new Date()

      const workout: LocalWorkout = {
        localId,
        serverId: null,
        syncStatus: 'pending',
        status: data.status || 'in_progress',
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

      toast.success('Workout created', 'Your workout has been saved successfully')

      return workout
    } catch (error) {
      console.error('Failed to create workout:', error)
      toast.error('Failed to create workout', 'Please try again')
      throw error
    }
  }

  const updateWorkout = async (
    localId: string,
    data: {
      date?: Date
      notes?: string
      status?: 'in_progress' | 'completed'
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
    try {
      await localDB.init()

      const workout = await localDB.getWorkout(localId)
      if (!workout) {
        toast.error('Workout not found', 'Unable to update the workout')
        throw new Error('Workout not found')
      }

      // Update workout
      const updatedWorkout: LocalWorkout = {
        ...workout,
        date: data.date || workout.date,
        notes: data.notes !== undefined ? data.notes : workout.notes,
        status: data.status || workout.status,
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

      toast.success('Workout updated', 'Your changes have been saved')
    } catch (error) {
      console.error('Failed to update workout:', error)
      toast.error('Failed to update workout', 'Please try again')
      throw error
    }
  }

  const deleteWorkout = async (localId: string): Promise<void> => {
    try {
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

      toast.success('Workout deleted', 'The workout has been removed')
    } catch (error) {
      console.error('Failed to delete workout:', error)
      toast.error('Failed to delete workout', 'Please try again')
      throw error
    }
  }

  const getLastCompletedWorkout = async (): Promise<LocalWorkout | null> => {
    try {
      await localDB.init()
      const allWorkouts = await localDB.getWorkouts()

      // Filter completed workouts and sort by date descending
      const completedWorkouts = allWorkouts
        .filter(w => w.status === 'completed')
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      if (completedWorkouts.length === 0) return null

      const workout = completedWorkouts[0]
      const exercises = await localDB.getExercisesByWorkout(workout.localId)
      return { ...workout, exercises }
    } catch (error) {
      console.error('Failed to get last completed workout:', error)
      return null
    }
  }

  const getPreviousWorkout = async (exerciseName: string): Promise<LocalWorkout | null> => {
    try {
      await localDB.init()
      const allWorkouts = await localDB.getWorkouts()

      // Sort by date descending
      const sortedWorkouts = allWorkouts.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      )

      // Find workout containing this exercise
      for (const workout of sortedWorkouts) {
        const exercises = await localDB.getExercisesByWorkout(workout.localId)
        const hasExercise = exercises.some(
          ex => ex.name.toLowerCase() === exerciseName.toLowerCase()
        )

        if (hasExercise) {
          return { ...workout, exercises }
        }
      }

      return null
    } catch (error) {
      console.error('Failed to get previous workout:', error)
      return null
    }
  }

  const markWorkoutCompleted = async (localId: string): Promise<void> => {
    await updateWorkout(localId, { status: 'completed' })
    toast.success('Workout completed', 'Great job! 💪')
  }

  const markWorkoutInProgress = async (localId: string): Promise<void> => {
    await updateWorkout(localId, { status: 'in_progress' })
    toast.info('Workout reopened', 'You can continue editing')
  }

  return {
    workouts,
    loading,
    loadWorkouts,
    getWorkout,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    getLastCompletedWorkout,
    getPreviousWorkout,
    markWorkoutCompleted,
    markWorkoutInProgress
  }
}
