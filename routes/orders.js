import express from 'express'
import endpointHandler from '../config/endpoint-handler.js'
import createOrder from '../services/orders/create.js'
import getOrders from '../services/orders/get-many.js'
import { assertUserAuthenticated, getCurrentUser } from '../config/auth.js'

const ordersRouter = express.Router()

ordersRouter.post('/', endpointHandler(async req => {
  assertUserAuthenticated()

  const user = getCurrentUser()

  const orderId = await createOrder(req.body, user)

  const [order] = await getOrders([orderId], user)

  return order
}))

export default ordersRouter