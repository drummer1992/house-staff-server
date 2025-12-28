import assert from 'assert'
import knex from '../../db/knex.js'
import groupBy from 'lodash.groupby'
import keyBy from 'lodash.keyby'

export default async (ordersIds, user) => {
  assert(user, 'User must be provided')

  const orders = await knex.client('Orders').select('*')
    .where({ userId: user.id })
    .whereIn('id', ordersIds)

  const ordersItems = orders.length
    ? await knex.client('OrdersItems').select('*')
      .whereIn('orderId', orders.map(order => order.id))
    : []

  const productsIds = ordersItems.map(item => item.productId)

  const products = productsIds.length
    ? await knex.client('Products').select('*')
      .whereIn('id', productsIds)
    : []

  const ordersItemsGrouped = groupBy(ordersItems, 'orderId')
  const productsMap = keyBy(products, 'id')

  return orders.map(order => {

    return {
      id       : order.id,
      createdAt: order.createdAt,
      status   : order.status,

      delivery: {
        method: order.deliveryMethod,
        price : order.deliveryPrice,
      },

      payment: { method: order.deliveryMethod },

      totalPrice: order.totalPrice,
      vat       : order.vat,

      shippingDetails: {
        address: {
          country   : order.receiverCountry,
          city      : order.receiverCity,
          postalCode: order.receiverPostalCode,
          street    : order.receiverAddress,
        },

        company: order.receiverCompany,
        email  : order.receiverEmail,
        phone  : order.receiverPhone,
        notes  : order.notes,
      },

      items: ordersItemsGrouped[order.id].map(item => ({
        id     : item.id,
        product: productsMap[item.productId],

        price   : item.price,
        discount: item.discount,
        quantity: item.quantity,
      })),
    }
  })
}