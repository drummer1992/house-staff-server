import { Injectable } from '@nestjs/common'
import deliveryMethods from '../../constants/delivery-methods.js'
import paymentMethods from '../../constants/payment-methods.js'
import countries from '../../constants/countries.js'

@Injectable()
export class OptionsService {
  getAll() {
    return { deliveryMethods, paymentMethods, countries }
  }
}
