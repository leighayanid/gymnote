"use client";

import { useState, useCallback, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { localDb } from '@/db/local-database';
import { useOnlineStatus } from './use-online-status';

export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';

export function useSync() {
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncAt, setLastSyncAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isOnline } = useOnlineStatus();

  // Get pending sync count
  const pendingCount = useLiveQuery(() => localDb.syncQueue.count(), []);

  // Manual sync trigger
  const sync = useCallback(async () => {
    if (!isOnline) {
      setSyncState('offline');
      return false;
    }

    setSyncState('syncing');
    setError(null);

    try {
      const pending = await localDb.syncQueue.toArray();

      if (pending.length === 0) {
        setSyncState('idle');
        setLastSyncAt(new Date());
        return true;
      }

      // Push changes to server
      const response = await fetch('/api/sync/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ operations: pending }),
      });

      if (!response.ok) {
        throw new Error('Sync failed');
      }

      const result = await response.json();

      // Remove successfully synced operations
      if (result.syncedIds && Array.isArray(result.syncedIds)) {
        await localDb.syncQueue.bulkDelete(result.syncedIds);
      }

      // Update local entities with server timestamps
      if (result.updates) {
        for (const update of result.updates) {
          const table = getTable(update.entityType);
          if (table) {
            await table.update(update.entityId, {
              syncStatus: 'synced',
              serverUpdatedAt: new Date(update.serverUpdatedAt),
            });
          }
        }
      }

      // Pull changes from server
      await pullChanges();

      setSyncState('idle');
      setLastSyncAt(new Date());
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      setSyncState('error');
      return false;
    }
  }, [isOnline]);

  // Pull changes from server
  const pullChanges = useCallback(async () => {
    try {
      const response = await fetch('/api/sync/pull', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lastSyncAt }),
      });

      if (!response.ok) return;

      const result = await response.json();

      // Apply server changes locally
      if (result.exercises) {
        for (const exercise of result.exercises) {
          const local = await localDb.exercises.get(exercise.id);
          if (!local || new Date(exercise.serverUpdatedAt) > new Date(local.serverUpdatedAt)) {
            await localDb.exercises.put({
              ...exercise,
              syncStatus: 'synced',
            });
          }
        }
      }

      if (result.workouts) {
        for (const workout of result.workouts) {
          const local = await localDb.workouts.get(workout.id);
          if (!local || new Date(workout.serverUpdatedAt) > new Date(local.serverUpdatedAt)) {
            await localDb.workouts.put({
              ...workout,
              syncStatus: 'synced',
            });
          }
        }
      }

      if (result.workoutExercises) {
        for (const we of result.workoutExercises) {
          const local = await localDb.workoutExercises.get(we.id);
          if (!local || new Date(we.serverUpdatedAt) > new Date(local.serverUpdatedAt)) {
            await localDb.workoutExercises.put({
              ...we,
              syncStatus: 'synced',
            });
          }
        }
      }

      if (result.sets) {
        for (const set of result.sets) {
          const local = await localDb.sets.get(set.id);
          if (!local || new Date(set.serverUpdatedAt) > new Date(local.serverUpdatedAt)) {
            await localDb.sets.put({
              ...set,
              syncStatus: 'synced',
            });
          }
        }
      }
    } catch (err) {
      console.error('Pull failed:', err);
    }
  }, [lastSyncAt]);

  // Auto-sync when coming online
  useEffect(() => {
    if (isOnline && pendingCount && pendingCount > 0) {
      sync();
    }
  }, [isOnline, pendingCount, sync]);

  // Update state when offline
  useEffect(() => {
    if (!isOnline && syncState === 'idle') {
      setSyncState('offline');
    } else if (isOnline && syncState === 'offline') {
      setSyncState('idle');
    }
  }, [isOnline, syncState]);

  return {
    syncState,
    pendingCount: pendingCount ?? 0,
    lastSyncAt,
    error,
    sync,
    isOnline,
  };
}

// Helper to get the correct table
function getTable(entityType: string) {
  switch (entityType) {
    case 'exercise':
      return localDb.exercises;
    case 'workout':
      return localDb.workouts;
    case 'workoutExercise':
      return localDb.workoutExercises;
    case 'set':
      return localDb.sets;
    default:
      return null;
  }
}
