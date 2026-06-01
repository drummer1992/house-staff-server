import { Global, Module } from '@nestjs/common'
import type { Knex } from 'knex'
import knex from '../../db/knex.js'
import { KNEX } from './knex.constants.js'

/**
 * Exposes the existing lazy-initialized Knex client (`db/knex.ts`) as an
 * injectable provider under the KNEX token. Returns the SAME client the legacy
 * layer uses, so both share a single connection pool — no second pool is opened.
 */
@Global()
@Module({
  providers: [
    {
      provide: KNEX,
      useFactory: (): Knex => knex.client,
    },
  ],
  exports: [KNEX],
})
export class DatabaseModule {}
