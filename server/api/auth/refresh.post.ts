import { refreshTokenSchema } from '~/server/utils/validation'
import { verifyToken, generateAccessToken, updateSessionActivity } from '~/server/utils/auth'
import { prisma } from '~/server/utils/prisma'
import { logger } from '~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(rateLimitPresets.moderate)(event)

  try {
    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = refreshTokenSchema.parse(body)

    // Verify token
    const payload = verifyToken(validatedData.token)

    if (!payload || payload.type !== 'refresh') {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Invalid refresh token',
      })
    }

    // Check if session exists and is valid
    const session = await prisma.session.findUnique({
      where: { token: validatedData.token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
        message: 'Session expired or invalid',
      })
    }

    // Generate new access token
    const accessToken = generateAccessToken(session.user.id, session.user.email)

    // Update session activity
    await updateSessionActivity(validatedData.token)

    logger.debug({ userId: session.user.id }, 'Access token refreshed')

    return {
      accessToken,
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Token refresh error')

    if (error.statusCode) {
      throw error
    }

    // Zod validation errors
    if (error.name === 'ZodError') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Validation failed',
        data: error.errors,
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: 'An error occurred during token refresh',
    })
  }
})
