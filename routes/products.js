import express from 'express'
import getProducts from '../services/products/get-many.js'
import endpointHandler from '../config/endpoint-handler.js'

const productsRouter = express.Router()

productsRouter.get('/', endpointHandler(() => getProducts()))

export default productsRouter