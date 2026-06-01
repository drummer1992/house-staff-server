import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service.js'

@Injectable()
export class ProductsRepository {
  constructor(private readonly db: DatabaseService) {
  }

  async findListingData() {
    const [categories, products, collections, inventory, collectionsProducts] = await Promise.all([
      this.db.client.select('*').from('Categories'),
      this.db.client.select('*').from('Products'),
      this.db.client.select('*').from('Collections'),
      this.db.client.select('*').from('ProductsInventory'),
      this.db.client.select('*').from('CollectionsProducts'),
    ])

    return { categories, products, collections, inventory, collectionsProducts }
  }
}
