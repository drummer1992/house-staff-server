import type { Request, Response, NextFunction } from 'express'
import passport from './passport.js'
import { asyncStorage } from '../utils/async-storage.js'
import { NotAuthenticatedError } from '../errors/index.js'
import type { User } from '../types/domain.js'

const auth = (req: Request, res: Response, next: NextFunction): void => {
  passport.authenticate('jwt', { session: false }, (err: unknown, user: User | false) => {
    if (err) {
      return next(err)
    }

    if (user) {
      const store = asyncStorage.getStore()

      store?.set('user', user)
    }

    next()
  })(req, res, next)
}

export const getCurrentUser = (): User | undefined => {
  const store = asyncStorage.getStore()

  if (store) {
    return store.get('user') as User | undefined
  }

  return undefined
}

export const assertUserAuthenticated = (): void => {
  const user = getCurrentUser()

  if (!user) {
    throw new NotAuthenticatedError()
  }
}

export default auth
