import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class GoogleOAuthGuard extends AuthGuard('google') {
  // no session; bounce to /auth/failure when login fails
  getAuthenticateOptions() {
    return {
      session        : false,
      failureRedirect: '/auth/failure',
    }
  }
}
