import { Injectable, LoggerService } from '@nestjs/common'
import { getLogger } from '../../utils/logger.js'

@Injectable()
export class AppLogger implements LoggerService {
  private get logger() {
    return getLogger()
  }

  log(...args: any[]) {
    this.logger.print('log', args)
  }

  warn(...args: any[]) {
    this.logger.print('warn', args)
  }

  error(...args: unknown[]): void {
    this.logger.print('error', args)
  }
}