import { Body, Controller, Get, HttpCode, Post, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { OrdersService } from './orders.service.js'
import type { User as DomainUser } from '../../types/domain.js'

type CreateOrderBody = Parameters<OrdersService['create']>[0]

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  // Legacy returned 200 (via endpointHandler); keep that instead of POST's default 201.
  @Post()
  @HttpCode(200)
  create(@Body() order: CreateOrderBody, @User() user: DomainUser) {
    return this.orders.create(order, user)
  }

  @Get()
  list(@User() user: DomainUser) {
    return this.orders.list(user)
  }
}
