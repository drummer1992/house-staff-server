import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UsersService } from '../../users/users.service.js'
import type { User } from '../../../types/domain.js'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private readonly users: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey   : config.getOrThrow<string>('JWT_SECRET'),
    })
  }

  async validate(payload: { id: string }): Promise<User | undefined> {
    return this.users.getById(payload.id)
  }
}
