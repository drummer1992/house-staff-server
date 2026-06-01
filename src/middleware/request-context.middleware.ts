import type { Request, Response, NextFunction } from 'express'
import { asyncStorage } from '../../utils/async-storage.js'
import { randomCode } from '../../utils/random.js'

// Gives each request its own async-storage scope with a short id for logging.
export const requestContext = (req: Request, res: Response, next: NextFunction): void => {
  asyncStorage.run(new Map([['reqId', randomCode(4)]]), () => next())
}
