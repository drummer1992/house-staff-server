import { Injectable } from '@nestjs/common'
import getWishlist from '../../services/users/wishlist/get.js'
import addProducts from '../../services/users/wishlist/add-products.js'
import removeProduct from '../../services/users/wishlist/remove-product.js'
import type { User } from '../../types/domain.js'

@Injectable()
export class WishlistService {
  get(user: User) {
    return getWishlist(user)
  }

  addProducts(productsIds: string[], user: User): Promise<void> {
    return addProducts(productsIds, user)
  }

  removeProduct(productId: string, user: User): Promise<void> {
    return removeProduct(productId, user)
  }
}
