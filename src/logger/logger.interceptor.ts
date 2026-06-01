import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { catchError, Observable, tap, throwError } from 'rxjs'
import { AppLogger } from './app-logger.service.js'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new AppLogger()

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const req = context.switchToHttp().getRequest()

    const { method, originalUrl } = req

    const start = Date.now()

    this.logger.log(`[REQ] ${method} ${originalUrl}`)

    return next.handle().pipe(
      tap(() => {
        this.logger.log(`[RES] ${method} ${originalUrl} ${Date.now() - start}ms`)
      }),
      catchError((error) => {
        this.logger.error(`[ERR] ${method} ${originalUrl} ${Date.now() - start}ms`, error.stack)

        return throwError(() => error)
      }),
    )
  }
}