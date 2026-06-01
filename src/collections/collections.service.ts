import { Injectable } from '@nestjs/common'
import { CollectionsRepository } from './collections.repository.js'

@Injectable()
export class CollectionsService {
  constructor(private readonly collections: CollectionsRepository) {
  }

  findAll() {
    return this.collections.findAll()
  }
}
