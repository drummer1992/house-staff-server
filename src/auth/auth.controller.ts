import { Controller, Get, Res, UseGuards } from '@nestjs/common'
import type { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { GoogleOAuthGuard } from './guards/google-oauth.guard.js'
import { User } from './decorators/user.decorator.js'
import { AuthService } from './auth.service.js'
import type { User as DomainUser } from '../types/domain.js'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly config: ConfigService,
  ) {
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  googleAuth() {
    // the guard kicks off the Google redirect, nothing to do here
  }

  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  googleCallback(@User() user: DomainUser, @Res() res: Response) {
    const token = this.authService.signToken(user)

    res.redirect(`${this.config.getOrThrow<string>('FRONTEND_URL')}/auth/google-callback?token=${token}`)
  }

  @Get('failure')
  failure(@Res() res: Response) {
    res.redirect(`${this.config.getOrThrow<string>('FRONTEND_URL')}/auth?error=authentication_failed`)
  }
}
