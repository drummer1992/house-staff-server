import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { WishlistService } from './wishlist.service.js'
import { AddProductsDto } from './dto/add-products.dto.js'
import { RemoveProductDto } from './dto/remove-product.dto.js'
import type { User as DomainUser } from '../types/domain.js'

@Controller('user/wishlist')
@UseGuards(JwtAuthGuard)
export class WishlistController {
  constructor(private readonly wishlist: WishlistService) {
  }

  @Get()
  get(@User() user: DomainUser) {
    return this.wishlist.get(user)
  }

  @Post('add-products')
  addProducts(@Body() body: AddProductsDto, @User() user: DomainUser) {
    return this.wishlist.addProducts(body.productsIds, user)
  }

  @Delete('remove-product')
  removeProduct(@Body() body: RemoveProductDto, @User() user: DomainUser) {
    return this.wishlist.removeProduct(body.productId, user)
  }
}
