import type { LocalWorkout, LocalExercise, SyncQueueItem, WorkoutTemplate } from '~/types'

const DB_NAME = 'gymnote-db'
const DB_VERSION = 1

export class LocalDB {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Workouts store
        if (!db.objectStoreNames.contains('workouts')) {
          const workoutStore = db.createObjectStore('workouts', { keyPath: 'localId' })
          workoutStore.createIndex('serverId', 'serverId', { unique: false })
          workoutStore.createIndex('date', 'date', { unique: false })
          workoutStore.createIndex('syncStatus', 'syncStatus', { unique: false })
        }

        // Exercises store
        if (!db.objectStoreNames.contains('exercises')) {
          const exerciseStore = db.createObjectStore('exercises', { keyPath: 'localId' })
          exerciseStore.createIndex('serverId', 'serverId', { unique: false })
          exerciseStore.createIndex('workoutLocalId', 'workoutLocalId', { unique: false })
        }

        // Sync queue store
        if (!db.objectStoreNames.contains('sync_queue')) {
          const syncStore = db.createObjectStore('sync_queue', { keyPath: 'id' })
          syncStore.createIndex('timestamp', 'timestamp', { unique: false })
        }

        // Templates store
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id' })
        }
      }
    })
  }

  private getStore(storeName: string, mode: IDBTransactionMode = 'readonly'): IDBObjectStore {
    if (!this.db) throw new Error('Database not initialized')
    const transaction = this.db.transaction([storeName], mode)
    return transaction.objectStore(storeName)
  }

  // Workouts
  async getWorkouts(): Promise<LocalWorkout[]> {
    const store = this.getStore('workouts')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async getWorkout(localId: string): Promise<LocalWorkout | undefined> {
    const store = this.getStore('workouts')
    return new Promise((resolve, reject) => {
      const request = store.get(localId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveWorkout(workout: LocalWorkout): Promise<void> {
    const store = this.getStore('workouts', 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.put(workout)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteWorkout(localId: string): Promise<void> {
    const store = this.getStore('workouts', 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.delete(localId)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Exercises
  async getExercisesByWorkout(workoutLocalId: string): Promise<LocalExercise[]> {
    const store = this.getStore('exercises')
    const index = store.index('workoutLocalId')
    return new Promise((resolve, reject) => {
      const request = index.getAll(workoutLocalId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveExercise(exercise: LocalExercise): Promise<void> {
    const store = this.getStore('exercises', 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.put(exercise)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteExercise(localId: string): Promise<void> {
    const store = this.getStore('exercises', 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.delete(localId)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async deleteExercisesByWorkout(workoutLocalId: string): Promise<void> {
    const exercises = await this.getExercisesByWorkout(workoutLocalId)
    const store = this.getStore('exercises', 'readwrite')

    return new Promise((resolve, reject) => {
      let completed = 0
      const total = exercises.length

      if (total === 0) {
        resolve()
        return
      }

      exercises.forEach(exercise => {
        const request = store.delete(exercise.localId)
        request.onsuccess = () => {
          completed++
          if (completed === total) resolve()
        }
        request.onerror = () => reject(request.error)
      })
    })
  }

  // Sync Queue
  async addToSyncQueue(item: SyncQueueItem): Promise<void> {
    const store = this.getStore('sync_queue', 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.put(item)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async getSyncQueue(): Promise<SyncQueueItem[]> {
    const store = this.getStore('sync_queue')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async removeSyncQueueItem(id: string): Promise<void> {
    const store = this.getStore('sync_queue', 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.delete(id)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Templates
  async getTemplates(): Promise<WorkoutTemplate[]> {
    const store = this.getStore('templates')
    return new Promise((resolve, reject) => {
      const request = store.getAll()
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  async saveTemplate(template: WorkoutTemplate): Promise<void> {
    const store = this.getStore('templates', 'readwrite')
    return new Promise((resolve, reject) => {
      const request = store.put(template)
      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }
}

export const localDB = new LocalDB()
