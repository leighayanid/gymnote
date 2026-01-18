import { db } from "@/db";
import { exercises, workouts, workoutExercises, sets } from "@/db/schema";
import { eq, gt, and } from "drizzle-orm";

export interface SyncOperation {
  id?: number;
  entityType: "exercise" | "workout" | "workoutExercise" | "set";
  entityId: string;
  operation: "create" | "update" | "delete";
  data: Record<string, unknown>;
  createdAt: Date;
  attempts: number;
}

export interface SyncResult {
  success: boolean;
  syncedIds: number[];
  updates: Array<{
    entityType: string;
    entityId: string;
    serverUpdatedAt: Date;
  }>;
  errors?: Array<{
    id: number;
    error: string;
  }>;
}

// Process sync operations from client
export async function processSyncOperations(
  operations: SyncOperation[],
  userId: string
): Promise<SyncResult> {
  const syncedIds: number[] = [];
  const updates: Array<{
    entityType: string;
    entityId: string;
    serverUpdatedAt: Date;
  }> = [];
  const errors: Array<{ id: number; error: string }> = [];

  for (const op of operations) {
    try {
      const now = new Date();

      switch (op.entityType) {
        case "exercise":
          await processExerciseOp(op, userId, now);
          break;
        case "workout":
          await processWorkoutOp(op, userId, now);
          break;
        case "workoutExercise":
          await processWorkoutExerciseOp(op, now);
          break;
        case "set":
          await processSetOp(op, now);
          break;
      }

      if (op.id) syncedIds.push(op.id);
      updates.push({
        entityType: op.entityType,
        entityId: op.entityId,
        serverUpdatedAt: now,
      });
    } catch (error) {
      if (op.id) {
        errors.push({
          id: op.id,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }
  }

  return {
    success: errors.length === 0,
    syncedIds,
    updates,
    errors: errors.length > 0 ? errors : undefined,
  };
}

async function processExerciseOp(
  op: SyncOperation,
  userId: string,
  now: Date
) {
  const data = op.data as Record<string, unknown>;

  switch (op.operation) {
    case "create":
      await db.insert(exercises).values({
        id: op.entityId,
        userId,
        name: data.name as string,
        muscleGroup: data.muscleGroup as "chest" | "back" | "shoulders" | "biceps" | "triceps" | "forearms" | "core" | "quadriceps" | "hamstrings" | "glutes" | "calves" | "full_body",
        isCustom: true,
        isBuiltIn: false,
        version: 1,
        syncStatus: "synced",
        serverUpdatedAt: now,
      }).onConflictDoUpdate({
        target: exercises.id,
        set: {
          name: data.name as string,
          muscleGroup: data.muscleGroup as "chest" | "back" | "shoulders" | "biceps" | "triceps" | "forearms" | "core" | "quadriceps" | "hamstrings" | "glutes" | "calves" | "full_body",
          syncStatus: "synced",
          serverUpdatedAt: now,
        },
      });
      break;
    case "update": {
      const exerciseUpdates: Record<string, unknown> = {
        syncStatus: "synced",
        serverUpdatedAt: now,
        updatedAt: now,
      };
      if (data.name) exerciseUpdates.name = data.name as string;
      if (data.muscleGroup) exerciseUpdates.muscleGroup = data.muscleGroup;
      await db.update(exercises)
        .set(exerciseUpdates)
        .where(eq(exercises.id, op.entityId));
      break;
    }
    case "delete":
      await db.delete(exercises).where(eq(exercises.id, op.entityId));
      break;
  }
}

async function processWorkoutOp(
  op: SyncOperation,
  userId: string,
  now: Date
) {
  const data = op.data as Record<string, unknown>;

  switch (op.operation) {
    case "create":
      await db.insert(workouts).values({
        id: op.entityId,
        userId,
        name: data.name as string | undefined,
        startedAt: new Date(data.startedAt as string),
        completedAt: data.completedAt ? new Date(data.completedAt as string) : undefined,
        notes: data.notes as string | undefined,
        durationSeconds: data.durationSeconds as number | undefined,
        version: 1,
        syncStatus: "synced",
        serverUpdatedAt: now,
      }).onConflictDoUpdate({
        target: workouts.id,
        set: {
          name: data.name as string | undefined,
          completedAt: data.completedAt ? new Date(data.completedAt as string) : undefined,
          durationSeconds: data.durationSeconds as number | undefined,
          syncStatus: "synced",
          serverUpdatedAt: now,
        },
      });
      break;
    case "update": {
      const workoutUpdates: Record<string, unknown> = {
        syncStatus: "synced",
        serverUpdatedAt: now,
        updatedAt: now,
      };
      if (data.name !== undefined) workoutUpdates.name = data.name;
      if (data.completedAt) workoutUpdates.completedAt = new Date(data.completedAt as string);
      if (data.durationSeconds) workoutUpdates.durationSeconds = data.durationSeconds;
      if (data.notes !== undefined) workoutUpdates.notes = data.notes;
      await db.update(workouts)
        .set(workoutUpdates)
        .where(eq(workouts.id, op.entityId));
      break;
    }
    case "delete":
      // Delete cascades through foreign keys
      await db.delete(workouts).where(eq(workouts.id, op.entityId));
      break;
  }
}

async function processWorkoutExerciseOp(op: SyncOperation, now: Date) {
  const data = op.data as Record<string, unknown>;

  switch (op.operation) {
    case "create":
      await db.insert(workoutExercises).values({
        id: op.entityId,
        workoutId: data.workoutId as string,
        exerciseId: data.exerciseId as string,
        orderIndex: data.orderIndex as number,
        notes: data.notes as string | undefined,
        version: 1,
        syncStatus: "synced",
        serverUpdatedAt: now,
      }).onConflictDoUpdate({
        target: workoutExercises.id,
        set: {
          orderIndex: data.orderIndex as number,
          notes: data.notes as string | undefined,
          syncStatus: "synced",
          serverUpdatedAt: now,
        },
      });
      break;
    case "update":
      await db.update(workoutExercises)
        .set({
          ...(data.orderIndex !== undefined && { orderIndex: data.orderIndex as number }),
          ...(data.notes !== undefined && { notes: data.notes as string | undefined }),
          syncStatus: "synced",
          serverUpdatedAt: now,
          updatedAt: now,
        })
        .where(eq(workoutExercises.id, op.entityId));
      break;
    case "delete":
      await db.delete(workoutExercises).where(eq(workoutExercises.id, op.entityId));
      break;
  }
}

async function processSetOp(op: SyncOperation, now: Date) {
  const data = op.data as Record<string, unknown>;

  switch (op.operation) {
    case "create":
      await db.insert(sets).values({
        id: op.entityId,
        workoutExerciseId: data.workoutExerciseId as string,
        setNumber: data.setNumber as number,
        reps: data.reps as number | undefined,
        weight: data.weight as number | undefined,
        duration: data.duration as number | undefined,
        rpe: data.rpe as number | undefined,
        isWarmup: (data.isWarmup as boolean) ?? false,
        isDropset: (data.isDropset as boolean) ?? false,
        isFailure: (data.isFailure as boolean) ?? false,
        completedAt: data.completedAt ? new Date(data.completedAt as string) : undefined,
        version: 1,
        syncStatus: "synced",
        serverUpdatedAt: now,
      }).onConflictDoUpdate({
        target: sets.id,
        set: {
          reps: data.reps as number | undefined,
          weight: data.weight as number | undefined,
          syncStatus: "synced",
          serverUpdatedAt: now,
        },
      });
      break;
    case "update":
      await db.update(sets)
        .set({
          ...(data.reps !== undefined && { reps: data.reps as number | undefined }),
          ...(data.weight !== undefined && { weight: data.weight as number | undefined }),
          ...(data.duration !== undefined && { duration: data.duration as number | undefined }),
          ...(data.rpe !== undefined && { rpe: data.rpe as number | undefined }),
          ...(data.isWarmup !== undefined && { isWarmup: data.isWarmup as boolean }),
          ...(data.isDropset !== undefined && { isDropset: data.isDropset as boolean }),
          ...(data.isFailure !== undefined && { isFailure: data.isFailure as boolean }),
          syncStatus: "synced",
          serverUpdatedAt: now,
          updatedAt: now,
        })
        .where(eq(sets.id, op.entityId));
      break;
    case "delete":
      await db.delete(sets).where(eq(sets.id, op.entityId));
      break;
  }
}

// Get changes from server since last sync
export async function getChangesSince(userId: string, lastSyncAt: Date | null) {
  const since = lastSyncAt ?? new Date(0);

  const [userExercises, userWorkouts, userWorkoutExercises, userSets] = await Promise.all([
    db.query.exercises.findMany({
      where: and(
        eq(exercises.userId, userId),
        gt(exercises.serverUpdatedAt, since)
      ),
    }),
    db.query.workouts.findMany({
      where: and(
        eq(workouts.userId, userId),
        gt(workouts.serverUpdatedAt, since)
      ),
    }),
    // Get workout exercises for user's workouts
    db.query.workoutExercises.findMany({
      where: gt(workoutExercises.serverUpdatedAt, since),
    }),
    db.query.sets.findMany({
      where: gt(sets.serverUpdatedAt, since),
    }),
  ]);

  // Filter workout exercises and sets to only include those belonging to user's workouts
  const userWorkoutIds = new Set(userWorkouts.map(w => w.id));
  const filteredWorkoutExercises = userWorkoutExercises.filter(
    we => userWorkoutIds.has(we.workoutId)
  );
  const workoutExerciseIds = new Set(filteredWorkoutExercises.map(we => we.id));
  const filteredSets = userSets.filter(
    s => workoutExerciseIds.has(s.workoutExerciseId)
  );

  return {
    exercises: userExercises,
    workouts: userWorkouts,
    workoutExercises: filteredWorkoutExercises,
    sets: filteredSets,
  };
}
