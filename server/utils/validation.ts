import { z } from 'zod'

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
})

export const refreshTokenSchema = z.object({
  token: z.string().min(1, 'Token is required'),
})

// Workout Schemas
export const createWorkoutSchema = z.object({
  date: z.string().datetime().or(z.date()),
  notes: z.string().max(1000).optional(),
  status: z.enum(['in_progress', 'completed']).default('in_progress'),
  exercises: z.array(
    z.object({
      name: z.string().min(1, 'Exercise name is required').max(200),
      sets: z.number().int().min(1).max(100),
      reps: z.number().int().min(1).max(1000),
      weight: z.number().min(0).max(10000).optional(),
      notes: z.string().max(500).optional(),
    })
  ).min(1, 'At least one exercise is required'),
})

export const updateWorkoutSchema = z.object({
  date: z.string().datetime().or(z.date()).optional(),
  notes: z.string().max(1000).optional().nullable(),
  status: z.enum(['in_progress', 'completed']).optional(),
  exercises: z.array(
    z.object({
      name: z.string().min(1).max(200),
      sets: z.number().int().min(1).max(100),
      reps: z.number().int().min(1).max(1000),
      weight: z.number().min(0).max(10000).optional(),
      notes: z.string().max(500).optional(),
    })
  ).optional(),
})

export const workoutIdSchema = z.object({
  id: z.string().uuid('Invalid workout ID'),
})

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['date', 'createdAt']).default('date'),
  order: z.enum(['asc', 'desc']).default('desc'),
})

// Export/Import Schemas
export const exportFormatSchema = z.enum(['json', 'csv'])

// User Settings Schema
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(8),
  newPassword: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
})

// Feedback Schema
export const feedbackSchema = z.object({
  type: z.enum(['bug', 'feature', 'general']),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(200),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000),
  email: z.string().email().optional(),
})

// Type exports
export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>
export type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>
export type PaginationInput = z.infer<typeof paginationSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type FeedbackInput = z.infer<typeof feedbackSchema>
