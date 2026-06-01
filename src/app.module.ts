import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { LoggerModule } from 'nestjs-pino'
import { loggerConfig } from './logger/logger.config.js'
import { AppConfigModule } from './config/config.module.js'
import { DatabaseModule } from './database/database.module.js'
import { AuthModule } from './auth/auth.module.js'
import { OptionsModule } from './options/options.module.js'
import { CategoriesModule } from './categories/categories.module.js'
import { CollectionsModule } from './collections/collections.module.js'
import { ProductsModule } from './products/products.module.js'
import { UsersModule } from './users/users.module.js'
import { WishlistModule } from './wishlist/wishlist.module.js'
import { OrdersModule } from './orders/orders.module.js'
import { HealthModule } from './health/health.module.js'
import { ApiErrorFilter } from './common/api-error.filter.js'
import { ConfigService } from '@nestjs/config'

@Module({
  imports  : [
    LoggerModule.forRootAsync({
      inject    : [ConfigService],
      useFactory: (config: ConfigService) => loggerConfig(
        config.get('NODE_ENV'),
        config.get('LOG_LEVEL'),
      ),
    }),
    AppConfigModule,
    DatabaseModule,
    AuthModule,
    OptionsModule,
    CategoriesModule,
    CollectionsModule,
    ProductsModule,
    UsersModule,
    WishlistModule,
    OrdersModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: ApiErrorFilter },
  ],
})
export class AppModule {
}
