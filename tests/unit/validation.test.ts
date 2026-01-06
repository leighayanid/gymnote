import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  signupSchema,
  createWorkoutSchema,
  updateWorkoutSchema,
} from '~/server/utils/validation'

describe('Validation Schemas', () => {
  describe('Login Schema', () => {
    it('should validate correct login data', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject invalid email', () => {
      const data = {
        email: 'invalid-email',
        password: 'Password123',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject short password', () => {
      const data = {
        email: 'test@example.com',
        password: 'short',
      }

      const result = loginSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('Signup Schema', () => {
    it('should validate correct signup data', () => {
      const data = {
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User',
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject password without uppercase', () => {
      const data = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject password without number', () => {
      const data = {
        email: 'test@example.com',
        password: 'PasswordABC',
        name: 'Test User',
      }

      const result = signupSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })

  describe('Create Workout Schema', () => {
    it('should validate correct workout data', () => {
      const data = {
        date: new Date().toISOString(),
        notes: 'Great workout!',
        exercises: [
          {
            name: 'Bench Press',
            sets: 3,
            reps: 10,
            weight: 135,
            notes: 'Felt strong',
          },
        ],
      }

      const result = createWorkoutSchema.safeParse(data)
      expect(result.success).toBe(true)
    })

    it('should reject workout without exercises', () => {
      const data = {
        date: new Date().toISOString(),
        notes: 'Great workout!',
        exercises: [],
      }

      const result = createWorkoutSchema.safeParse(data)
      expect(result.success).toBe(false)
    })

    it('should reject negative weight', () => {
      const data = {
        date: new Date().toISOString(),
        exercises: [
          {
            name: 'Bench Press',
            sets: 3,
            reps: 10,
            weight: -10,
          },
        ],
      }

      const result = createWorkoutSchema.safeParse(data)
      expect(result.success).toBe(false)
    })
  })
})
