import express from 'express'
import getCategories from '../services/categories/get-all.js'

const categoriesRouter = express.Router()

categoriesRouter.get('/', async (req, res) => {
  res.json(await getCategories())
})

export default categoriesRouter