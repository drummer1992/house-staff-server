import { Controller, Get } from '@nestjs/common'
import { CollectionsService } from './collections.service.js'

@Controller('collections')
export class CollectionsController {
  constructor(private readonly collections: CollectionsService) {}

  @Get()
  findAll() {
    return this.collections.findAll()
  }
}
