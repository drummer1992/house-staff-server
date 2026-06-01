import 'reflect-metadata'
import '../config/init-env.js'
import '../config/init-sito.js'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { AppModule } from './app.module.js'
import { requestContext } from './middleware/request-context.middleware.js'
import { LoggingInterceptor } from './logger/logger.interceptor.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)

  app.enableCors()

  // request id per request, used by the logger
  app.use(requestContext)

  app.useGlobalInterceptors(
    new LoggingInterceptor(),
  )

  await app.listen(Number(process.env.PORT))
}

bootstrap()
