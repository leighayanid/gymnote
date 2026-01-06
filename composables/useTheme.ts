export const useTheme = () => {
  const colorMode = useState<'light' | 'dark'>('colorMode', () => 'light')

  const setTheme = (theme: 'light' | 'dark') => {
    colorMode.value = theme
    if (process.client) {
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(theme)
      localStorage.setItem('theme', theme)
    }
  }

  const toggleTheme = () => {
    setTheme(colorMode.value === 'light' ? 'dark' : 'light')
  }

  const initTheme = () => {
    if (process.client) {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      const theme = savedTheme || (prefersDark ? 'dark' : 'light')
      setTheme(theme)
    }
  }

  return {
    colorMode: readonly(colorMode),
    setTheme,
    toggleTheme,
    initTheme
  }
}
