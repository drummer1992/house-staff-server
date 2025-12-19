import fs from 'fs/promises'
import path from 'path'
import keyBy from 'lodash.keyby'
import omit from 'lodash.omit'
import { fileURLToPath } from 'url'

import products from './products.json' with { type: 'json' }
import { uuidV4 } from '../../utils/random.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const runSql = async (knex, relativePath) => {
  const filepath = path.resolve(__dirname, relativePath)

  const sql = (await fs.readFile(filepath)).toString()

  await knex.raw(sql)
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export const up = async function(knex) {
  console.log('Creating initial tables')

  await runSql(knex, './init-db.sql')
  await runSql(knex, './add-categories.sql')
  await runSql(knex, './add-collections.sql')

  const [categories, collections] = await Promise.all([
    knex.select('*').from('Categories'),
    knex.select('*').from('Collections'),
  ])

  const categoriesMap = keyBy(categories, 'name')
  const collectionsMap = keyBy(collections, 'name')

  const productsWithIds = products.map(p => ({
    ...p,
    id: uuidV4(),
  }))

  await knex.insert(productsWithIds.map(p => omit({
    ...p,
    releaseDate: new Date(p.releaseDate),
    categoryId : categoriesMap[p.category].id,
    imagesUrls : JSON.stringify(p.imagesUrls),
  }, ['category', 'collection']))).into('Products')

  await knex.insert(productsWithIds.map(p => ({
    productId    : p.id,
    stockQuantity: 100,
  }))).into('ProductsInventory')

  await knex.insert(productsWithIds.filter(p => p.collection).map(p => ({
    productId   : p.id,
    collectionId: collectionsMap[p.collection].id,
  }))).into('CollectionsProducts')

  console.log('Initial tables created')
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
export const down = async function(knex) {
  console.log('Dropping initial tables')

  const filepath = path.resolve(__dirname, './drop-db.sql')

  const sql = (await fs.readFile(filepath)).toString()

  await knex.raw(sql)

  console.log('Initial tables dropped')
}
