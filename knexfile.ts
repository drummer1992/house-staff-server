import type { Knex } from 'knex'

await import('./config/init-env.js')

const config: Record<string, Knex.Config> = {
  development: {
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

    migrations: {
      tableName: 'knex_migrations',
      directory: './db/migrations',
      extension: 'ts',
      loadExtensions: ['.ts'],
    },
    seeds: {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },
}

export default config
