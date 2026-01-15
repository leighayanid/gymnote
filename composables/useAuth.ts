export const useAuth = () => {
  const user = useState<{ id: string; name: string; email: string } | null>('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  const hasSeenWelcome = useState('hasSeenWelcome', () => false)
  const accessToken = useState<string | null>('accessToken', () => null)
  const refreshToken = useState<string | null>('refreshToken', () => null)

  const login = async (email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          email,
          password
        }
      })

      user.value = {
        id: (response as any).user.id,
        name: (response as any).user.name,
        email: (response as any).user.email
      }
      accessToken.value = (response as any).accessToken
      refreshToken.value = (response as any).refreshToken
      isAuthenticated.value = true

      // Store in localStorage
      if (process.client) {
        localStorage.setItem('gymnote_user', JSON.stringify(user.value))
        localStorage.setItem('gymnote_access_token', accessToken.value!)
        localStorage.setItem('gymnote_refresh_token', refreshToken.value!)
        localStorage.setItem('gymnote_authenticated', 'true')
      }
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await $fetch('/api/auth/signup', {
        method: 'POST',
        body: {
          name,
          email,
          password
        }
      })

      user.value = {
        id: (response as any).user.id,
        name: (response as any).user.name,
        email: (response as any).user.email
      }
      accessToken.value = (response as any).accessToken
      refreshToken.value = (response as any).refreshToken
      isAuthenticated.value = true
      hasSeenWelcome.value = false

      // Store in localStorage
      if (process.client) {
        localStorage.setItem('gymnote_user', JSON.stringify(user.value))
        localStorage.setItem('gymnote_access_token', accessToken.value!)
        localStorage.setItem('gymnote_refresh_token', refreshToken.value!)
        localStorage.setItem('gymnote_authenticated', 'true')
        localStorage.removeItem('gymnote_seen_welcome')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      if (refreshToken.value) {
        await $fetch('/api/auth/logout', {
          method: 'POST',
          body: {
            token: refreshToken.value
          }
        })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      isAuthenticated.value = false

      // Clear localStorage
      if (process.client) {
        localStorage.removeItem('gymnote_user')
        localStorage.removeItem('gymnote_access_token')
        localStorage.removeItem('gymnote_refresh_token')
        localStorage.removeItem('gymnote_authenticated')
        localStorage.removeItem('gymnote_seen_welcome')
      }
    }
  }

  const markWelcomeSeen = () => {
    hasSeenWelcome.value = true
    if (process.client) {
      localStorage.setItem('gymnote_seen_welcome', 'true')
    }
  }

  const getAccessToken = () => {
    return accessToken.value
  }

  const getRefreshToken = () => {
    return refreshToken.value
  }

  const refreshAccessToken = async (): Promise<boolean> => {
    const currentRefreshToken = refreshToken.value
    if (!currentRefreshToken) {
      return false
    }

    try {
      const response = await $fetch('/api/auth/refresh', {
        method: 'POST',
        body: {
          token: currentRefreshToken
        }
      })

      accessToken.value = (response as any).accessToken

      // Update user info if provided
      if ((response as any).user) {
        user.value = {
          id: (response as any).user.id,
          name: (response as any).user.name,
          email: (response as any).user.email
        }
      }

      // Update localStorage
      if (process.client) {
        localStorage.setItem('gymnote_access_token', accessToken.value!)
        if (user.value) {
          localStorage.setItem('gymnote_user', JSON.stringify(user.value))
        }
      }

      return true
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, user needs to re-login
      await logout()
      return false
    }
  }

  const initAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('gymnote_user')
      const storedAccessToken = localStorage.getItem('gymnote_access_token')
      const storedRefreshToken = localStorage.getItem('gymnote_refresh_token')
      const storedAuth = localStorage.getItem('gymnote_authenticated')
      const storedWelcome = localStorage.getItem('gymnote_seen_welcome')

      if (storedUser && storedAuth === 'true' && storedAccessToken) {
        user.value = JSON.parse(storedUser)
        accessToken.value = storedAccessToken
        refreshToken.value = storedRefreshToken
        isAuthenticated.value = true
      }

      if (storedWelcome === 'true') {
        hasSeenWelcome.value = true
      }
    }
  }

  return {
    user,
    isAuthenticated,
    hasSeenWelcome,
    accessToken,
    login,
    signup,
    logout,
    markWelcomeSeen,
    getAccessToken,
    getRefreshToken,
    refreshAccessToken,
    initAuth
  }
}
