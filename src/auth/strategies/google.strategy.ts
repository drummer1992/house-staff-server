import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Profile, Strategy } from 'passport-google-oauth20'
import { UsersService } from '../../users/users.service.js'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(config: ConfigService, private readonly users: UsersService) {
    super({
      clientID    : config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL : config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope       : ['profile', 'email'],
    })
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile) {
    return this.users.upsertFromProfile(profile)
  }
}
