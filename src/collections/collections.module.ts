import { Module } from '@nestjs/common'
import { CollectionsController } from './collections.controller.js'
import { CollectionsService } from './collections.service.js'
import { CollectionsRepository } from './collections.repository.js'

@Module({
  controllers: [CollectionsController],
  providers  : [CollectionsService, CollectionsRepository],
})
export class CollectionsModule {
}
