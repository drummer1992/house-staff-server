import express from 'express'
import endpointHandler from '../config/endpoint-handler.js'
import { assertUserAuthenticated, getCurrentUser } from '../config/auth.js'

const userRouter = express.Router()

userRouter.get('/', endpointHandler(() => {
  assertUserAuthenticated()

  return getCurrentUser()
}))

export default userRouter