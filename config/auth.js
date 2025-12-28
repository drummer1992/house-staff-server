import passport from './passport.js'
import { asyncStorage } from '../utils/async-storage.js'
import { NotAuthenticatedError } from '../errors/index.js'

const auth = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      return next(err)
    }

    if (user) {
      const store = asyncStorage.getStore()

      store.set('user', user)
    }

    next()
  })(req, res, next)
}

export const getCurrentUser = () => {
  const store = asyncStorage.getStore()

  if (store) {
    return store.get('user')
  }
}

export const assertUserAuthenticated = () => {
  const user = getCurrentUser()

  if (!user) {
    throw new NotAuthenticatedError()
  }
}

export default auth