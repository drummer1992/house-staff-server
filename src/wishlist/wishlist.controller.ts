import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { JoiValidationPipe } from '../common/joi-validation.pipe.js'
import { WishlistService } from './wishlist.service.js'
import { addProductsSchema, removeProductSchema } from './wishlist.schema.js'
import type { User as DomainUser } from '../../types/domain.js'

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
  addProducts(
    @Body(new JoiValidationPipe(addProductsSchema)) body: { productsIds: string[] },
    @User() user: DomainUser,
  ) {
    return this.wishlist.addProducts(body.productsIds, user)
  }

  @Delete('remove-product')
  removeProduct(
    @Body(new JoiValidationPipe(removeProductSchema)) body: { productId: string },
    @User() user: DomainUser,
  ) {
    return this.wishlist.removeProduct(body.productId, user)
  }
}
