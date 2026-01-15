import { localDB } from '~/utils/db'
import type { SyncQueueItem } from '~/types'

export const useSync = () => {
  const { isOnline } = useNetwork()
  const syncing = useState('syncing', () => false)
  const lastSyncTime = useState<Date | null>('lastSyncTime', () => null)
  const toast = useToast()

  // Helper function that handles API calls with automatic token refresh on 401
  const authenticatedFetch = async <T>(
    url: string,
    options: { method: string; body?: any }
  ): Promise<T> => {
    const { getAccessToken, refreshAccessToken } = useAuth()
    let token = getAccessToken()

    if (!token) {
      // Try to refresh the token first
      const refreshed = await refreshAccessToken()
      if (!refreshed) {
        throw new Error('No access token available and refresh failed')
      }
      token = getAccessToken()
    }

    try {
      const response = await $fetch<T>(url, {
        method: options.method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: options.body
      })
      return response
    } catch (error: any) {
      // Check if it's a 401 error (token expired)
      if (error?.response?.status === 401 || error?.statusCode === 401) {
        // Try to refresh the token
        const refreshed = await refreshAccessToken()
        if (!refreshed) {
          throw new Error('Token expired and refresh failed')
        }

        // Get the new token and retry the request
        const newToken = getAccessToken()
        const response = await $fetch<T>(url, {
          method: options.method,
          headers: {
            'Authorization': `Bearer ${newToken}`
          },
          body: options.body
        })
        return response
      }
      throw error
    }
  }

  const addToSyncQueue = async (item: SyncQueueItem) => {
    await localDB.init()
    await localDB.addToSyncQueue(item)

    // Trigger sync if online
    if (isOnline.value) {
      await syncData()
    }
  }

  const syncData = async (options: { manual?: boolean } = {}) => {
    if (syncing.value) return
    if (!isOnline.value) return

    syncing.value = true

    try {
      await localDB.init()
      const queue = await localDB.getSyncQueue()

      if (queue.length === 0) {
        syncing.value = false
        return
      }

      console.log(`Starting ${options.manual ? 'manual' : 'automatic'} sync for ${queue.length} items`)

      // Group items by workout for batch processing
      const workoutItems = queue.filter(item => item.entityType === 'workout')

      let hasFailures = false
      let successCount = 0

      // Process each item
      for (const item of workoutItems) {
        try {
          if (item.action === 'create') {
            await syncCreateWorkout(item)
          } else if (item.action === 'update') {
            await syncUpdateWorkout(item)
          } else if (item.action === 'delete') {
            await syncDeleteWorkout(item)
          }

          // Remove from sync queue on success
          await localDB.removeSyncQueueItem(item.id)
          successCount++
        } catch (error) {
          console.error('Sync failed for item:', item, error)
          hasFailures = true

          // Increment retry count
          item.retryCount++
          if (item.retryCount < 3) {
            await localDB.addToSyncQueue(item)
          } else {
            console.error('Max retries reached for item:', item)
            if (options.manual) {
              toast.error('Sync failed', 'Some workouts could not be synced. Please check your connection.')
            }
            // Mark as failed but keep in queue for manual retry
          }
        }
      }

      lastSyncTime.value = new Date()

      console.log(`Sync complete: ${successCount} items synced, ${hasFailures ? 'with failures' : 'no failures'}`)

      // Show success message only for manual syncs or if we synced items with failures
      if (options.manual && successCount > 0) {
        toast.success('Sync complete', `${successCount} workout${successCount > 1 ? 's' : ''} synced successfully`)
      }
    } catch (error) {
      console.error('Sync failed:', error)
      if (options.manual) {
        toast.error('Sync error', 'Unable to sync your workouts. Please try again later.')
      }
    } finally {
      syncing.value = false
    }
  }

  const syncCreateWorkout = async (item: SyncQueueItem) => {
    const workout = item.data
<<<<<<< HEAD:composables/useSync.ts

    // Send to server with automatic token refresh
    const response = await authenticatedFetch<{ id: string; exercises?: Array<{ id: string }> }>(
      '/api/workouts',
      {
        method: 'POST',
        body: {
          date: workout.date,
          notes: workout.notes,
          exercises: workout.exercises.map((e: any) => ({
            name: e.name,
            sets: e.sets,
            reps: e.reps,
            weight: e.weight,
            notes: e.notes
          }))
        }
=======
    // Send to server
    const response = await $fetch('/api/workouts', {
      method: 'POST',
      credentials: 'include',
      body: {
        date: new Date(workout.date).toISOString(),
        notes: workout.notes,
        status: workout.status,
        exercises: workout.exercises.map((e: any) => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          notes: e.notes
        }))
>>>>>>> main:app/composables/useSync.ts
      }
    )

    // Update local record with serverId
    const localWorkout = await localDB.getWorkout(workout.localId)
    if (localWorkout) {
      localWorkout.serverId = response.id
      localWorkout.syncStatus = 'synced'
      await localDB.saveWorkout(localWorkout)

      // Update exercises with serverIds if provided
<<<<<<< HEAD:composables/useSync.ts
      if (response.exercises && response.exercises.length > 0) {
        const localExercises = await localDB.getExercisesByWorkout(workout.localId)
        for (let i = 0; i < localExercises.length && i < response.exercises.length; i++) {
          const localExercise = localExercises[i]
          if (localExercise && response.exercises[i]) {
            localExercise.serverId = response.exercises[i].id
            await localDB.saveExercise(localExercise)
=======
      if ((response as any).exercises) {
        const localExercises = await localDB.getExercisesByWorkout(workout.localId)
        for (let i = 0; i < workout.exercises.length; i++) {
          const match = localExercises[i]
          if (match && (response as any).exercises[i]) {
            match.serverId = (response as any).exercises[i].id
            await localDB.saveExercise(match)
>>>>>>> main:app/composables/useSync.ts
          }
        }
      }
    }
  }

  const syncUpdateWorkout = async (item: SyncQueueItem) => {
    const workout = item.data

    if (!workout.serverId) {
      // If no serverId, treat as create
      return syncCreateWorkout(item)
    }

<<<<<<< HEAD:composables/useSync.ts
    // Send to server with automatic token refresh
    await authenticatedFetch(`/api/workouts/${workout.serverId}`, {
      method: 'PUT',
=======
    // Send to server
    await $fetch(`/api/workouts/${workout.serverId}`, {
      method: 'PUT',
      credentials: 'include',
>>>>>>> main:app/composables/useSync.ts
      body: {
        date: new Date(workout.date).toISOString(),
        notes: workout.notes,
        status: workout.status,
        exercises: workout.exercises.map((e: any) => ({
          name: e.name,
          sets: e.sets,
          reps: e.reps,
          weight: e.weight,
          notes: e.notes
        }))
      }
    })

    // Update sync status
    const localWorkout = await localDB.getWorkout(workout.localId)
    if (localWorkout) {
      localWorkout.syncStatus = 'synced'
      await localDB.saveWorkout(localWorkout)
    }
  }

  const syncDeleteWorkout = async (item: SyncQueueItem) => {
    const { serverId } = item.data

    if (serverId) {
<<<<<<< HEAD:composables/useSync.ts
      // Delete from server with automatic token refresh
      await authenticatedFetch(`/api/workouts/${serverId}`, {
        method: 'DELETE'
=======
      await $fetch(`/api/workouts/${serverId}`, {
        method: 'DELETE',
        credentials: 'include',
>>>>>>> main:app/composables/useSync.ts
      })
    }
  }

  // Auto-sync when coming online
  const setupAutoSync = () => {
    if (import.meta.client) {
      // Initial sync on setup if online
      if (isOnline.value) {
        syncData()
      }

      // Watch for online status changes
      watch(isOnline, (online) => {
        if (online) {
          console.log('Network came online, triggering sync...')
          syncData()
        }
      })

      // Periodic sync every 5 minutes when online
      setInterval(() => {
        if (isOnline.value) {
          console.log('Periodic sync triggered')
          syncData()
        }
      }, 5 * 60 * 1000)
    }
  }

  return {
    syncing,
    lastSyncTime,
    addToSyncQueue,
    syncData,
    setupAutoSync
  }
}
