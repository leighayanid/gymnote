import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/auth')
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })

  test('should show validation errors for invalid email', async ({ page }) => {
    await page.goto('/auth')
    await page.getByLabel(/email/i).fill('invalid-email')
    await page.getByLabel(/password/i).fill('password123')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Should show validation error
    await expect(page.getByText(/invalid email/i)).toBeVisible()
  })

  test('should navigate between login and signup', async ({ page }) => {
    await page.goto('/auth')

    // Click signup link
    await page.getByRole('link', { name: /sign up/i }).click()
    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible()

    // Click login link
    await page.getByRole('link', { name: /log in/i }).click()
    await expect(page.getByRole('heading', { name: /login/i })).toBeVisible()
  })
})

test.describe('Protected Routes', () => {
  test('should redirect to auth when not logged in', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('should redirect to auth for history page', async ({ page }) => {
    await page.goto('/history')
    await expect(page).toHaveURL(/\/auth/)
  })

  test('should redirect to auth for settings page', async ({ page }) => {
    await page.goto('/settings')
    await expect(page).toHaveURL(/\/auth/)
  })
})
