import { Injectable } from '@nestjs/common'
import createOrder from '../../services/orders/create.js'
import getOrders from '../../services/orders/get-many.js'
import type { User } from '../../types/domain.js'

type OrderInput = Parameters<typeof createOrder>[0]

@Injectable()
export class OrdersService {
  async create(order: OrderInput, user: User) {
    const orderId = await createOrder(order, user)

    const [created] = await getOrders({ ordersIds: [orderId], user })

    return created
  }

  list(user: User) {
    return getOrders({ user })
  }
}
