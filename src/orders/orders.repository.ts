import { Injectable } from '@nestjs/common'
import type { Knex } from 'knex'
import { DatabaseService } from '../database/database.service.js'

@Injectable()
export class OrdersRepository {
  constructor(private readonly db: DatabaseService) {
  }

  transaction<T>(cb: (trx: Knex.Transaction) => Promise<T>): Promise<T> {
    return this.db.client.transaction(cb)
  }

  findProductsByIds(ids: string[]) {
    return this.db.client('Products').select('*').whereIn('id', ids)
  }

  findInventoryByIds(productsIds: string[], executor: Knex = this.db.client) {
    return executor('ProductsInventory').select('*').whereIn('productId', productsIds)
  }

  async decrementStock(productId: string, quantity: number, executor: Knex = this.db.client): Promise<void> {
    await executor('ProductsInventory')
      .update({ stockQuantity: executor.raw('"stockQuantity" - ?', [quantity]) })
      .where({ productId })
  }

  async insertOrder(row: Record<string, unknown>, executor: Knex = this.db.client): Promise<void> {
    await executor('Orders').insert(row)
  }

  async insertOrderItems(rows: Array<Record<string, unknown>>, executor: Knex = this.db.client): Promise<void> {
    await executor('OrdersItems').insert(rows)
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
