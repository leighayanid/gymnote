"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  localDb,
  generateId,
  createSyncMeta,
  updateSyncMeta,
  type LocalWorkout,
  type LocalWorkoutExercise,
  type LocalSet,
} from '@/db/local-database';

// Extended workout type with exercises and sets
export interface WorkoutWithExercises extends LocalWorkout {
  exercises: (LocalWorkoutExercise & {
    exercise: { id: string; name: string; muscleGroup: string };
    sets: LocalSet[];
  })[];
}

export function useWorkouts(userId: string) {
  const [isLoading, setIsLoading] = useState(true);

  // Get all workouts for user
  const workouts = useLiveQuery(async () => {
    if (!userId) return [];
    return localDb.workouts
      .where('userId')
      .equals(userId)
      .reverse()
      .sortBy('startedAt');
  }, [userId]);

  useEffect(() => {
    if (workouts !== undefined) {
      setIsLoading(false);
    }
  }, [workouts]);

  // Get completed workouts
  const completedWorkouts = useLiveQuery(async () => {
    if (!userId) return [];
    const all = await localDb.workouts.where('userId').equals(userId).toArray();
    return all
      .filter((w) => w.completedAt !== undefined)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  }, [userId]);

  // Get active (in-progress) workout
  const activeWorkout = useLiveQuery(async () => {
    if (!userId) return null;
    const all = await localDb.workouts.where('userId').equals(userId).toArray();
    return all.find((w) => !w.completedAt) ?? null;
  }, [userId]);

  // Start a new workout
  const startWorkout = useCallback(
    async (name?: string): Promise<LocalWorkout> => {
      const now = new Date();
      const workout: LocalWorkout = {
        id: generateId(),
        userId,
        name,
        startedAt: now,
        createdAt: now,
        updatedAt: now,
        ...createSyncMeta(),
      };

      await localDb.workouts.add(workout);

      await localDb.syncQueue.add({
        entityType: 'workout',
        entityId: workout.id,
        operation: 'create',
        data: workout as unknown as Record<string, unknown>,
        createdAt: now,
        attempts: 0,
      });

      return workout;
    },
    [userId]
  );

  // Complete a workout
  const completeWorkout = useCallback(async (workoutId: string) => {
    const existing = await localDb.workouts.get(workoutId);
    if (!existing) throw new Error('Workout not found');

    const now = new Date();
    const durationSeconds = Math.floor(
      (now.getTime() - new Date(existing.startedAt).getTime()) / 1000
    );

    const updates = {
      completedAt: now,
      durationSeconds,
      updatedAt: now,
      ...updateSyncMeta(existing),
    };

    await localDb.workouts.update(workoutId, updates);

    await localDb.syncQueue.add({
      entityType: 'workout',
      entityId: workoutId,
      operation: 'update',
      data: updates as unknown as Record<string, unknown>,
      createdAt: now,
      attempts: 0,
    });
  }, []);

  // Delete a workout
  const deleteWorkout = useCallback(async (workoutId: string) => {
    // Delete all related sets and workout exercises first
    const workoutExercises = await localDb.workoutExercises
      .where('workoutId')
      .equals(workoutId)
      .toArray();

    for (const we of workoutExercises) {
      await localDb.sets.where('workoutExerciseId').equals(we.id).delete();
    }

    await localDb.workoutExercises.where('workoutId').equals(workoutId).delete();
    await localDb.workouts.delete(workoutId);

    await localDb.syncQueue.add({
      entityType: 'workout',
      entityId: workoutId,
      operation: 'delete',
      data: { id: workoutId },
      createdAt: new Date(),
      attempts: 0,
    });
  }, []);

  // Add exercise to workout
  const addExerciseToWorkout = useCallback(
    async (workoutId: string, exerciseId: string): Promise<LocalWorkoutExercise> => {
      const existing = await localDb.workoutExercises
        .where('workoutId')
        .equals(workoutId)
        .toArray();

      const now = new Date();
      const workoutExercise: LocalWorkoutExercise = {
        id: generateId(),
        workoutId,
        exerciseId,
        orderIndex: existing.length,
        createdAt: now,
        updatedAt: now,
        ...createSyncMeta(),
      };

      await localDb.workoutExercises.add(workoutExercise);

      await localDb.syncQueue.add({
        entityType: 'workoutExercise',
        entityId: workoutExercise.id,
        operation: 'create',
        data: workoutExercise as unknown as Record<string, unknown>,
        createdAt: now,
        attempts: 0,
      });

      return workoutExercise;
    },
    []
  );

  // Remove exercise from workout
  const removeExerciseFromWorkout = useCallback(
    async (workoutExerciseId: string) => {
      // Delete all sets for this exercise
      await localDb.sets.where('workoutExerciseId').equals(workoutExerciseId).delete();
      await localDb.workoutExercises.delete(workoutExerciseId);

      await localDb.syncQueue.add({
        entityType: 'workoutExercise',
        entityId: workoutExerciseId,
        operation: 'delete',
        data: { id: workoutExerciseId },
        createdAt: new Date(),
        attempts: 0,
      });
    },
    []
  );

  // Add set to workout exercise
  const addSet = useCallback(
    async (
      workoutExerciseId: string,
      data: Partial<Pick<LocalSet, 'reps' | 'weight' | 'duration' | 'rpe' | 'isWarmup' | 'isDropset' | 'isFailure'>>
    ): Promise<LocalSet> => {
      const existingSets = await localDb.sets
        .where('workoutExerciseId')
        .equals(workoutExerciseId)
        .toArray();

      const now = new Date();
      const set: LocalSet = {
        id: generateId(),
        workoutExerciseId,
        setNumber: existingSets.length + 1,
        reps: data.reps,
        weight: data.weight,
        duration: data.duration,
        rpe: data.rpe,
        isWarmup: data.isWarmup ?? false,
        isDropset: data.isDropset ?? false,
        isFailure: data.isFailure ?? false,
        completedAt: now,
        createdAt: now,
        updatedAt: now,
        ...createSyncMeta(),
      };

      await localDb.sets.add(set);

      await localDb.syncQueue.add({
        entityType: 'set',
        entityId: set.id,
        operation: 'create',
        data: set as unknown as Record<string, unknown>,
        createdAt: now,
        attempts: 0,
      });

      return set;
    },
    []
  );

  // Update set
  const updateSet = useCallback(
    async (
      setId: string,
      data: Partial<Pick<LocalSet, 'reps' | 'weight' | 'duration' | 'rpe' | 'isWarmup' | 'isDropset' | 'isFailure'>>
    ) => {
      const existing = await localDb.sets.get(setId);
      if (!existing) throw new Error('Set not found');

      const now = new Date();
      const updates = {
        ...data,
        updatedAt: now,
        ...updateSyncMeta(existing),
      };

      await localDb.sets.update(setId, updates);

      await localDb.syncQueue.add({
        entityType: 'set',
        entityId: setId,
        operation: 'update',
        data: updates as unknown as Record<string, unknown>,
        createdAt: now,
        attempts: 0,
      });
    },
    []
  );

  // Delete set
  const deleteSet = useCallback(async (setId: string) => {
    await localDb.sets.delete(setId);

    await localDb.syncQueue.add({
      entityType: 'set',
      entityId: setId,
      operation: 'delete',
      data: { id: setId },
      createdAt: new Date(),
      attempts: 0,
    });
  }, []);

  return {
    workouts: workouts ?? [],
    completedWorkouts: completedWorkouts ?? [],
    activeWorkout,
    isLoading,
    startWorkout,
    completeWorkout,
    deleteWorkout,
    addExerciseToWorkout,
    removeExerciseFromWorkout,
    addSet,
    updateSet,
    deleteSet,
  };
}

