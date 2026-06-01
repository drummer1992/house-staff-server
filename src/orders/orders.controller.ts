import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { SitoValidationPipe } from '../common/sito-validation.pipe.js'
import { OrdersService, type OrderInput } from './orders.service.js'
import { createOrderSchema } from './orders.schema.js'
import type { User as DomainUser } from '../../types/domain.js'

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {
  }

  @Post()
  create(
    @Body(new SitoValidationPipe(createOrderSchema)) order: OrderInput,
    @User() user: DomainUser,
  ) {
    return this.orders.create(order, user)
  }

  @Get()
  list(@User() user: DomainUser) {
    return this.orders.list(user)
  }
}
