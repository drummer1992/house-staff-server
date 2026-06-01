import 'reflect-metadata'
import '../config/init-env.js'
import '../config/init-sito.js'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module.js'
import { requestContext } from './middleware/request-context.middleware.js'
import logger from '../utils/logger.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  // CORS — previously provided by the legacy Express app's cors() middleware.
  app.enableCors()

  // Establish the request-scoped AsyncLocalStorage context (request id) for
  // request-scoped logging (logger + Knex query logs read it).
  app.use(requestContext)

  await app.listen(Number(process.env.PORT))

  logger.info(`🚀 NestJS server running on http://localhost:${process.env.PORT}`)
  logger.info(`📝 Environment: ${process.env.NODE_ENV}`)
}

bootstrap()
