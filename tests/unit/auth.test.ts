import { describe, it, expect } from 'vitest'
import { hashPassword, verifyPassword, verifyToken, generateAccessToken } from '~/server/utils/auth'

describe('Authentication Utilities', () => {
  describe('Password Hashing', () => {
    it('should hash a password', async () => {
      const password = 'TestPassword123'
      const hash = await hashPassword(password)

      expect(hash).toBeDefined()
      expect(hash).not.toBe(password)
      expect(hash.length).toBeGreaterThan(0)
    })

    it('should verify correct password', async () => {
      const password = 'TestPassword123'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(password, hash)

      expect(isValid).toBe(true)
    })

    it('should reject incorrect password', async () => {
      const password = 'TestPassword123'
      const wrongPassword = 'WrongPassword456'
      const hash = await hashPassword(password)
      const isValid = await verifyPassword(wrongPassword, hash)

      expect(isValid).toBe(false)
    })
  })

  describe('JWT Token', () => {
    it('should generate access token', () => {
      const userId = 'test-user-id'
      const email = 'test@example.com'
      const token = generateAccessToken(userId, email)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should verify valid token', () => {
      const userId = 'test-user-id'
      const email = 'test@example.com'
      const token = generateAccessToken(userId, email)
      const payload = verifyToken(token)

      expect(payload).toBeDefined()
      expect(payload?.userId).toBe(userId)
      expect(payload?.email).toBe(email)
      expect(payload?.type).toBe('access')
    })

    it('should reject invalid token', () => {
      const invalidToken = 'invalid.token.here'
      const payload = verifyToken(invalidToken)

      expect(payload).toBeNull()
    })
  })
})
