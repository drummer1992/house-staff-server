import { createParamDecorator, type ExecutionContext } from '@nestjs/common'
import type { Request } from 'express'

/**
 * Exposes the authenticated user (attached by the passport guard) to controller
 * methods: `getProfile(@User() user: Express.User) { ... }`. Replaces the
 * legacy `getCurrentUser()` helper for NestJS routes.
 */
export const User = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Express.User | undefined => {
    const request = ctx.switchToHttp().getRequest<Request>()

    return request.user
  },
)
