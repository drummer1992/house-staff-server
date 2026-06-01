import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { UsersService } from './users.service.js'
import type { User as DomainUser } from '../../types/domain.js'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Get()
  getProfile(@User() user: DomainUser) {
    return user
  }

  @Put()
  update(@Body() changes: Partial<DomainUser>, @User() user: DomainUser) {
    return this.users.update(changes, user)
  }
}
