import { Injectable } from '@nestjs/common'
import getProducts from '../../services/products/get-many.js'

/**
 * Delegates to the existing products service (multi-table join). Kept as a
 * single implementation during the migration; the query logic moves in-module
 * when the legacy layer is removed (Phase 5).
 */
@Injectable()
export class ProductsService {
  findAll() {
    return getProducts()
  }
}
