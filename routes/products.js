import express from 'express'
import getProducts from '../services/products/get-many.js'

const productsRouter = express.Router()

productsRouter.get('/', async (req, res) => {
  res.json(await getProducts())
})

export default productsRouter