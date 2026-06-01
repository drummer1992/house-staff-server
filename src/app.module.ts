import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'
import { AppConfigModule } from './config/config.module.js'
import { DatabaseModule } from './database/database.module.js'
import { LoggerModule } from './logger/logger.module.js'
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

@Module({
  imports: [
    AppConfigModule,
    DatabaseModule,
    LoggerModule,
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
    // Global filter mapping legacy ApiError classes (thrown by reused services)
    // to HTTP responses.
    { provide: APP_FILTER, useClass: ApiErrorFilter },
  ],
})
export class AppModule {}
