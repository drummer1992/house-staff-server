import type { Knex } from 'knex'
import dotenv from 'dotenv'
import { buildKnexConfig } from './db/knex-config.js'

dotenv.config()

const config: Record<string, Knex.Config> = {
  development: {
    ...buildKnexConfig(key => process.env[key]),

    migrations      : {
      tableName     : 'knex_migrations',
      directory     : './db/migrations',
      extension     : 'ts',
      loadExtensions: ['.ts'],
    },
    seeds           : {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },
}

export default config
