import assert from 'assert'
import knex from '../../../db/knex.js'
import { validationAssert } from '../../../errors/index.js'
import { uuidV4 } from '../../../utils/random.js'

const addProduct = async (productId, user) => {
  assert(user, 'User must be provided')

  validationAssert(productId, 'Product ID must be provided')

  const { count: productExists } = await knex.client('Products').count()
    .where({ id: productId })
    .first()

  validationAssert(productExists, 'Such a product does not exist')

  const { wishItemExists } = await knex.client('UsersWishProducts').count()
    .where({ productId: productId, userId: user.id })
    .first()

  validationAssert(!wishItemExists, 'Product is already in wishlist')

  await knex.client('UsersWishProducts').insert({ id: uuidV4(), productId: productId, userId: user.id })
}

export default addProduct