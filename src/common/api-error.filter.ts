import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common'
import type { Response } from 'express'
import { ApiError } from '../../errors/index.js'

/**
 * Maps the legacy custom error classes (ApiError and its subclasses:
 * ValidationError → 400, NotFoundError → 404, NotAuthenticatedError → 401, …)
 * to HTTP responses, so services reused from the legacy layer keep their status
 * codes when called from NestJS controllers. Mirrors `config/error-handler.ts`.
 */
@Catch(ApiError)
export class ApiErrorFilter implements ExceptionFilter {
  catch(exception: ApiError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()

    response.status(exception.status).json({
      message: exception.message,
      statusCode: exception.status,
    })
  }
}
