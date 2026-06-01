import { Module } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { UsersModule } from '../users/users.module.js'
import { JwtStrategy } from './strategies/jwt.strategy.js'
import { GoogleStrategy } from './strategies/google.strategy.js'
import { AuthService } from './auth.service.js'
import { AuthController } from './auth.controller.js'

@Module({
  imports    : [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      inject    : [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret     : config.getOrThrow<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers  : [JwtStrategy, GoogleStrategy, AuthService],
  exports    : [AuthService],
})
export class AuthModule {
}
