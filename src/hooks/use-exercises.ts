"use client";

import { useState, useEffect, useCallback } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import {
  localDb,
  generateId,
  createSyncMeta,
  updateSyncMeta,
  type LocalExercise,
  type MuscleGroup,
} from '@/db/local-database';

export function useExercises(muscleGroup?: MuscleGroup) {
  const [isLoading, setIsLoading] = useState(true);

  // Live query for exercises
  const exercises = useLiveQuery(async () => {
    if (muscleGroup) {
      return localDb.exercises
        .where('muscleGroup')
        .equals(muscleGroup)
        .toArray();
    }
    return localDb.exercises.toArray();
  }, [muscleGroup]);

  useEffect(() => {
    if (exercises !== undefined) {
      setIsLoading(false);
    }
  }, [exercises]);

  // Get exercises grouped by muscle group
  const exercisesByGroup = useLiveQuery(async () => {
    const all = await localDb.exercises.toArray();
    const grouped: Record<MuscleGroup, LocalExercise[]> = {
      chest: [],
      back: [],
      shoulders: [],
      biceps: [],
      triceps: [],
      forearms: [],
      core: [],
      quadriceps: [],
      hamstrings: [],
      glutes: [],
      calves: [],
      full_body: [],
    };

    for (const exercise of all) {
      grouped[exercise.muscleGroup].push(exercise);
    }

    return grouped;
  }, []);

  // Add custom exercise
  const addExercise = useCallback(
    async (name: string, muscleGroup: MuscleGroup, userId: string) => {
      const now = new Date();
      const exercise: LocalExercise = {
        id: generateId(),
        userId,
        name,
        muscleGroup,
        isCustom: true,
        isBuiltIn: false,
        createdAt: now,
        updatedAt: now,
        ...createSyncMeta(),
      };

      await localDb.exercises.add(exercise);

      // Add to sync queue
      await localDb.syncQueue.add({
        entityType: 'exercise',
        entityId: exercise.id,
        operation: 'create',
        data: exercise as unknown as Record<string, unknown>,
        createdAt: now,
        attempts: 0,
      });

      return exercise;
    },
    []
  );

  // Update exercise
  const updateExercise = useCallback(
    async (id: string, updates: Partial<Pick<LocalExercise, 'name' | 'muscleGroup'>>) => {
      const existing = await localDb.exercises.get(id);
      if (!existing) throw new Error('Exercise not found');

      const now = new Date();
      const updatedExercise = {
        ...updates,
        updatedAt: now,
        ...updateSyncMeta(existing),
      };

      await localDb.exercises.update(id, updatedExercise);

      // Add to sync queue
      await localDb.syncQueue.add({
        entityType: 'exercise',
        entityId: id,
        operation: 'update',
        data: updatedExercise as unknown as Record<string, unknown>,
        createdAt: now,
        attempts: 0,
      });
    },
    []
  );

  // Delete exercise
  const deleteExercise = useCallback(async (id: string) => {
    const existing = await localDb.exercises.get(id);
    if (!existing) return;

    // Only allow deleting custom exercises
    if (existing.isBuiltIn) {
      throw new Error('Cannot delete built-in exercises');
    }

    await localDb.exercises.delete(id);

    // Add to sync queue
    await localDb.syncQueue.add({
      entityType: 'exercise',
      entityId: id,
      operation: 'delete',
      data: { id },
      createdAt: new Date(),
      attempts: 0,
    });
  }, []);

  // Search exercises
  const searchExercises = useCallback(async (query: string) => {
    const normalizedQuery = query.toLowerCase().trim();
    if (!normalizedQuery) {
      return localDb.exercises.toArray();
    }

    const all = await localDb.exercises.toArray();
    return all.filter((e) =>
      e.name.toLowerCase().includes(normalizedQuery)
    );
  }, []);

  return {
    exercises: exercises ?? [],
    exercisesByGroup,
    isLoading,
    addExercise,
    updateExercise,
    deleteExercise,
    searchExercises,
  };
}

export function useExercise(id: string) {
  const exercise = useLiveQuery(() => localDb.exercises.get(id), [id]);
  return exercise;
}
