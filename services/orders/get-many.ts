import assert from 'assert'
import type { Knex } from 'knex'
import knex from '../../db/knex.js'
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'
import type { User } from '../../types/domain.js'

interface GetOrdersParams {
  ordersIds?: string[]
  user?: User
}

export default async ({ ordersIds, user }: GetOrdersParams = {}) => {
  assert(user, 'User must be provided')

  const orders = await knex.client('Orders').select('*')
    .where({ userId: user.id })
    .modify((qb: Knex.QueryBuilder) => {
      if (ordersIds) {
        qb.whereIn('id', ordersIds)
      }
    })

  const ordersItems = orders.length
    ? await knex.client('OrdersItems').select('*')
      .whereIn('orderId', orders.map((order: { id: string }) => order.id))
    : []

  const productsIds = ordersItems.map((item: { productId: string }) => item.productId)

  const products = productsIds.length
    ? await knex.client('Products').select('*')
      .whereIn('id', productsIds)
    : []

  const ordersItemsGrouped = groupBy(ordersItems, 'orderId')
  const productsMap = keyBy(products, 'id')

  return orders.map((order: Record<string, any>) => {
    return {
      id: order.id,
      createdAt: order.createdAt,
      status: order.status,

      delivery: {
        method: order.deliveryMethod,
        price: order.deliveryPrice,
      },

      payment: { method: order.deliveryMethod },

      totalPrice: order.totalPrice,
      vat: order.vat,

      shippingDetails: {
        address: {
          country: order.receiverCountry,
          city: order.receiverCity,
          postalCode: order.receiverPostalCode,
          street: order.receiverAddress,
        },

        email: order.receiverEmail,
        phone: order.receiverPhone,
        notes: order.notes,
      },

      items: ordersItemsGrouped[order.id].map((item: Record<string, any>) => ({
        id: item.id,
        product: productsMap[item.productId],

        price: item.price,
        discount: item.discount,
        quantity: item.quantity,
      })),
    }
  })
}
