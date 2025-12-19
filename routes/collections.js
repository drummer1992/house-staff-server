import express from 'express'
import getCollections from '../services/collections/get-all.js'

const collectionsRouter = express.Router()

collectionsRouter.get('/', async (req, res) => {
  res.json(await getCollections())
})

export default collectionsRouter