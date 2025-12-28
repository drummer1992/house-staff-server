import dotenv from 'dotenv'

dotenv.config()

import('./config/assert-env-fulfilled.js')
import './config/init-sito.js'
import express from 'express'
import 'express-async-errors'
import cors from 'cors'
import session from 'express-session'
import passport from './config/passport.js'
import authRoutes from './routes/auth.js'
import productsRoutes from './routes/products.js'
import { DAY } from './utils/date.js'
import logger from './utils/logger.js'
import { asyncStorage } from './utils/async-storage.js'
import { randomCode } from './utils/random.js'
import categoriesRouter from './routes/categories.js'
import collectionsRouter from './routes/collections.js'
import { NotFoundError } from './errors/index.js'
import errorHandler from './config/error-handler.js'
import endpointHandler from './config/endpoint-handler.js'
import userRouter from './routes/user.js'
import optionsRouter from './routes/options.js'
import ordersRouter from './routes/orders.js'
import auth from './config/auth.js'

const app = express()

app.use((req, res, next) => {
  asyncStorage.enterWith(new Map([['reqId', randomCode(4)]]))

  return next()
})

app.use(cors())

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret           : process.env.SESSION_SECRET,
  resave           : false,
  saveUninitialized: false,
  cookie           : {
    httpOnly: true,
    maxAge  : DAY,
  },
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  logger.info(`[${new Date().toISOString()}] - ${req.method} ${req.path}`)

  next()
})

app.use(auth)

app.get('/health', endpointHandler(() => ({
  status   : 'ok',
  timestamp: new Date().toISOString(),
})))

app.use('/auth', authRoutes)
app.use('/user', userRouter)
app.use('/orders', ordersRouter)
app.use('/products', productsRoutes)
app.use('/categories', categoriesRouter)
app.use('/collections', collectionsRouter)
app.use('/options', optionsRouter)

app.use(() => {
  throw new NotFoundError('Route not found')
})

app.use(errorHandler)

app.listen(process.env.PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${process.env.PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`)
})

export default app