import { Injectable } from '@nestjs/common'
import { validationAssert } from '../../errors/index.js'
import { uuidV4 } from '../../utils/random.js'
import { WishlistRepository } from './wishlist.repository.js'
import type { User } from '../../types/domain.js'

@Injectable()
export class WishlistService {
  constructor(private readonly wishlist: WishlistRepository) {
  }

  async get(user: User) {
    const list = await this.wishlist.findWishlist(user.id)

    if (list.length) {
      const productIds = list.map((item: { productId: string }) => item.productId)

      return this.wishlist.findProductsByIds(productIds)
    }

    return []
  }

  async addProducts(productsIds: string[], user: User): Promise<void> {
    const existing = await this.wishlist.findExistingProductIds(productsIds)

    const notFoundProductsIds = productsIds.filter(id => !existing.find(p => p.id === id))

    validationAssert(!notFoundProductsIds.length, 'Some products were not found: ' + notFoundProductsIds.join(', '))

    const alreadyWishlisted = await this.wishlist.findWishlistedIn(user.id, productsIds)

    validationAssert(!alreadyWishlisted.length,
      'Some products are already in the wishlist: ' + alreadyWishlisted.map(p => p.productId).join(', '))

    await this.wishlist.insertMany(productsIds.map(productId => ({
      id    : uuidV4(),
      userId: user.id,
      productId,
    })))
  }

  async removeProduct(productId: string, user: User): Promise<void> {
    validationAssert(await this.wishlist.productExists(productId), 'Such a product does not exist')

    validationAssert(await this.wishlist.wishItemExists(user.id, productId), 'Product is not in the wishlist')

    await this.wishlist.deleteItem(user.id, productId)
  }
}
