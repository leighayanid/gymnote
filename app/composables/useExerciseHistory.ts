import { localDB } from '~/utils/db'
import type { ExerciseHistoryEntry, LocalWorkout, LocalExercise } from '~/types'

export const useExerciseHistory = () => {
  /**
   * Get exercise history for a specific exercise name
   * Returns all past sessions with this exercise, sorted by date descending
   */
  const getExerciseHistory = async (exerciseName: string): Promise<ExerciseHistoryEntry[]> => {
    try {
      // Get all workouts
      const workouts = await localDB.getWorkouts()

      // Sort workouts by date descending (most recent first)
      workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      const history: ExerciseHistoryEntry[] = []

      // Iterate through each workout and find matching exercises
      for (const workout of workouts) {
        const exercises = await localDB.getExercisesByWorkout(workout.localId)

        const matchingExercises = exercises.filter(
          ex => ex.name.toLowerCase() === exerciseName.toLowerCase()
        )

        for (const exercise of matchingExercises) {
          history.push({
            workoutDate: new Date(workout.date),
            sets: exercise.sets,
            reps: exercise.reps,
            weight: exercise.weight,
            notes: exercise.notes
          })
        }
      }

      return history
    } catch (error) {
      console.error('Error fetching exercise history:', error)
      return []
    }
  }

  /**
   * Get the most recent exercise data for a specific exercise
   * Useful for showing "last time" information
   */
  const getPreviousExerciseData = async (exerciseName: string): Promise<ExerciseHistoryEntry | null> => {
    try {
      const history = await getExerciseHistory(exerciseName)
      return history.length > 0 ? history[0] : null
    } catch (error) {
      console.error('Error fetching previous exercise data:', error)
      return null
    }
  }

  /**
   * Get personal record for an exercise (highest weight lifted)
   */
  const getExercisePersonalRecord = async (exerciseName: string): Promise<ExerciseHistoryEntry | null> => {
    try {
      const history = await getExerciseHistory(exerciseName)

      if (history.length === 0) return null

      // Find entry with highest weight
      const pr = history.reduce((max, entry) => {
        const maxWeight = max.weight ?? 0
        const entryWeight = entry.weight ?? 0
        return entryWeight > maxWeight ? entry : max
      })

      return pr
    } catch (error) {
      console.error('Error fetching personal record:', error)
      return null
    }
  }

  /**
   * Calculate total volume for a workout (sets × reps × weight)
   */
  const calculateVolumeForWorkout = async (workoutLocalId: string): Promise<number> => {
    try {
      const exercises = await localDB.getExercisesByWorkout(workoutLocalId)

      let totalVolume = 0
      for (const exercise of exercises) {
        const weight = exercise.weight ?? 0
        totalVolume += exercise.sets * exercise.reps * weight
      }

      return totalVolume
    } catch (error) {
      console.error('Error calculating workout volume:', error)
      return 0
    }
  }

  /**
   * Get all exercises with a specific name across all workouts
   * Returns exercises with their parent workout info
   */
  const getExerciseOccurrences = async (exerciseName: string): Promise<Array<LocalExercise & { workout: LocalWorkout }>> => {
    try {
      const workouts = await localDB.getWorkouts()
      const occurrences: Array<LocalExercise & { workout: LocalWorkout }> = []

      for (const workout of workouts) {
        const exercises = await localDB.getExercisesByWorkout(workout.localId)

        const matchingExercises = exercises.filter(
          ex => ex.name.toLowerCase() === exerciseName.toLowerCase()
        )

        for (const exercise of matchingExercises) {
          occurrences.push({
            ...exercise,
            workout
          })
        }
      }

      // Sort by workout date descending
      occurrences.sort((a, b) =>
        new Date(b.workout.date).getTime() - new Date(a.workout.date).getTime()
      )

      return occurrences
    } catch (error) {
      console.error('Error fetching exercise occurrences:', error)
      return []
    }
  }

  return {
    getExerciseHistory,
    getPreviousExerciseData,
    getExercisePersonalRecord,
    calculateVolumeForWorkout,
    getExerciseOccurrences
  }
}
