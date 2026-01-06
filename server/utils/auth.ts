import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import { prisma } from './prisma'

const SALT_ROUNDS = 12
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'
const REFRESH_TOKEN_EXPIRES_IN = '30d'

export interface JWTPayload {
  userId: string
  email: string
  type: 'access' | 'refresh'
}

export interface AuthUser {
  id: string
  email: string
  name: string
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate JWT access token
 */
export function generateAccessToken(userId: string, email: string): string {
  const payload: JWTPayload = { userId, email, type: 'access' }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
}

/**
 * Generate JWT refresh token
 */
export function generateRefreshToken(userId: string, email: string): string {
  const payload: JWTPayload = { userId, email, type: 'refresh' }
  return jwt.sign(payload, JWT_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRES_IN })
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Get authenticated user from request
 */
export async function getAuthUser(event: H3Event): Promise<AuthUser | null> {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  const payload = verifyToken(token)

  if (!payload || payload.type !== 'access') {
    return null
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, name: true },
    })

    return user
  } catch (error) {
    return null
  }
}

/**
 * Require authentication middleware
 * Throws 401 if user is not authenticated
 */
export async function requireAuth(event: H3Event): Promise<AuthUser> {
  const user = await getAuthUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Authentication required',
    })
  }

  return user
}

/**
 * Create or update a session token
 */
export async function createSession(userId: string, token: string, expiresAt: Date) {
  return prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })
}

/**
 * Delete a session token
 */
export async function deleteSession(token: string) {
  return prisma.session.deleteMany({
    where: { token },
  })
}

/**
 * Clean up expired sessions
 */
export async function cleanupExpiredSessions() {
  return prisma.session.deleteMany({
    where: {
      expiresAt: {
        lt: new Date(),
      },
    },
  })
}

/**
 * Update session last active time
 */
export async function updateSessionActivity(token: string) {
  return prisma.session.updateMany({
    where: { token },
    data: { lastActiveAt: new Date() },
  })
}
