import knex from '../../../db/knex.js'
import assert from 'assert'

const getWishlist = async user => {
  assert(user, 'User must be provided')

  const list = await knex.client('UsersWishProducts')
    .select('*')
    .where({ userId: user.id })

  if (list.length) {
    const productIds = list.map(item => item.productId)

    return knex.client('Products')
      .select('*')
      .whereIn('id', productIds)
  }

  return []
}

export default getWishlist