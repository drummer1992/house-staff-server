import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { JoiValidationPipe } from '../common/joi-validation.pipe.js'
import { UsersService } from './users.service.js'
import { updateUserSchema } from './users.schema.js'
import type { User as DomainUser } from '../../types/domain.js'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {
  }

  @Get()
  getProfile(@User() user: DomainUser) {
    return user
  }

  @Put()
  update(
    @Body(new JoiValidationPipe(updateUserSchema)) changes: Partial<DomainUser>,
    @User() user: DomainUser,
  ) {
    return this.users.update(changes, user)
  }
}
