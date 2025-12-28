import knex from '../../db/knex.js'

const getUserById = async id => {
  const [user] = await knex.client.select('*').from('Users')
    .where({ id })

  return user
}

export default getUserById