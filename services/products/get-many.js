import knex from '../../db/knex.js'
import keyBy from 'lodash.keyby'
import mapValues from 'lodash.mapvalues'

const getProducts = async () => {
  const [categories, products, collections, inventory, collectionsProducts] = await Promise.all([
    knex.client.select('*').from('Categories'),
    knex.client.select('*').from('Products'),
    knex.client.select('*').from('Collections'),
    knex.client.select('*').from('ProductsInventory'),
    knex.client.select('*').from('CollectionsProducts'),
  ])

  const collectionsMap = keyBy(collections, 'id')

  const collectionsByProduct = mapValues(
    keyBy(collectionsProducts, 'productId'),
    r => collectionsMap[r.collectionId],
  )

  const inventoryMap = keyBy(inventory, 'productId')

  const categoriesMap = keyBy(categories, 'id')

  return products.map(p => {
    const collection = collectionsByProduct[p.id]

    return {
      ...p,
      price         : Number(p.price),
      discount      : Number(p.discount),
      categoryName  : categoriesMap[p.categoryId].name,
      collectionId  : collection?.id || null,
      collectionName: collection?.name || null,
      stockQuantity : inventoryMap[p.id]?.stockQuantity || 0,
    }
  })
}

export default getProducts