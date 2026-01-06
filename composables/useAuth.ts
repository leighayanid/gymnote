export const useAuth = () => {
  const user = useState<{ name: string; email: string } | null>('user', () => null)
  const isAuthenticated = useState('isAuthenticated', () => false)
  const hasSeenWelcome = useState('hasSeenWelcome', () => false)

  const login = (email: string, password: string) => {
    // Simple mock authentication - in production, this would call an API
    user.value = {
      name: email.split('@')[0],
      email: email
    }
    isAuthenticated.value = true

    // Store in localStorage
    if (process.client) {
      localStorage.setItem('gymnote_user', JSON.stringify(user.value))
      localStorage.setItem('gymnote_authenticated', 'true')
    }
  }

  const signup = (name: string, email: string, password: string) => {
    // Simple mock signup - in production, this would call an API
    user.value = {
      name: name,
      email: email
    }
    isAuthenticated.value = true
    hasSeenWelcome.value = false

    // Store in localStorage
    if (process.client) {
      localStorage.setItem('gymnote_user', JSON.stringify(user.value))
      localStorage.setItem('gymnote_authenticated', 'true')
      localStorage.removeItem('gymnote_seen_welcome')
    }
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false

    // Clear localStorage
    if (process.client) {
      localStorage.removeItem('gymnote_user')
      localStorage.removeItem('gymnote_authenticated')
      localStorage.removeItem('gymnote_seen_welcome')
    }
  }

  const markWelcomeSeen = () => {
    hasSeenWelcome.value = true
    if (process.client) {
      localStorage.setItem('gymnote_seen_welcome', 'true')
    }
  }

  const initAuth = () => {
    if (process.client) {
      const storedUser = localStorage.getItem('gymnote_user')
      const storedAuth = localStorage.getItem('gymnote_authenticated')
      const storedWelcome = localStorage.getItem('gymnote_seen_welcome')

      if (storedUser && storedAuth === 'true') {
        user.value = JSON.parse(storedUser)
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
    login,
    signup,
    logout,
    markWelcomeSeen,
    initAuth
  }
}
