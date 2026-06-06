import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'
import { User } from '../auth/decorators/user.decorator.js'
import { UsersService } from './users.service.js'
import { UpdateUserDto } from './dto/update-user.dto.js'
import { UserResponseDto } from './dto/user-response.dto.js'
import type { User as DomainUser } from '../types/domain.js'

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly users: UsersService) {
  }

  @Get()
  getProfile(@User() user: DomainUser): UserResponseDto {
    return plainToInstance(UserResponseDto, user, { excludeExtraneousValues: true })
  }

  @Put()
  async update(@Body() changes: UpdateUserDto, @User() user: DomainUser): Promise<UserResponseDto> {
    const updated = await this.users.update(changes, user)

    return plainToInstance(UserResponseDto, updated, { excludeExtraneousValues: true })
  }
}
