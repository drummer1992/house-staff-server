import knex from '../../db/knex.js'

export default () => knex.client.select('*').from('Collections')