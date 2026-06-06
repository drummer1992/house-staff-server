import { Injectable } from '@nestjs/common'
import { DatabaseService } from '../database/database.service.js'

@Injectable()
export class WishlistRepository {
  constructor(private readonly db: DatabaseService) {
  }

  findWishlist(userId: string) {
    return this.db.client('UsersWishProducts').select('*').where({ userId })
  }

  findProductsByIds(ids: string[]) {
    return this.db.client('Products').select('*').whereIn('id', ids)
  }

  findExistingProductIds(ids: string[]): Promise<Array<{ id: string }>> {
    return this.db.client('Products').select(['id']).whereIn('id', ids)
  }

  findWishlistedIn(userId: string, ids: string[]): Promise<Array<{ productId: string }>> {
    return this.db.client('UsersWishProducts')
      .select(['productId'])
      .where({ userId })
      .whereIn('productId', ids)
  }

  async insertMany(rows: Array<{ id: string; userId: string; productId: string }>): Promise<void> {
    await this.db.client('UsersWishProducts').insert(rows)
  }

  async productExists(id: string): Promise<boolean> {
    const result = await this.db.client('Products').count().where({ id }).first()

    return Number(result?.count ?? 0) > 0
  }

  async wishItemExists(userId: string, productId: string): Promise<boolean> {
    const result = await this.db.client('UsersWishProducts').count().where({ productId, userId }).first()

    return Number(result?.count ?? 0) > 0
  }

  async deleteItem(userId: string, productId: string): Promise<void> {
    await this.db.client('UsersWishProducts').where({ productId, userId }).delete()
  }
}
