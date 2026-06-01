import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

// @User() — the authenticated user that the auth guard put on the request
export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Express.User | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>()

    return request.user
  },
)
