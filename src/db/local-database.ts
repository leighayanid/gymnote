import Dexie, { type EntityTable } from 'dexie';

// Sync status types
export type SyncStatus = 'pending' | 'synced' | 'conflict';

// Muscle group types
export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'quadriceps'
  | 'hamstrings'
  | 'glutes'
  | 'calves'
  | 'full_body';

// Local database entity interfaces
export interface LocalExercise {
  id: string;
  userId?: string;
  name: string;
  muscleGroup: MuscleGroup;
  isCustom: boolean;
  isBuiltIn: boolean;
  createdAt: Date;
  updatedAt: Date;
  // Sync metadata
  version: number;
  syncStatus: SyncStatus;
  localUpdatedAt: Date;
  serverUpdatedAt: Date;
}

export interface LocalWorkout {
  id: string;
  userId: string;
  name?: string;
  startedAt: Date;
  completedAt?: Date;
  notes?: string;
  durationSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
  // Sync metadata
  version: number;
  syncStatus: SyncStatus;
  localUpdatedAt: Date;
  serverUpdatedAt: Date;
}

export interface LocalWorkoutExercise {
  id: string;
  workoutId: string;
  exerciseId: string;
  orderIndex: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  // Sync metadata
  version: number;
  syncStatus: SyncStatus;
  localUpdatedAt: Date;
  serverUpdatedAt: Date;
}

export interface LocalSet {
  id: string;
  workoutExerciseId: string;
  setNumber: number;
  reps?: number;
  weight?: number;
  duration?: number;
  rpe?: number;
  isWarmup: boolean;
  isDropset: boolean;
  isFailure: boolean;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  // Sync metadata
  version: number;
  syncStatus: SyncStatus;
  localUpdatedAt: Date;
  serverUpdatedAt: Date;
}

// Sync queue for tracking pending operations
export interface SyncOperation {
  id?: number;
  entityType: 'exercise' | 'workout' | 'workoutExercise' | 'set';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  data: Record<string, unknown>;
  createdAt: Date;
  attempts: number;
  lastAttemptAt?: Date;
  error?: string;
}

// Dexie database class
class LocalDatabase extends Dexie {
  exercises!: EntityTable<LocalExercise, 'id'>;
  workouts!: EntityTable<LocalWorkout, 'id'>;
  workoutExercises!: EntityTable<LocalWorkoutExercise, 'id'>;
  sets!: EntityTable<LocalSet, 'id'>;
  syncQueue!: EntityTable<SyncOperation, 'id'>;

  constructor() {
    super('RyneDB');

    this.version(1).stores({
      exercises: 'id, userId, muscleGroup, isBuiltIn, syncStatus, localUpdatedAt',
      workouts: 'id, userId, startedAt, completedAt, syncStatus, localUpdatedAt',
      workoutExercises: 'id, workoutId, exerciseId, orderIndex, syncStatus, localUpdatedAt',
      sets: 'id, workoutExerciseId, setNumber, syncStatus, localUpdatedAt',
      syncQueue: '++id, entityType, entityId, operation, createdAt',
    });
  }
}

// Create singleton instance
export const localDb = new LocalDatabase();

// Helper to generate UUID
export function generateId(): string {
  return crypto.randomUUID();
}

// Helper to create sync metadata
export function createSyncMeta(status: SyncStatus = 'pending') {
  const now = new Date();
  return {
    version: 1,
    syncStatus: status,
    localUpdatedAt: now,
    serverUpdatedAt: now,
  };
}

// Helper to update sync metadata
export function updateSyncMeta(
  existing: { version: number; serverUpdatedAt: Date },
  markPending = true
) {
  return {
    version: existing.version + 1,
    syncStatus: markPending ? ('pending' as SyncStatus) : ('synced' as SyncStatus),
    localUpdatedAt: new Date(),
    serverUpdatedAt: existing.serverUpdatedAt,
  };
}

