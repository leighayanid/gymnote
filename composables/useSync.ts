import { localDB } from '~/utils/db'
import type { SyncQueueItem } from '~/types'

export const useSync = () => {
  const { isOnline } = useNetwork()
  const syncing = useState('syncing', () => false)
  const lastSyncTime = useState<Date | null>('lastSyncTime', () => null)
  const toast = useToast()

  const addToSyncQueue = async (item: SyncQueueItem) => {
    await localDB.init()
    await localDB.addToSyncQueue(item)

    // Trigger sync if online
    if (isOnline.value) {
      await syncData()
    }
  }

  const syncData = async () => {
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
            toast.error('Sync failed', 'Some workouts could not be synced. Please check your connection.')
            // Mark as failed but keep in queue for manual retry
          }
        }
      }

      lastSyncTime.value = new Date()

      // Show success message only if we synced items and had no failures
      if (successCount > 0 && !hasFailures) {
        toast.success('Sync complete', `${successCount} workout${successCount > 1 ? 's' : ''} synced successfully`)
      }
    } catch (error) {
      console.error('Sync failed:', error)
      toast.error('Sync error', 'Unable to sync your workouts. Please try again later.')
    } finally {
      syncing.value = false
    }
  }

  const syncCreateWorkout = async (item: SyncQueueItem) => {
    const workout = item.data
    const { getAccessToken } = useAuth()
    const token = getAccessToken()

    if (!token) {
      throw new Error('No access token available')
    }

    // Send to server
    const response = await $fetch('/api/workouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
    })

    // Update local record with serverId
    const localWorkout = await localDB.getWorkout(workout.localId)
    if (localWorkout) {
      localWorkout.serverId = (response as any).id
      localWorkout.syncStatus = 'synced'
      await localDB.saveWorkout(localWorkout)

      // Update exercises with serverIds if provided
      if ((response as any).exercises) {
        for (let i = 0; i < workout.exercises.length; i++) {
          const exercise = workout.exercises[i]
          const localExercise = await localDB.getExercisesByWorkout(workout.localId)
          const match = localExercise[i]
          if (match && (response as any).exercises[i]) {
            match.serverId = (response as any).exercises[i].id
            await localDB.saveExercise(match)
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

    const { getAccessToken } = useAuth()
    const token = getAccessToken()

    if (!token) {
      throw new Error('No access token available')
    }

    // Send to server
    await $fetch(`/api/workouts/${workout.serverId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      },
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
      const { getAccessToken } = useAuth()
      const token = getAccessToken()

      if (!token) {
        throw new Error('No access token available')
      }

      await $fetch(`/api/workouts/${serverId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    }
  }

  // Auto-sync when coming online
  const setupAutoSync = () => {
    if (import.meta.client) {
      watch(isOnline, (online) => {
        if (online) {
          syncData()
        }
      })

      // Periodic sync every 5 minutes when online
      setInterval(() => {
        if (isOnline.value) {
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
