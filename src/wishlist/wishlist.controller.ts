import { Body, Controller, Delete, Get, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { WishlistService } from './wishlist.service.js'
import type { User as DomainUser } from '../../types/domain.js'

@Controller('user/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {}

  @Get()
  get(@User() user: DomainUser) {
    return this.wishlist.get(user)
  }

  // Legacy returned 200 (via endpointHandler); keep that instead of POST's default 201.
  @Post('add-products')
  @HttpCode(200)
  addProducts(@Body('productsIds') productsIds: string[], @User() user: DomainUser) {
    return this.wishlist.addProducts(productsIds, user)
  }

  @Delete('remove-product')
  removeProduct(@Body('productId') productId: string, @User() user: DomainUser) {
    return this.wishlist.removeProduct(productId, user)
  }
}
