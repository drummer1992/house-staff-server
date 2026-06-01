import { type ArgumentsHost, Catch, type ExceptionFilter } from '@nestjs/common'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import type { Response } from 'express'
import { ApiError } from '../../errors/index.js'

@Catch(ApiError)
export class ApiErrorFilter implements ExceptionFilter {
  constructor(@InjectPinoLogger('ApiError') private readonly logger: PinoLogger) {
  }

  catch(exception: ApiError, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>()

    if (exception.status >= 500) {
      this.logger.error({ err: exception }, exception.message)
    }

    response.status(exception.status).json({
      message   : exception.message,
      statusCode: exception.status,
    })
  }
}
