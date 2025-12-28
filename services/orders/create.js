import { array, number, object, oneOf, string } from 'sito'
import deliveryMethods from '../../constants/delivery-methods.js'
import paymentMethods from '../../constants/payment-methods.js'
import knex from '../../db/knex.js'
import { uuidV4 } from '../../utils/random.js'
import assert from 'assert'
import { validationAssert } from '../../errors/index.js'
import keyBy from 'lodash.keyby'
import sumBy from 'lodash.sumby'
import countries from '../../constants/countries.js'

const validationSchema = object({
  delivery: object({ method: oneOf(deliveryMethods.map(m => m.id)).required() })
    .strict().required(),

  payment: object({ method: oneOf(paymentMethods.map(m => m.id)).required() })
    .strict().required(),

  totalPrice: number().positive(),

  shippingDetails: object({
    address: object({
      country   : oneOf(countries.map(c => c.name)),
      city      : string().notEmpty().required(),
      postalCode: string().notEmpty().required(),
      street    : string().notEmpty().required(),
    }).required().strict(),

    company: string().notEmpty().required(),
    email  : string().notEmpty().required(),
    phone  : string().notEmpty().required(),
    notes  : string().notEmpty().required(),
  }).required().strict(),

  items: array(
    object({
      product : object({ id: string().notEmpty().required() }).strict().required(),
      quantity: number().positive(),
    }).strict().required(),
  )
    .notEmpty().required(),
}).required().strict()

const updateProductsStock = async items => {
  const productsIds = items.map(i => i.product.id)

  const availability = await knex.client.select('*')
    .from('ProductsInventory')
    .whereIn('productId', productsIds)

  const availabilityMap = keyBy(availability, 'productId')

  for (const item of items) {
    const { product: { id }, quantity } = item

    const stockQuantity = availabilityMap[id].stockQuantity

    validationAssert(stockQuantity >= quantity,
      `Product ${id} does not have enough items in stock`)

    await knex.client('ProductsInventory')
      .update({ stockQuantity: knex.client.raw('"stockQuantity" - ?', [quantity]) })
      .where({ productId: id })
  }
}

const calculatePrice = (productsMap, order) => {
  const deliveryMethodsMap = keyBy(deliveryMethods, 'id')

  const productsPrice = sumBy(order.items, i => {
    const product = productsMap[i.product.id]

    const priceWithDiscount = product.price - (product.price * product.discount / 100)

    return priceWithDiscount * i.quantity
  })

  const deliveryPrice = deliveryMethodsMap[order.delivery.method].price

  const country = countries.find(country => country.name === order.shippingDetails.address.country)

  const countryVatRate = country.vatRate

  const subtotalPrice = productsPrice + deliveryPrice

  const vat = (subtotalPrice * countryVatRate / 100)

  const totalPrice = subtotalPrice + vat

  return { deliveryPrice, totalPrice, vat }
}

export default async (order, user) => {
  await validationSchema.assert(order)

  assert(user, 'User must be provided to create an order')

  const productsIds = order.items.map(i => i.product.id)

  const products = await knex.client.select('*')
    .from('Products')
    .whereIn('id', productsIds)

  const productsMap = keyBy(products, 'id')

  const unknownProductIds = productsIds.filter(id => !productsMap[id])

  validationAssert(!unknownProductIds.length, `Unknown products provided: ${unknownProductIds}`)

  const { deliveryPrice, totalPrice, vat } = calculatePrice(productsMap, order)

  validationAssert(totalPrice === order.totalPrice, 'Total price does not match the sum of item prices')

  await updateProductsStock(order.items)

  const orderId = uuidV4()

  await knex.client('Orders').insert({
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
    receiverCompany   : order.shippingDetails.company,
    receiverEmail     : order.shippingDetails.email,
    receiverPhone     : order.shippingDetails.phone,
    vat,
    deliveryPrice,
    totalPrice,
  })

  await knex.client('OrdersItems').insert(order.items.map(i => {
    const product = productsMap[i.product.id]

    return {
      id       : uuidV4(),
      orderId  : orderId,
      productId: i.product.id,
      quantity : i.quantity,
      price    : product.price,
      discount : product.discount,
    }
  }))

  return orderId
}