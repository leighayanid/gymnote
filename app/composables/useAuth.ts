import { useLocalStorage } from '@vueuse/core'

export interface User {
  id: string
  email: string
  name: string
}

const DB_NAME = 'ryne_db'
const DB_VERSION = 1
const USER_STORE = 'user'

/**
 * IndexedDB helper for offline-first user storage
 */
class AuthDB {
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    if (this.db) return

    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        resolve()
        return
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result

        // Create user store if it doesn't exist
        if (!db.objectStoreNames.contains(USER_STORE)) {
          db.createObjectStore(USER_STORE)
        }
      }
    })
  }

  async setUser(user: User | null): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USER_STORE], 'readwrite')
      const store = transaction.objectStore(USER_STORE)

      const request = user
        ? store.put(user, 'current')
        : store.delete('current')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getUser(): Promise<User | null> {
    if (!this.db) await this.init()
    if (!this.db) return null

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USER_STORE], 'readonly')
      const store = transaction.objectStore(USER_STORE)
      const request = store.get('current')

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async clear(): Promise<void> {
    if (!this.db) await this.init()
    if (!this.db) return

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([USER_STORE], 'readwrite')
      const store = transaction.objectStore(USER_STORE)
      const request = store.clear()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }
}

const authDB = new AuthDB()

export const useAuth = () => {
  const user = useState<User | null>('auth_user', () => null)
  const isLoading = useState<boolean>('auth_loading', () => true)
  const isAuthenticated = computed(() => !!user.value)

  // Welcome functionality
  const hasSeenWelcome = useLocalStorage<boolean>('ryne_welcome_seen', false)

  const markWelcomeSeen = () => {
    hasSeenWelcome.value = true
  }

  /**
   * Initialize auth state from IndexedDB (offline-first)
   */
  const init = async () => {
    // Skip initialization on server-side
    if (typeof window === 'undefined') {
      isLoading.value = false
      return
    }

    try {
      // First, try to load user from IndexedDB (works offline)
      const cachedUser = await authDB.getUser()
      if (cachedUser) {
        user.value = cachedUser
      }

      // Then, if online, verify with server
      if (typeof navigator !== 'undefined' && navigator.onLine) {
        await fetchCurrentUser()
      }
    } catch (error) {
      console.error('Auth init error:', error)
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Fetch current user from server and update cache
   */
  const fetchCurrentUser = async () => {
    try {
      const response = await $fetch<{ user: User }>('/api/auth/me', {
        credentials: 'include', // Important: include cookies in the request
      })
      user.value = response.user
      await authDB.setUser(response.user)
    } catch (error: any) {
      if (error?.statusCode === 401) {
        // Not authenticated, clear cache
        user.value = null
        await authDB.clear()
      }
    }
  }

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch<{ user: User }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
        credentials: 'include', // Important: include cookies in the request
      })

      user.value = response.user
      await authDB.setUser(response.user)

      return response.user
    } catch (error: any) {
      console.error('Login error:', error)
      throw new Error(error?.data?.message || 'Login failed')
    }
  }

  /**
   * Signup with name, email, and password
   */
  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await $fetch<{ user: User }>('/api/auth/signup', {
        method: 'POST',
        body: { name, email, password },
        credentials: 'include', // Important: include cookies in the request
      })

      user.value = response.user
      await authDB.setUser(response.user)

      return response.user
    } catch (error: any) {
      console.error('Signup error:', error)
      throw new Error(error?.data?.message || 'Signup failed')
    }
  }

  /**
   * Logout
   */
  const logout = async () => {
    try {
      await $fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Important: include cookies in the request
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Always clear local state, even if server request fails
      user.value = null
      await authDB.clear()

      // Redirect to landing page
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }
  }

  /**
   * Refresh user data from server (when online)
   */
  const refresh = async () => {
    if (typeof navigator !== 'undefined' && navigator.onLine) {
      await fetchCurrentUser()
    }
  }

  return {
    user: readonly(user),
    isLoading: readonly(isLoading),
    isAuthenticated,
    hasSeenWelcome,
    markWelcomeSeen,
    init,
    login,
    signup,
    logout,
    refresh,
  }
}
