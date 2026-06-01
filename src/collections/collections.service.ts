import { Inject, Injectable } from '@nestjs/common'
import type { Knex } from 'knex'
import { KNEX } from '../database/knex.constants.js'

@Injectable()
export class CollectionsService {
  constructor(@Inject(KNEX) private readonly knex: Knex) {}

  findAll() {
    return this.knex.select('*').from('Collections')
  }
}
