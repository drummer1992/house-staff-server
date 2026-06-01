/**
 * Injection token for the shared Knex client.
 * Inject with `@Inject(KNEX) private readonly knex: Knex`.
 */
export const KNEX = 'KNEX'
