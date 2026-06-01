import type { Knex } from 'knex'
import { HOUR } from '../utils/date.js'

type Getter = (key: string) => string | undefined

export const buildKnexConfig = (get: Getter): Knex.Config => {
  const _req = (key: string): string => {
    const value = get(key)

    if (value == null || value === '') {
      throw new Error(`Missing env: ${key}`)
    }

    return value
  }

  const host = _req('DB_HOST')

  return {
    client    : 'pg',
    connection: {
      host,
      port    : Number(_req('DB_PORT')),
      user    : _req('POSTGRES_USER'),
      password: _req('POSTGRES_PASSWORD'),
      database: _req('POSTGRES_DB'),
      ssl     : host === 'postgres' ? false : { rejectUnauthorized: false },
    },
    pool      : {
      min              : Number(_req('DB_MIN_POOL_SIZE')),
      max              : Number(_req('DB_MAX_POOL_SIZE')),
      idleTimeoutMillis: 8 * HOUR,
    },
  }
}
