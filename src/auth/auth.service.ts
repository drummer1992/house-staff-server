import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { User } from '../../types/domain.js'

/**
 * Issues JWTs. Mirrors the legacy `jwt.sign(user, secret, { expiresIn: '1d' })`
 * — the secret and expiry come from the JwtModule configuration. Ready for the
 * Google callback route when it is migrated off the legacy layer (Phase 4h).
 */
@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {}

  signToken(user: User): string {
    return this.jwt.sign({ ...user })
  }
}
