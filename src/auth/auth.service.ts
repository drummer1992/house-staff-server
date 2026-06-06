import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { User } from '../types/domain.js'

@Injectable()
export class AuthService {
  constructor(private readonly jwt: JwtService) {
  }

  signToken(user: User): string {
    return this.jwt.sign({ ...user })
  }
}
