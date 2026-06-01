import { Inject, Injectable } from '@nestjs/common'
import type { Knex } from 'knex'
import { DatabaseService } from '../database/database.service.js'

@Injectable()
export class OrdersRepository {
  constructor(private readonly db: DatabaseService) {
  }

  findProductsByIds(ids: string[]) {
    return this.db.client('Products').select('*').whereIn('id', ids)
  }

  findInventoryByIds(productsIds: string[]) {
    return this.db.client('ProductsInventory').select('*').whereIn('productId', productsIds)
  }

  async decrementStock(productId: string, quantity: number): Promise<void> {
    await this.db.client('ProductsInventory')
      .update({ stockQuantity: this.db.client.raw('"stockQuantity" - ?', [quantity]) })
      .where({ productId })
  }

  async insertOrder(row: Record<string, unknown>): Promise<void> {
    await this.db.client('Orders').insert(row)
  }

  async insertOrderItems(rows: Array<Record<string, unknown>>): Promise<void> {
    await this.db.client('OrdersItems').insert(rows)
  }

  findOrders(userId: string, ordersIds?: string[]) {
    return this.db.client('Orders')
      .select('*')
      .where({ userId })
      .modify((qb: Knex.QueryBuilder) => {
        if (ordersIds) {
          qb.whereIn('id', ordersIds)
        }
      })
  }

  findOrderItems(orderIds: string[]) {
    return this.db.client('OrdersItems').select('*').whereIn('orderId', orderIds)
  }
}
