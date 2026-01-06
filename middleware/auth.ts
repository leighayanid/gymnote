export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated, initAuth } = useAuth()

  // Initialize auth state from localStorage
  if (process.client) {
    initAuth()
  }

  // List of public routes that don't require authentication
  const publicRoutes = ['/']

  // Check if the current route is public
  const isPublicRoute = publicRoutes.includes(to.path)

  // If user is not authenticated and trying to access a protected route
  if (!isAuthenticated.value && !isPublicRoute) {
    return navigateTo('/')
  }

  // If user is authenticated and at root, redirect to dashboard
  if (isAuthenticated.value && to.path === '/') {
    return navigateTo('/dashboard')
  }
})
