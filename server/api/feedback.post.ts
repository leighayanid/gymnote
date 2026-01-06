import { feedbackSchema } from '~/server/utils/validation'
import { getAuthUser } from '~/server/utils/auth'
import { logger } from '~/server/utils/logger'
import { rateLimit, rateLimitPresets } from '~/server/utils/rateLimit'

export default defineEventHandler(async (event) => {
  // Rate limiting
  await rateLimit(rateLimitPresets.strict)(event)

  try {
    // Get user if authenticated (optional for feedback)
    const user = await getAuthUser(event)

    // Parse and validate request body
    const body = await readBody(event)
    const validatedData = feedbackSchema.parse(body)

    // In production, you would save this to a database or send via email
    // For now, we'll just log it
    logger.info(
      {
        userId: user?.id,
        userEmail: user?.email || validatedData.email,
        type: validatedData.type,
        subject: validatedData.subject,
      },
      'Feedback received'
    )

    // Log the full feedback message
    logger.debug(
      {
        type: validatedData.type,
        subject: validatedData.subject,
        message: validatedData.message,
        email: validatedData.email,
      },
      'Full feedback details'
    )

    return {
      success: true,
      message: 'Thank you for your feedback! We appreciate your input.',
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Feedback submission failed')

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
      message: 'Failed to submit feedback',
    })
  }
})
