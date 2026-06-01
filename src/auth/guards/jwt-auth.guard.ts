import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Replaces the legacy `assertUserAuthenticated()` call. Apply with
 * `@UseGuards(JwtAuthGuard)` on NestJS controllers/routes.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
