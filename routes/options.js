import express from 'express'
import endpointHandler from '../config/endpoint-handler.js'
import deliveryMethods from '../constants/delivery-methods.js'
import paymentMethods from '../constants/payment-methods.js'
import countries from '../constants/countries.js'

const optionsRouter = express.Router()

optionsRouter.get('/', endpointHandler(() => ({
  deliveryMethods,
  paymentMethods,
  countries,
})))

export default optionsRouter