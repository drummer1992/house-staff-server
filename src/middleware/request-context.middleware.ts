import type { Request, Response, NextFunction } from 'express'
import { asyncStorage } from '../../utils/async-storage.js'
import { randomCode } from '../../utils/random.js'

/**
 * Establishes the per-request AsyncLocalStorage store (with a request id) for
 * the whole request lifecycle. Applied as a global middleware on the NestJS
 * Express instance, so the context is active for both future NestJS routes and
 * the mounted legacy app. This replaces the legacy app's own reqId middleware.
 */
export const requestContext = (req: Request, res: Response, next: NextFunction): void => {
  asyncStorage.run(new Map([['reqId', randomCode(4)]]), () => next())
}
