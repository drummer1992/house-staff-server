import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { envValidationSchema } from './env.validation.js'

/**
 * Wraps @nestjs/config and registers it globally so any module can inject
 * `ConfigService`. Validates process.env at boot (replicating the startup
 * crash on missing vars). Replaces manual dotenv + assert-env-fulfilled going
 * forward; the legacy env loading stays in place until the legacy layer is gone.
 */
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: envValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: false,
      },
    }),
  ],
})
export class AppConfigModule {}
