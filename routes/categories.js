import express from 'express'
import getCategories from '../services/categories/get-all.js'
import endpointHandler from '../config/endpoint-handler.js'

const categoriesRouter = express.Router()

categoriesRouter.get('/', endpointHandler(() => getCategories()))

export default categoriesRouter