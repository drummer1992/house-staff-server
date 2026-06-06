import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service.js'

@Injectable()
export class CategoriesRepository {
  constructor(private readonly db: DatabaseService) {
  }

  findAll() {
    return this.db.client.select('*').from('Categories')
  }
}