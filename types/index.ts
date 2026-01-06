export type SyncStatus = 'pending' | 'synced' | 'failed'

export interface LocalWorkout {
  localId: string
  serverId: string | null
  syncStatus: SyncStatus
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
  exercises: {
    name: string
    sets: number
    reps: number
    weight?: number
  }[]
}
