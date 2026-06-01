import { Injectable } from '@nestjs/common'
import knex, { Knex } from 'knex'
import { HOUR } from '../../utils/date.js'
import * as timing from '../../utils/timing.js'
import { randomCode } from '../../utils/random.js'
import type { Timing } from '../../utils/timing.js'
import pg from 'pg'
import { AppLogger } from '../logger/app-logger.service.js'

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

@Injectable()
export class DatabaseService {
  public client: Knex

  constructor(private readonly logger: AppLogger) {
    this.client = knex({
      client    : 'pg',
      connection: {
        host    : process.env.DB_HOST,
        port    : Number(process.env.DB_PORT),
        user    : process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,

        ssl: process.env.DB_HOST === 'postgres'
          ? false
          : { rejectUnauthorized: false },
      },
      pool      : {
        min              : Number(process.env.DB_MIN_POOL_SIZE),
        max              : Number(process.env.DB_MAX_POOL_SIZE),
        idleTimeoutMillis: 8 * HOUR,
      },
    })

    this.client.on('query', queryData => this.logQuery(queryData))
    this.client.on('query-response', (response, queryData) => this.logQueryResponse(response, queryData))
    this.client.on('query-error', (err, queryData) => this.logQueryError(err, queryData))
    this.client.on('error', error => this.logger.error(error))
  }

  private logQuery(queryData: QueryData): void {
    queryData.options = queryData.options || {}
    queryData.bindings = queryData.bindings || []

    const bindings = [...queryData.bindings]

    const sql = queryData.sql.replace(/\?/g, () => {
      const value = bindings.shift()

      return typeof value === 'string' ? `'${value}'` : String(value)
    })

    queryData.options.timing = timing.init()
    queryData.options.id = randomCode(4)

    this.logger.log(`${queryData.options.id} > SQL: ${sql.replace(/[\s\n]+/g, ' ')}`)
  }

  private logQueryResponse(_response: unknown, queryData: QueryData): void {
    const ms = timing.getDiff(queryData.options.timing as Timing)

    this.logger.log(`${queryData.options.id} < (${queryData.response?.rowCount}): ${ms.toFixed(3)}ms`)
  }

  private logQueryError(_err: unknown, queryData: QueryData): void {
    const ms = timing.getDiff(queryData.options.timing as Timing)

    this.logger.error(`${queryData.options.id} < (err): ${ms.toFixed(3)}ms`)
  }

  escape = (value: unknown): unknown => {
    if (typeof value === 'string') {
      return value.replace(/'/g, '\'\'')
    }

    return value
  }
}