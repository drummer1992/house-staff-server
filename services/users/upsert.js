import compact from 'lodash.compact'
import knex from '../../db/knex.js'

const upsertUser = async profile => {
  const user = {
    id   : profile.id,
    email: profile.emails[0].value,
    name : compact([profile.displayName, profile.name.givenName, profile.name.familyName]).join(' '),
  }

  const { count } = await knex.client.count()
    .from('Users').where({ id: profile.id })
    .first()

  if (!Number(count)) {
    await knex.client.insert(user).into('Users')
  }

  return user
}

export default upsertUser