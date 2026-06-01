import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common'
import type { Response } from 'express'
import { ApiError } from '../../errors/index.js'

@Catch(ApiError)
export class ApiErrorFilter implements ExceptionFilter {
  catch(exception: ApiError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()

    response.status(exception.status).json({
      message   : exception.message,
      statusCode: exception.status,
    })
  }
}
