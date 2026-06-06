import { fileURLToPath } from 'url'
import path from 'path'
import type { Knex } from 'knex'
import dotenv from 'dotenv'
import { buildKnexConfig } from './db/knex-config.js'

dotenv.config()

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const isTs = import.meta.url.endsWith('.ts')

const migrations: Knex.MigratorConfig = {
  tableName     : 'knex_migrations',
  directory     : path.join(__dirname, 'db/migrations'),
  extension     : isTs ? 'ts' : 'js',
  loadExtensions: isTs ? ['.ts'] : ['.js'],
}

const base: Knex.Config = {
  ...buildKnexConfig(key => process.env[key]),
  migrations,
  useNullAsDefault: true,
}

const config: Record<string, Knex.Config> = {
  development: { ...base, seeds: { directory: path.join(__dirname, 'db/seeds') } },
  production : base,
}

export default config
