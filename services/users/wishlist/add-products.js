import assert from 'assert'
import knex from '../../../db/knex.js'
import { validationAssert } from '../../../errors/index.js'
import { uuidV4 } from '../../../utils/random.js'
import { array, object, string } from 'sito'

const validationSchema = object({
  productsIds: array(string().notEmpty().required()).notEmpty().required(),
})

const addProducts = async (productsIds, user) => {
  assert(user, 'User must be provided')

  await validationSchema.assert({ productsIds })

  const products = await knex.client('Products')
    .select(['id'])
    .whereIn('id', productsIds)

  const notFoundProductsIds = productsIds.filter(id => !products.find(p => p.id === id))

  validationAssert(!notFoundProductsIds.length, 'Some products were not found: ' + notFoundProductsIds.join(', '))

  const alreadyWishlisted = await knex.client('UsersWishProducts')
    .select(['productId'])
    .where({ userId: user.id })
    .whereIn('productId', productsIds)

  validationAssert(!alreadyWishlisted.length,
    'Some products are already in the wishlist: ' + alreadyWishlisted.map(p => p.productId).join(', '))

  await knex.client('UsersWishProducts').insert(productsIds.map(productId => ({
    id    : uuidV4(),
    userId: user.id,
    productId,
  })))
}

export default addProducts