// Initialize with built-in exercises
export async function initializeBuiltInExercises() {
  const count = await localDb.exercises.where('isBuiltIn').equals(1).count();
  if (count > 0) return; // Already initialized

  const builtInExercises: Omit<LocalExercise, 'createdAt' | 'updatedAt'>[] = [
    // Chest
    { id: generateId(), name: 'Barbell Bench Press', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Dumbbell Bench Press', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Incline Barbell Press', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Incline Dumbbell Press', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Decline Bench Press', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Dumbbell Flyes', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Cable Crossover', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Push-Ups', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Chest Dips', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Pec Deck Machine', muscleGroup: 'chest', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Back
    { id: generateId(), name: 'Deadlift', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Barbell Row', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Dumbbell Row', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Pull-Ups', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Chin-Ups', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Lat Pulldown', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Seated Cable Row', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'T-Bar Row', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Face Pulls', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Rack Pulls', muscleGroup: 'back', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Shoulders
    { id: generateId(), name: 'Overhead Press', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Dumbbell Shoulder Press', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Arnold Press', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Lateral Raises', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Front Raises', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Rear Delt Flyes', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Upright Rows', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Shrugs', muscleGroup: 'shoulders', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Biceps
    { id: generateId(), name: 'Barbell Curl', muscleGroup: 'biceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Dumbbell Curl', muscleGroup: 'biceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Hammer Curl', muscleGroup: 'biceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Preacher Curl', muscleGroup: 'biceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Incline Dumbbell Curl', muscleGroup: 'biceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Cable Curl', muscleGroup: 'biceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Concentration Curl', muscleGroup: 'biceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Triceps
    { id: generateId(), name: 'Close-Grip Bench Press', muscleGroup: 'triceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Tricep Dips', muscleGroup: 'triceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Skull Crushers', muscleGroup: 'triceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Tricep Pushdown', muscleGroup: 'triceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Overhead Tricep Extension', muscleGroup: 'triceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Diamond Push-Ups', muscleGroup: 'triceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Rope Pushdown', muscleGroup: 'triceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Core
    { id: generateId(), name: 'Plank', muscleGroup: 'core', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Hanging Leg Raise', muscleGroup: 'core', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Cable Crunch', muscleGroup: 'core', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Ab Wheel Rollout', muscleGroup: 'core', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Russian Twist', muscleGroup: 'core', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Dead Bug', muscleGroup: 'core', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Mountain Climbers', muscleGroup: 'core', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Quadriceps
    { id: generateId(), name: 'Back Squat', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Front Squat', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Leg Press', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Leg Extension', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Walking Lunges', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Bulgarian Split Squat', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Hack Squat', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Goblet Squat', muscleGroup: 'quadriceps', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Hamstrings
    { id: generateId(), name: 'Romanian Deadlift', muscleGroup: 'hamstrings', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Lying Leg Curl', muscleGroup: 'hamstrings', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Seated Leg Curl', muscleGroup: 'hamstrings', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Good Mornings', muscleGroup: 'hamstrings', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Nordic Hamstring Curl', muscleGroup: 'hamstrings', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Stiff-Leg Deadlift', muscleGroup: 'hamstrings', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Glutes
    { id: generateId(), name: 'Hip Thrust', muscleGroup: 'glutes', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Glute Bridge', muscleGroup: 'glutes', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Cable Kickback', muscleGroup: 'glutes', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Sumo Deadlift', muscleGroup: 'glutes', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Step-Ups', muscleGroup: 'glutes', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Calves
    { id: generateId(), name: 'Standing Calf Raise', muscleGroup: 'calves', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Seated Calf Raise', muscleGroup: 'calves', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Donkey Calf Raise', muscleGroup: 'calves', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },

    // Full Body
    { id: generateId(), name: 'Clean and Press', muscleGroup: 'full_body', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Thrusters', muscleGroup: 'full_body', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Burpees', muscleGroup: 'full_body', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
    { id: generateId(), name: 'Kettlebell Swing', muscleGroup: 'full_body', isBuiltIn: true, isCustom: false, ...createSyncMeta('synced') },
  ];

  const now = new Date();
  await localDb.exercises.bulkAdd(
    builtInExercises.map(e => ({
      ...e,
      createdAt: now,
      updatedAt: now,
    }))
  );
}

// Export types
export type { EntityTable };
