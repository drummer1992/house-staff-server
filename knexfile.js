import dotenv from 'dotenv';

dotenv.config();

/**
 * @type { Object.<string, import('knex').Knex.Config> }
 */
export default {
  development: {
    client    : 'pg',
    connection: {
      host    : process.env.DB_HOST,
      port    : Number(process.env.DB_PORT),
      user    : process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,

      ssl: {
        rejectUnauthorized: false,
      }
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