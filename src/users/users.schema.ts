import { object, string } from 'sito'

export const updateUserSchema = object({
  name      : string().notEmpty().max(255),
  email     : string().notEmpty().max(255),
  phone     : string().notEmpty().max(50),
  address   : string().notEmpty().max(255),
  postalCode: string().notEmpty().max(20),
  city      : string().notEmpty().max(100),
  country   : string().notEmpty().max(100),
}).notEmpty()
