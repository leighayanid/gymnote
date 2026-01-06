import { requireAuth } from '~/server/utils/auth'
import { logger } from '~/server/utils/logger'

export default defineEventHandler(async (event) => {
  try {
    const user = await requireAuth(event)

    return {
      user,
    }
  } catch (error: any) {
    logger.error({ error: error.message }, 'Get current user error')
    throw error
  }
})
