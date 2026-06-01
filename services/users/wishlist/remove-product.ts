import assert from 'assert'
import knex from '../../../db/knex.js'
import { validationAssert } from '../../../errors/index.js'
import type { User } from '../../../types/domain.js'

const removeProduct = async (productId: string, user?: User): Promise<void> => {
  assert(user, 'User must be provided')

  validationAssert(productId, 'Product ID must be provided')

  const productResult = await knex.client('Products').count()
    .where({ id: productId })
    .first()

  validationAssert(productResult?.count, 'Such a product does not exist')

  const wishResult = await knex.client('UsersWishProducts').count()
    .where({ productId, userId: user.id })
    .first()

  validationAssert(wishResult?.count, 'Product is not in the wishlist')

  await knex.client('UsersWishProducts').where({ productId, userId: user.id }).delete()
}

export default removeProduct
