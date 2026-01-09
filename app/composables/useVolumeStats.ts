import { localDB } from '~/utils/db'
import type { LocalWorkout } from '~/types'

export interface WeeklyVolumeData {
  week: string
  volume: number
  change: number
  workoutCount: number
}

export const useVolumeStats = () => {
  /**
   * Calculate total volume for a workout (sets × reps × weight)
   */
  const calculateWorkoutVolume = async (workoutLocalId: string): Promise<number> => {
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
   * Get weekly volume data for the last N weeks
   */
  const getWeeklyVolumeData = async (weeksCount: number = 4): Promise<WeeklyVolumeData[]> => {
    try {
      const workouts = await localDB.getWorkouts()

      // Sort workouts by date
      workouts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

      // Group workouts by week
      const weeklyData = new Map<string, { volume: number; workoutCount: number }>()

      for (const workout of workouts) {
        const workoutDate = new Date(workout.date)

        // Get the start of the week (Sunday)
        const startOfWeek = new Date(workoutDate)
        startOfWeek.setDate(workoutDate.getDate() - workoutDate.getDay())
        startOfWeek.setHours(0, 0, 0, 0)

        const weekKey = startOfWeek.toISOString().split('T')[0]

        // Calculate volume for this workout
        const volume = await calculateWorkoutVolume(workout.localId)

        if (!weeklyData.has(weekKey)) {
          weeklyData.set(weekKey, { volume: 0, workoutCount: 0 })
        }

        const weekData = weeklyData.get(weekKey)!
        weekData.volume += volume
        weekData.workoutCount += 1
      }

      // Convert to array and sort by date
      const sortedWeeks = Array.from(weeklyData.entries())
        .map(([week, data]) => ({
          week,
          ...data
        }))
        .sort((a, b) => a.week.localeCompare(b.week))

      // Get last N weeks
      const recentWeeks = sortedWeeks.slice(-weeksCount)

      // Calculate percentage change
      const result: WeeklyVolumeData[] = recentWeeks.map((weekData, index) => {
        let change = 0

        if (index > 0) {
          const previousVolume = recentWeeks[index - 1].volume
          if (previousVolume > 0) {
            change = ((weekData.volume - previousVolume) / previousVolume) * 100
          }
        }

        return {
          week: formatWeekLabel(weekData.week),
          volume: Math.round(weekData.volume),
          change: Math.round(change),
          workoutCount: weekData.workoutCount
        }
      })

      return result
    } catch (error) {
      console.error('Error getting weekly volume data:', error)
      return []
    }
  }

  /**
   * Format week key to readable label
   */
  const formatWeekLabel = (weekKey: string): string => {
    const date = new Date(weekKey)
    const now = new Date()

    // Check if it's this week
    const startOfThisWeek = new Date(now)
    startOfThisWeek.setDate(now.getDate() - now.getDay())
    startOfThisWeek.setHours(0, 0, 0, 0)

    if (date.getTime() === startOfThisWeek.getTime()) {
      return 'This Week'
    }

    // Check if it's last week
    const startOfLastWeek = new Date(startOfThisWeek)
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)

    if (date.getTime() === startOfLastWeek.getTime()) {
      return 'Last Week'
    }

    // Format as "Week of MMM DD"
    return `Week of ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`
  }

  /**
   * Get current week stats
   */
  const getCurrentWeekStats = async () => {
    try {
      const workouts = await localDB.getWorkouts()

      // Get start of this week (Sunday)
      const now = new Date()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      // Filter workouts from this week
      const thisWeekWorkouts = workouts.filter(workout => {
        const workoutDate = new Date(workout.date)
        return workoutDate >= startOfWeek
      })

      // Calculate total volume
      let totalVolume = 0
      let totalExercises = 0

      for (const workout of thisWeekWorkouts) {
        totalVolume += await calculateWorkoutVolume(workout.localId)
        const exercises = await localDB.getExercisesByWorkout(workout.localId)
        totalExercises += exercises.length
      }

      return {
        workoutCount: thisWeekWorkouts.length,
        totalVolume: Math.round(totalVolume),
        totalExercises
      }
    } catch (error) {
      console.error('Error getting current week stats:', error)
      return {
        workoutCount: 0,
        totalVolume: 0,
        totalExercises: 0
      }
    }
  }

  return {
    calculateWorkoutVolume,
    getWeeklyVolumeData,
    getCurrentWeekStats,
    formatWeekLabel
  }
}
