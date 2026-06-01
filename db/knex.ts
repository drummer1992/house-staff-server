import { HOUR } from '../utils/date.js'
import _knex, { Knex } from 'knex'
import assert from 'assert'
import logger from '../utils/logger.js'
import * as timing from '../utils/timing.js'
import { randomCode } from '../utils/random.js'
import type { Timing } from '../utils/timing.js'
import pg from 'pg'

pg.types.setTypeParser(pg.types.builtins.INT8, (value: string) => {
  return parseInt(value)
})

pg.types.setTypeParser(pg.types.builtins.FLOAT8, (value: string) => {
  return parseFloat(value)
})

pg.types.setTypeParser(pg.types.builtins.NUMERIC, (value: string) => {
  return parseFloat(value)
})

interface QueryData {
  sql: string
  bindings?: unknown[]
  options: { timing?: Timing; id?: string }
  response?: { rowCount: number }
}

const logQuery = (queryData: QueryData): void => {
  queryData.options = queryData.options || {}
  queryData.bindings = queryData.bindings || []

  const bindings = [...queryData.bindings]

  const sql = queryData.sql.replace(/\?/g, () => {
    const value = bindings.shift()

    return typeof value === 'string' ? `'${value}'` : String(value)
  })

  queryData.options.timing = timing.init()
  queryData.options.id = randomCode(4)

  logger.info(`${queryData.options.id} > SQL: ${sql.replace(/[\s\n]+/g, ' ')}`)
}

const logQueryResponse = (_response: unknown, queryData: QueryData): void => {
  const ms = timing.getDiff(queryData.options.timing as Timing)

  logger.info(`${queryData.options.id} < (${queryData.response?.rowCount}): ${ms.toFixed(3)}ms`)
}

const logQueryError = (_err: unknown, queryData: QueryData): void => {
  const ms = timing.getDiff(queryData.options.timing as Timing)

  logger.error(`${queryData.options.id} < (err): ${ms.toFixed(3)}ms`)
}

const escape = (value: unknown): unknown => {
  if (typeof value === 'string') {
    return value.replace(/'/g, '\'\'')
  }

  return value
}

let client: Knex | undefined

const knex = {
  escape,

  get client(): Knex {
    if (!client) {
      knex.init()
    }

    return client as Knex
  },

  raw(...args: Parameters<Knex['raw']>) {
    return this.client.raw.apply(this.client, args)
  },

  init(): void {
    assert(!client, 'Knex client is already initialized')

    client = _knex({
      client: 'pg',
      connection: {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,

        ssl: process.env.DB_HOST === 'postgres'
          ? false
          : { rejectUnauthorized: false },
      },
      pool: {
        min: Number(process.env.DB_MIN_POOL_SIZE),
        max: Number(process.env.DB_MAX_POOL_SIZE),
        idleTimeoutMillis: 8 * HOUR,
      },
    })

    client.on('query', logQuery)
    client.on('query-response', logQueryResponse)
    client.on('query-error', logQueryError)
    client.on('error', logger.error)
  },

  dispose(): Promise<void> {
    logger.info('Closing knex connection..')

    return this.client.destroy()
  },
}

export default knex
