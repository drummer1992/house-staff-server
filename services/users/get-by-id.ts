import knex from '../../db/knex.js'
import type { User } from '../../types/domain.js'

const getUserById = async (id: string): Promise<User | undefined> => {
  const [user] = await knex.client.select('*').from('Users')
    .where({ id })

  return user
}

export default getUserById
