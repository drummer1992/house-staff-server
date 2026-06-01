import { Injectable } from '@nestjs/common'
import keyBy from 'lodash.keyby'
import mapValues from 'lodash.mapvalues'
import { ProductsRepository } from './products.repository.js'

@Injectable()
export class ProductsService {
  constructor(private readonly products: ProductsRepository) {
  }

  async findAll() {
    const { categories, products, collections, inventory, collectionsProducts } =
            await this.products.findListingData()

    const collectionsMap = keyBy(collections, 'id')

    const collectionsByProduct: Record<string, any> = mapValues(
      keyBy(collectionsProducts, 'productId'),
      (r: { collectionId: string }) => collectionsMap[r.collectionId],
    )

    const inventoryMap = keyBy(inventory, 'productId')
    const categoriesMap = keyBy(categories, 'id')

    return products.map((p: Record<string, any>) => {
      const collection = collectionsByProduct[p.id]

      return {
        ...p,
        price         : Number(p.price),
        discount      : Number(p.discount),
        categoryName  : categoriesMap[p.categoryId].name,
        collectionId  : collection?.id || null,
        collectionName: collection?.name || null,
        stockQuantity : inventoryMap[p.id]?.stockQuantity || 0,
      }
    })
  }
}
