import { Injectable, type OnModuleDestroy } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import knex, { Knex } from 'knex'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { buildKnexConfig } from '../../db/knex-config.js'
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

@Injectable()
export class DatabaseService implements OnModuleDestroy {
  public client: Knex

  constructor(
    @InjectPinoLogger('Database') private readonly logger: PinoLogger,
    config: ConfigService,
  ) {
    this.client = knex(buildKnexConfig(key => config.get<string>(key)))

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

    this.logger.debug({ queryId: queryData.options.id, sql: sql.replace(/[\s\n]+/g, ' ') }, 'sql')
  }

  private logQueryResponse(_response: unknown, queryData: QueryData): void {
    const ms = timing.getDiff(queryData.options.timing as Timing)

    this.logger.debug(
      { queryId: queryData.options.id, rowCount: queryData.response?.rowCount, ms: Number(ms.toFixed(3)) },
      'sql done',
    )
  }

  private logQueryError(_err: unknown, queryData: QueryData): void {
    const ms = timing.getDiff(queryData.options.timing as Timing)

    this.logger.error({ queryId: queryData.options.id, ms: Number(ms.toFixed(3)) }, 'sql error')
  }

  onModuleDestroy(): Promise<void> {
    return this.client.destroy()
  }
}