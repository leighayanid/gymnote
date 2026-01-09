import type { QuickEntryParsed } from '~/types'

export const useQuickEntry = () => {
  /**
   * Parse quick entry text into exercise data
   * Supports patterns:
   * - "Squat 3x10 @135" → { name: "Squat", sets: 3, reps: 10, weight: 135 }
   * - "Bench 5x5 225" → { name: "Bench", sets: 5, reps: 5, weight: 225 }
   * - "Plank 3x30s" → { name: "Plank", sets: 3, reps: 30, weight: null }
   * - "Squat 3x10" → { name: "Squat", sets: 3, reps: 10, weight: null }
   * - "Deadlift" → { name: "Deadlift", sets: null, reps: null, weight: null }
   */
  const parseQuickEntry = (input: string): QuickEntryParsed | null => {
    if (!input || !input.trim()) return null

    const trimmed = input.trim()

    // Pattern 1: "ExerciseName SETSxREPS @WEIGHT" or "ExerciseName SETSxREPS WEIGHT"
    // Examples: "Squat 3x10 @135", "Bench 5x5 225"
    const pattern1 = /^(.+?)\s+(\d+)x(\d+)\s+@?(\d+\.?\d*)$/i
    let match = trimmed.match(pattern1)

    if (match) {
      return {
        name: match[1].trim(),
        sets: parseInt(match[2]),
        reps: parseInt(match[3]),
        weight: parseFloat(match[4])
      }
    }

    // Pattern 2: "ExerciseName SETSxREPS" (no weight)
    // Examples: "Squat 3x10", "Plank 3x30s"
    const pattern2 = /^(.+?)\s+(\d+)x(\d+)s?$/i
    match = trimmed.match(pattern2)

    if (match) {
      return {
        name: match[1].trim(),
        sets: parseInt(match[2]),
        reps: parseInt(match[3]),
        weight: null
      }
    }

    // Pattern 3: "ExerciseName SETS REPS WEIGHT"
    // Examples: "Squat 3 10 135"
    const pattern3 = /^(.+?)\s+(\d+)\s+(\d+)\s+(\d+\.?\d*)$/i
    match = trimmed.match(pattern3)

    if (match) {
      return {
        name: match[1].trim(),
        sets: parseInt(match[2]),
        reps: parseInt(match[3]),
        weight: parseFloat(match[4])
      }
    }

    // Pattern 4: "ExerciseName SETS REPS"
    // Examples: "Squat 3 10"
    const pattern4 = /^(.+?)\s+(\d+)\s+(\d+)$/i
    match = trimmed.match(pattern4)

    if (match) {
      return {
        name: match[1].trim(),
        sets: parseInt(match[2]),
        reps: parseInt(match[3]),
        weight: null
      }
    }

    // Pattern 5: Just exercise name
    // Examples: "Squat", "Bench Press"
    return {
      name: trimmed,
      sets: null,
      reps: null,
      weight: null
    }
  }

  /**
   * Validate parsed entry - returns error message or null if valid
   */
  const validateParsedEntry = (parsed: QuickEntryParsed | null): string | null => {
    if (!parsed) return 'Invalid input'

    if (!parsed.name || parsed.name.trim().length === 0) {
      return 'Exercise name is required'
    }

    if (parsed.sets !== null && parsed.sets <= 0) {
      return 'Sets must be greater than 0'
    }

    if (parsed.reps !== null && parsed.reps <= 0) {
      return 'Reps must be greater than 0'
    }

    if (parsed.weight !== null && parsed.weight < 0) {
      return 'Weight cannot be negative'
    }

    return null
  }

  /**
   * Format parsed entry back to display string
   */
  const formatParsedEntry = (parsed: QuickEntryParsed): string => {
    if (!parsed.sets || !parsed.reps) {
      return parsed.name
    }

    const base = `${parsed.name} ${parsed.sets}x${parsed.reps}`

    if (parsed.weight) {
      return `${base} @ ${parsed.weight} lbs`
    }

    return base
  }

  /**
   * Get suggestions for quick entry based on common patterns
   */
  const getQuickEntrySuggestions = (): string[] => {
    return [
      'Squat 3x10 @225',
      'Bench Press 5x5 @185',
      'Deadlift 3x5 @315',
      'Pull-ups 3x10',
      'Plank 3x30',
    ]
  }

  return {
    parseQuickEntry,
    validateParsedEntry,
    formatParsedEntry,
    getQuickEntrySuggestions
  }
}
