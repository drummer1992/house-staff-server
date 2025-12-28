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

  const presentationsData = {
    ['Living Room Collection']: {
      imageUrl: 'https://i.ibb.co/pjQnvHVD/living-room.webp',
      hotspots: [
        { top: '60%', left: '50%', productId: '938ba3c3-29ac-425f-862a-1cd8d37eee21' },
        { top: '80%', left: '15%', productId: '015be44d-e01f-42f3-a102-3421df3685fe' },
        { top: '77%', left: '50%', productId: '8b1a569d-906d-425b-8d82-e0003dc5fa9c' },
      ],
    },

    ['Dining Room Collection']: {
      imageUrl: 'https://i.ibb.co/9k92dK8X/dining-room.webp',
      hotspots: [
        { top: '70%', left: '35%', productId: '30fa737c-1694-463d-8150-fc9b114f19b8' },
        { top: '73%', left: '20%', productId: '912a7a36-8ffc-4234-85eb-d3cd832472df' },
      ],
    },

    ['Bedroom Collection']: {
      imageUrl     : 'https://i.ibb.co/KpS8nvk2/bedroom-collection.webp',
      hotspots: [
        { top: '38%', left: '42%', productId: 'e61bed4a-ae36-431f-8d2a-ba56cb239e49' },
        { top: '62%', left: '15%', productId: '159a0f49-512a-4fb5-a4b6-509e729c711f' },
        { top: '46%', left: '65%', productId: '683b8cce-aa04-4f08-b37a-63a53212f37f' },
      ],
    },

    ['Home Collection']: {
      imageUrl     : 'https://i.ibb.co/bMvXPJLh/home-collection.webp',
      hotspots: [
        { top: '64%', left: '42%', productId: 'ed05be3e-5d2b-4256-a30f-6a06178d2a9a' },
        { top: '89%', left: '20%', productId: '2a0cb6bc-4bd3-4f4e-82d1-ddeb40b65643' },
        { top: '87%', left: '53%', productId: '64e90c93-12b2-4994-9124-f2eb6594353f' },
      ],
    },
  }

  for (const collectionName in presentationsData) {
    const presentation = presentationsData[collectionName]

    await knex.update({ presentation: JSON.stringify(presentation) })
      .where({ name: collectionName })
      .from('Collections')
  }

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
