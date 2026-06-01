import knex from '../../../db/knex.js'
import assert from 'assert'
import type { User } from '../../../types/domain.js'

const getWishlist = async (user?: User) => {
  assert(user, 'User must be provided')

  const list = await knex.client('UsersWishProducts')
    .select('*')
    .where({ userId: user.id })

  if (list.length) {
    const productIds = list.map((item: { productId: string }) => item.productId)

    return knex.client('Products')
      .select('*')
      .whereIn('id', productIds)
  }

  return []
}

export default getWishlist
