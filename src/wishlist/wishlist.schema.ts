import Joi from 'joi'

export const addProductsSchema = Joi.object({
  productsIds: Joi.array().items(Joi.string().min(1).required()).min(1).required(),
})

export const removeProductSchema = Joi.object({
  productId: Joi.string().min(1).required(),
})