await import('./config/init-env.js')

/**
 * @type { Object.<string, import('knex').Knex.Config> }
 */
export default {
  development: {
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

    migrations      : {
      tableName: 'knex_migrations',
      directory: './db/migrations',
    },
    seeds           : {
      directory: './db/seeds',
    },
    useNullAsDefault: true,
  },
}