// Get a single workout with all exercises and sets
export function useWorkout(workoutId: string) {
  const workout = useLiveQuery(async () => {
    if (!workoutId) return null;

    const w = await localDb.workouts.get(workoutId);
    if (!w) return null;

    const workoutExercises = await localDb.workoutExercises
      .where('workoutId')
      .equals(workoutId)
      .sortBy('orderIndex');

    const exercisesWithSets = await Promise.all(
      workoutExercises.map(async (we) => {
        const exercise = await localDb.exercises.get(we.exerciseId);
        const sets = await localDb.sets
          .where('workoutExerciseId')
          .equals(we.id)
          .sortBy('setNumber');

        return {
          ...we,
          exercise: exercise
            ? { id: exercise.id, name: exercise.name, muscleGroup: exercise.muscleGroup }
            : { id: we.exerciseId, name: 'Unknown', muscleGroup: 'full_body' },
          sets,
        };
      })
    );

    return {
      ...w,
      exercises: exercisesWithSets,
    } as WorkoutWithExercises;
  }, [workoutId]);

  return workout;
}

// Get workout stats
export function useWorkoutStats(userId: string) {
  const stats = useLiveQuery(async () => {
    if (!userId) return null;

    const workouts = await localDb.workouts.where('userId').equals(userId).toArray();
    const completedWorkouts = workouts.filter((w) => w.completedAt);

    const totalWorkouts = completedWorkouts.length;
    const totalDuration = completedWorkouts.reduce(
      (acc, w) => acc + (w.durationSeconds ?? 0),
      0
    );

    // Get workouts from last 7 days
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const thisWeek = completedWorkouts.filter(
      (w) => new Date(w.completedAt!) >= weekAgo
    );

    return {
      totalWorkouts,
      totalDurationMinutes: Math.round(totalDuration / 60),
      workoutsThisWeek: thisWeek.length,
      averageDurationMinutes:
        totalWorkouts > 0 ? Math.round(totalDuration / totalWorkouts / 60) : 0,
    };
  }, [userId]);

  return stats;
}
