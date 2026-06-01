import { Injectable } from '@nestjs/common'
import logger from '../../utils/logger.js'

/**
 * Injectable wrapper around the existing request-scoped logger
 * (`utils/logger.ts`). It still reads the request id from AsyncLocalStorage,
 * so logs stay correlated. Future NestJS providers inject this instead of
 * importing the logger module directly.
 */
@Injectable()
export class AppLogger {
  info(...args: unknown[]): void {
    logger.info(...args)
  }

  error(...args: unknown[]): void {
    logger.error(...args)
  }
}
