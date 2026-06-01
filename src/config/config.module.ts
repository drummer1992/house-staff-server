import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { envSchema } from './env.schema.js'

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal         : true,
      validationSchema : envSchema,
      validationOptions: { allowUnknown: true, abortEarly: false },
    }),
  ],
})
export class AppConfigModule {
}
