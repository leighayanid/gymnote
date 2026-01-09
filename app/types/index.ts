export type SyncStatus = 'pending' | 'synced' | 'failed'
export type WorkoutStatus = 'in_progress' | 'completed'

export interface LocalWorkout {
  localId: string
  serverId: string | null
  syncStatus: SyncStatus
  status: WorkoutStatus
  date: Date
  notes: string | null
  exercises: LocalExercise[]
  createdAt: Date
  updatedAt: Date
}

export interface LocalExercise {
  localId: string
  serverId: string | null
  workoutLocalId: string
  name: string
  sets: number
  reps: number
  weight: number | null
  notes: string | null
}

export interface SyncQueueItem {
  id: string
  action: 'create' | 'update' | 'delete'
  entityType: 'workout' | 'exercise'
  entityId: string
  data: any
  timestamp: Date
  retryCount: number
}

export interface WorkoutTemplate {
  id: string
  name: string
  lastUsed: Date | null
  usageCount: number
  exercises: {
    name: string
    sets: number
    reps: number
    weight?: number
  }[]
}

// Exercise API types
export interface ExerciseSearchResult {
  id?: string
  name: string
  bodyPart: string
  target: string
  equipment: string
  gifUrl?: string
}

export interface CachedExercise {
  name: string
  bodyPart: string
  target: string
  equipment: string
  cachedAt: Date
  searchCount: number // Track popularity for better caching
}

export interface ExerciseAPIResponse {
  id: string
  name: string
  bodyPart: string
  target: string
  equipment: string
  gifUrl: string
}

// Exercise history types
export interface ExerciseHistoryEntry {
  workoutDate: Date
  sets: number
  reps: number
  weight: number | null
  notes: string | null
}

// Rest timer types
export interface RestTimerSettings {
  enabled: boolean
  defaultDuration: number // seconds (default: 120)
  soundEnabled: boolean
  vibrationEnabled: boolean
}

// Quick entry parser types
export interface QuickEntryParsed {
  name: string
  sets: number | null
  reps: number | null
  weight: number | null
}
