import { Injectable } from '@nestjs/common'
import type { Knex } from 'knex'
import keyBy from 'lodash.keyby'
import groupBy from 'lodash.groupby'
import sumBy from 'lodash.sumby'
import { validationAssert } from '../common/asserts.js'
import { randomUUID } from 'crypto'
import { roundMoney } from '../utils/number.js'
import deliveryMethods from '../constants/delivery-methods.js'
import countries from '../constants/countries.js'
import { OrdersRepository } from './orders.repository.js'
import { CreateOrderDto } from './dto/create-order.dto.js'
import type { User } from '../types/domain.js'

type OrderItems = CreateOrderDto['items']

@Injectable()
export class OrdersService {
  constructor(private readonly orders: OrdersRepository) {
  }

  async create(order: CreateOrderDto, user: User) {
    const productsIds = order.items.map(i => i.product.id)

    const products = await this.orders.findProductsByIds(productsIds)
    const productsMap = keyBy(products, 'id')

    const unknownProductIds = productsIds.filter(id => !productsMap[id])

    validationAssert(!unknownProductIds.length, `Unknown products provided: ${unknownProductIds}`)

    const { deliveryPrice, totalPrice, vat } = this.calculatePrice(productsMap, order)

    validationAssert(totalPrice === order.totalPrice,
      'Total price does not match the sum of item prices. ' +
      `Provided total: ${order.totalPrice} Expected total: ${totalPrice}. ` +
      `Expected delivery price: ${deliveryPrice}, Expected VAT: ${vat}`,
    )

    const orderId = randomUUID()

    await this.orders.transaction(async trx => {
      await this.updateStock(order.items, trx)

      await this.orders.insertOrder({
        id                : orderId,
        userId            : user.id,
        createdAt         : new Date().toISOString(),
        status            : 'pending',
        notes             : order.shippingDetails.notes,
        deliveryMethod    : order.delivery.method,
        paymentMethod     : order.payment.method,
        receiverAddress   : order.shippingDetails.address.street,
        receiverCity      : order.shippingDetails.address.city,
        receiverCountry   : order.shippingDetails.address.country,
        receiverPostalCode: order.shippingDetails.address.postalCode,
        receiverEmail     : order.shippingDetails.email,
        receiverPhone     : order.shippingDetails.phone,
        vat,
        deliveryPrice,
        totalPrice,
      }, trx)

      await this.orders.insertOrderItems(order.items.map(i => {
        const product = productsMap[i.product.id]

        return {
          id       : randomUUID(),
          orderId,
          productId: i.product.id,
          quantity : i.quantity,
          price    : product.price,
          discount : product.discount,
        }
      }), trx)
    })

    const [created] = await this.buildOrders(user, [orderId])

    return created
  }

  list(user: User) {
    return this.buildOrders(user)
  }

  private async buildOrders(user: User, ordersIds?: string[]) {
    const orders = await this.orders.findOrders(user.id, ordersIds)

    const ordersItems = orders.length
      ? await this.orders.findOrderItems(orders.map((order: { id: string }) => order.id))
      : []

    const productsIds = ordersItems.map((item: { productId: string }) => item.productId)

    const products = productsIds.length
      ? await this.orders.findProductsByIds(productsIds)
      : []

    const ordersItemsGrouped = groupBy(ordersItems, 'orderId')
    const productsMap = keyBy(products, 'id')

    return orders.map((order: Record<string, any>) => ({
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

        email: order.receiverEmail,
        phone: order.receiverPhone,
        notes: order.notes,
      },

      items: ordersItemsGrouped[order.id].map((item: Record<string, any>) => ({
        id     : item.id,
        product: productsMap[item.productId],

        price   : item.price,
        discount: item.discount,
        quantity: item.quantity,
      })),
    }))
  }

  private async updateStock(items: OrderItems, trx: Knex.Transaction): Promise<void> {
    const productsIds = items.map(i => i.product.id)

    const availability = await this.orders.findInventoryByIds(productsIds, trx)
    const availabilityMap = keyBy(availability, 'productId')

    for (const item of items) {
      const { product: { id }, quantity } = item

      const stockQuantity = availabilityMap[id].stockQuantity

      validationAssert(stockQuantity >= quantity, `Product ${id} does not have enough items in stock`)

      await this.orders.decrementStock(id, quantity, trx)
    }
  }

  private calculatePrice(productsMap: Record<string, any>, order: CreateOrderDto) {
    const deliveryMethodsMap = keyBy(deliveryMethods, 'id')

    const productsPrice = sumBy(order.items, i => {
      const product = productsMap[i.product.id]

      const priceWithDiscount = product.price - (product.price * product.discount / 100)

      return priceWithDiscount * i.quantity
    })

    const deliveryPrice = deliveryMethodsMap[order.delivery.method].price

    const country = countries.find(c => c.name === order.shippingDetails.address.country)!
    const countryVatRate = country.vatRate

    const subtotalPrice = roundMoney(productsPrice + deliveryPrice)
    const vat = roundMoney(subtotalPrice * countryVatRate / 100)
    const totalPrice = roundMoney(subtotalPrice + vat)

    return { deliveryPrice, totalPrice, vat }
  }
}
