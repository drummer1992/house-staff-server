import Joi from 'joi'
import deliveryMethods from '../../constants/delivery-methods.js'
import paymentMethods from '../../constants/payment-methods.js'
import countries from '../../constants/countries.js'

export const createOrderSchema = Joi.object({
  delivery: Joi.object({
    method: Joi.string().valid(...deliveryMethods.map(m => m.id)).required(),
  }).required(),

  payment: Joi.object({
    method: Joi.string().valid(...paymentMethods.map(m => m.id)).required(),
  }).required(),

  totalPrice: Joi.number().positive(),

  shippingDetails: Joi.object({
    address: Joi.object({
      country   : Joi.string().valid(...countries.map(c => c.name)),
      city      : Joi.string().min(1).required(),
      postalCode: Joi.string().min(1).required(),
      street    : Joi.string().min(1).required(),
    }).required(),

    email: Joi.string().min(1).required(),
    phone: Joi.string().min(1).required(),
    notes: Joi.string().min(1),
  }).required(),

  items: Joi.array().items(
    Joi.object({
      product : Joi.object({ id: Joi.string().min(1).required() }).required(),
      quantity: Joi.number().positive(),
    }).required(),
  ).min(1).required(),
}).required()
