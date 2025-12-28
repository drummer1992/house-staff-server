import express from 'express'
import endpointHandler from '../config/endpoint-handler.js'
import deliveryMethods from '../constants/delivery-methods.js'
import paymentMethods from '../constants/payment-methods.js'

const optionsRouter = express.Router()

optionsRouter.get('/', endpointHandler(() => ({
  deliveryMethods,
  paymentMethods,
})))

export default optionsRouter