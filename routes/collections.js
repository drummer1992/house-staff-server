import express from 'express'
import getCollections from '../services/collections/get-all.js'
import endpointHandler from '../config/endpoint-handler.js'

const collectionsRouter = express.Router()

collectionsRouter.get('/', endpointHandler(() => getCollections()))

export default collectionsRouter