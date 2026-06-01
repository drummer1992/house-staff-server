import Joi from 'joi'

export const updateUserSchema = Joi.object({
  name      : Joi.string().min(1).max(255),
  email     : Joi.string().min(1).max(255),
  phone     : Joi.string().min(1).max(50),
  address   : Joi.string().min(1).max(255),
  postalCode: Joi.string().min(1).max(20),
  city      : Joi.string().min(1).max(100),
  country   : Joi.string().min(1).max(100),
}).min(1)
