import { Injectable } from '@nestjs/common'
import type { Profile } from 'passport-google-oauth20'
import getUserById from '../../services/users/get-by-id.js'
import upsertUser from '../../services/users/upsert.js'
import updateUser from '../../services/users/update.js'
import type { User } from '../../types/domain.js'

/**
 * Thin wrapper around the existing user services. Delegates for now so there is
 * a single implementation; the Users domain absorbs this logic when it is
 * migrated in Phase 4.
 */
@Injectable()
export class UsersService {
  getById(id: string): Promise<User | undefined> {
    return getUserById(id)
  }

  upsertFromProfile(profile: Profile): Promise<User> {
    return upsertUser(profile)
  }

  update(changes: Partial<User>, user: User): Promise<User> {
    return updateUser(changes, user)
  }
}
