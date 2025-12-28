import express from 'express'
import endpointHandler from '../config/endpoint-handler.js'
import { assertUserAuthenticated, getCurrentUser } from '../config/auth.js'
import getWishlist from '../services/users/wishlist/get.js'
import addProduct from '../services/users/wishlist/add-product.js'
import removeProduct from '../services/users/wishlist/remove-product.js'
import updateUser from '../services/users/update.js'

const userRouter = express.Router()

userRouter.get('/', endpointHandler(() => {
  assertUserAuthenticated()

  return getCurrentUser()
}))

userRouter.put('/', endpointHandler(async req => {
  assertUserAuthenticated()

  return updateUser(req.body, getCurrentUser())
}))

userRouter.get('/wishlist', endpointHandler(() => {
  assertUserAuthenticated()

  return getWishlist(getCurrentUser())
}))

userRouter.post('/wishlist/add-product', endpointHandler(req => {
  assertUserAuthenticated()

  return addProduct(req.body.productId, getCurrentUser())
}))

userRouter.delete('/wishlist/remove-product', endpointHandler(req => {
  assertUserAuthenticated()

  return removeProduct(req.body.productId, getCurrentUser())
}))

export default userRouter