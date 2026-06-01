import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  // Mirror the legacy passport.authenticate('google', { session, failureRedirect }) options.
  getAuthenticateOptions() {
    return {
      session: false,
      failureRedirect: '/auth/failure',
    }
  }
}
