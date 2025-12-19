import dotenv from 'dotenv'

dotenv.config()

import('./assert-env-fulfilled.js')

import express from 'express'
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

const app = express()

app.use((req, res, next) => {
  asyncStorage.enterWith(new Map([['reqId', randomCode(4)]]))

  return next()
})

app.use(cors({
  origin     : process.env.FRONTEND_URL,
  credentials: true,
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(session({
  secret           : process.env.SESSION_SECRET,
  resave           : false,
  saveUninitialized: false,
  cookie           : {
    secure  : process.env.NODE_ENV === 'production',
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

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status   : 'ok',
    timestamp: new Date().toISOString(),
    service  : 'house-staff-server',
  })
})

app.use('/auth', authRoutes)
app.use('/products', productsRoutes)
app.use('/categories', categoriesRouter)
app.use('/collections', collectionsRouter)

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.use((err, req, res) => {
  logger.error('Error:', err)

  res.status(err.status).json({ error: err.message })
})

app.listen(process.env.PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${process.env.PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`)
})

export default app