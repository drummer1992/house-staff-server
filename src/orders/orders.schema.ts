import { array, number, object, oneOf, string } from 'sito'
import deliveryMethods from '../../constants/delivery-methods.js'
import paymentMethods from '../../constants/payment-methods.js'
import countries from '../../constants/countries.js'

export const createOrderSchema = object({
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

    email: string().notEmpty().required(),
    phone: string().notEmpty().required(),
    notes: string().notEmpty(),
  }).required().strict(),

  items: array(
    object({
      product : object({ id: string().notEmpty().required() }).strict().required(),
      quantity: number().positive(),
    }).strict().required(),
  )
    .notEmpty().required(),
}).required().strict()
