import assert from 'assert'
import knex from '../../../db/knex.js'
import { validationAssert } from '../../../errors/index.js'

const removeProduct = async (productId, user) => {
  assert(user, 'User must be provided')

  validationAssert(productId, 'Product ID must be provided')

  const { count: productExists } = await knex.client('Products').count()
    .where({ id: productId })
    .first()

  validationAssert(productExists, 'Such a product does not exist')

  const { count: wishItemExists } = await knex.client('UsersWishProducts').count()
    .where({ productId, userId: user.id })
    .first()

  validationAssert(wishItemExists, 'Product is not in the wishlist')

  await knex.client('UsersWishProducts').where({ productId, userId: user.id }).delete()
}

export default removeProduct