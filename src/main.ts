import 'reflect-metadata'
import '../config/init-env.js'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module.js'
import { createLegacyApp } from '../legacy/app.js'
import { requestContext } from './middleware/request-context.middleware.js'
import logger from '../utils/logger.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // Establish the request-scoped AsyncLocalStorage context (request id) first,
  // so it is active for both the legacy app and NestJS routes.
  app.use(requestContext)

  // The legacy app runs first and handles the routes it still owns; for routes
  // it no longer defines it calls next(), falling through to the NestJS routes
  // (registered by app.listen()). NestJS owns the terminal 404 for everything
  // unmatched, so the legacy app must NOT register its own catch-all 404.
  app.use(createLegacyApp())

  await app.listen(Number(process.env.PORT))

  logger.info(`🚀 NestJS server running on http://localhost:${process.env.PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`)
}

bootstrap()
