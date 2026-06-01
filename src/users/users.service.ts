import { Injectable } from '@nestjs/common'
import compact from 'lodash.compact'
import type { Profile } from 'passport-google-oauth20'
import { UsersRepository } from './users.repository.js'
import type { User } from '../../types/domain.js'

@Injectable()
export class UsersService {
  constructor(private readonly users: UsersRepository) {
  }

  getById(id: string): Promise<User | undefined> {
    return this.users.findById(id)
  }

  async upsertFromProfile(profile: Profile): Promise<User> {
    const user: User = {
      id   : profile.id,
      email: profile.emails?.[0]?.value ?? '',
      name : compact([profile.displayName, profile.name?.givenName, profile.name?.familyName]).join(' '),
    }

    const exists = await this.users.countById(profile.id)

    if (!exists) {
      await this.users.insert(user)
    }

    return user
  }

  async update(changes: Partial<User>, user: User): Promise<User | undefined> {
    await this.users.update(user.id, changes)

    return this.users.findById(user.id)
  }
}
