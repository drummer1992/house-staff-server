import { Global, Module } from '@nestjs/common'
import { DatabaseService } from './database.service.js'
import { LoggerModule } from '../logger/logger.module.js'

@Global()
@Module({
  imports  : [LoggerModule],
  providers: [DatabaseService],
  exports  : [DatabaseService],
})
export class DatabaseModule {
}
