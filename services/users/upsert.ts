import compact from 'lodash.compact'
import knex from '../../db/knex.js'
import type { Profile } from 'passport-google-oauth20'
import type { User } from '../../types/domain.js'

const upsertUser = async (profile: Profile): Promise<User> => {
  const user: User = {
    id: profile.id,
    email: profile.emails?.[0]?.value ?? '',
    name: compact([profile.displayName, profile.name?.givenName, profile.name?.familyName]).join(' '),
  }

  const result = await knex.client.count()
    .from('Users').where({ id: profile.id })
    .first()

  const count = result?.count

  if (!Number(count)) {
    await knex.client.insert(user).into('Users')
  }

  return user
}

export default upsertUser
