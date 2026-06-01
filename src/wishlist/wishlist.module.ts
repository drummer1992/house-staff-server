import { Module } from '@nestjs/common'
import { WishlistController } from './wishlist.controller.js'
import { WishlistService } from './wishlist.service.js'
import { WishlistRepository } from './wishlist.repository.js'

@Module({
  controllers: [WishlistController],
  providers  : [WishlistService, WishlistRepository],
})
export class WishlistModule {
}
