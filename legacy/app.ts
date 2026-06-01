import '../config/init-sito.js'
import express, { type Express } from 'express'
import 'express-async-errors'
import cors from 'cors'
import session from 'express-session'
import passport from '../config/passport.js'
import { DAY } from '../utils/date.js'
import logger from '../utils/logger.js'
import errorHandler from '../config/error-handler.js'
import auth from '../config/auth.js'

export const createLegacyApp = (): Express => {
  const app = express()

  // Request context (reqId) is set by the NestJS-level requestContext middleware.

  app.use(cors())

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))

  app.use(session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: DAY,
    },
  }))

  app.use(passport.initialize())
  app.use(passport.session())

  app.use((req, res, next) => {
    logger.info(`[${new Date().toISOString()}] - ${req.method} ${req.path}`)

    next()
  })

  app.use(auth)

  // All routes have been migrated to NestJS (Phase 4 complete). This app now
  // only carries shared middleware; every request falls through to NestJS,
  // which owns the terminal 404. The whole legacy layer is removed in Phase 5.
  app.use(errorHandler)

  return app
}
