import 'reflect-metadata'
import '../config/init-env.js'
import '../config/init-sito.js'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })

  app.useLogger(app.get(Logger))
  app.enableCors()

  await app.listen(Number(process.env.PORT))
}

bootstrap()
