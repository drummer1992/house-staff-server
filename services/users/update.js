import { object, string } from 'sito'
import assert from 'assert'
import knex from '../../db/knex.js'

const validationSchema = object({
  name      : string().notEmpty().max(255),
  email     : string().notEmpty().max(255),
  phone     : string().notEmpty().max(50),
  address   : string().notEmpty().max(255),
  postalCode: string().notEmpty().max(20),
  city      : string().notEmpty().max(100),
  country   : string().notEmpty().max(100),
}).notEmpty()

const updateUser = async (changes, user) => {
  assert(user, 'User must be provided')

  await validationSchema.assert(changes)

  await knex.client('Users').update(changes).where({ id: user.id })

  const [dbUser] = await knex.client('Users').select('*').where({ id: user.id })

  return dbUser
}

export default updateUser