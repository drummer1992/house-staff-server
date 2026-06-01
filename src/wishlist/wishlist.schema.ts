import { array, object, string } from 'sito'

export const addProductsSchema = object({
  productsIds: array(string().notEmpty().required()).notEmpty().required(),
})

export const removeProductSchema = object({
  productId: string().notEmpty().required(),
})