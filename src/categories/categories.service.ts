import { Injectable } from '@nestjs/common'
import { CategoriesRepository } from './categories.repository.js'

@Injectable()
export class CategoriesService {
  constructor(private readonly categories: CategoriesRepository) {
  }

  findAll() {
    return this.categories.findAll()
  }
}
