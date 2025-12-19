import { HOUR } from '../utils/date.js'
import _knex from 'knex'
import assert from 'assert'
import logger from '../utils/logger.js'
import * as timing from '../utils/timing.js'
import { randomCode } from '../utils/random.js'

const logQuery = queryData => {
  queryData.options = queryData.options || {}
  queryData.bindings = queryData.bindings || []

  const bindings = [...queryData.bindings]

  const sql = queryData.sql.replace(/\?/g, () => {
    const value = bindings.shift()

    return typeof value === 'string' ? `'${value}'` : value
  })

  queryData.options.timing = timing.init()
  queryData.options.id = randomCode(4)

  logger.info(`${queryData.options.id} > SQL: ${sql.replace(/[\s\n]+/g, ' ')}`)
}

const logQueryResponse = (response, queryData) => {
  const ms = timing.getDiff(queryData.options.timing)

  logger.info(`${queryData.options.id} < (${queryData.response.rowCount}): ${ms.toFixed(3)}ms`)
}

const logQueryError = (err, queryData) => {
  const ms = timing.getDiff(queryData.options.timing)

  logger.error(`${queryData.options.id} < (err): ${ms.toFixed(3)}ms`)
}

const escape = value => {
  if (typeof value === 'string') {
    return value.replace(/'/g, '\'\'')
  }

  return value
}

// noinspection JSValidateJSDoc
/**
 * @type {(() => Knex)|Knex}
 */
let client

const knex = {
  escape,

  get client() {
    if (!client) {
      knex.init()
    }

    return client
  },

  raw(...args) {
    return this.client.raw.apply(this.client, args)
  },

  async init() {
    assert(!client, 'Knex client is already initialized')

    client = _knex({
      client    : 'pg',
      connection: {
        host    : process.env.DB_HOST,
        port    : process.env.DB_PORT,
        user    : process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        ssl: {
          rejectUnauthorized: false,
        },
      },
      pool      : {
        min              : Number(process.env.DB_MIN_POOL_SIZE),
        max              : Number(process.env.DB_MAX_POOL_SIZE),
        idleTimeoutMillis: 8 * HOUR,
      },
    })

    client.on('query', logQuery)
    client.on('query-response', logQueryResponse)
    client.on('query-error', logQueryError)
    client.on('error', logger.error)
  },

  dispose() {
    logger.info('Closing knex connection..')

    return this.client.destroy()
  },
}

export default knex