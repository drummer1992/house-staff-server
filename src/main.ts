import 'reflect-metadata'
import { NestFactory, Reflector } from '@nestjs/core'
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { Logger } from 'nestjs-pino'
import { AppModule } from './app.module.js'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bufferLogs: true })

  app.useLogger(app.get(Logger))
  app.enableCors()
  app.enableShutdownHooks()

  app.useGlobalPipes(new ValidationPipe({
    whitelist           : true,
    forbidNonWhitelisted: true,
    transform           : true,
  }))

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const config = app.get(ConfigService)

  await app.listen(Number(config.getOrThrow('PORT')))
}

bootstrap()
