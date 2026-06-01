import { Type } from 'class-transformer'
import {
  ArrayNotEmpty,
  IsArray,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator'
import deliveryMethods from '../../constants/delivery-methods.js'
import paymentMethods from '../../constants/payment-methods.js'
import countries from '../../constants/countries.js'

const deliveryIds = deliveryMethods.map(m => m.id)
const paymentIds = paymentMethods.map(m => m.id)
const countryNames = countries.map(c => c.name)

class DeliveryDto {
  @IsIn(deliveryIds)
  method!: string
}

class PaymentDto {
  @IsIn(paymentIds)
  method!: string
}

class AddressDto {
  @IsOptional() @IsIn(countryNames)
  country?: string

  @IsString() @IsNotEmpty()
  city!: string

  @IsString() @IsNotEmpty()
  postalCode!: string

  @IsString() @IsNotEmpty()
  street!: string
}

class ShippingDetailsDto {
  @ValidateNested() @Type(() => AddressDto)
  address!: AddressDto

  @IsString() @IsNotEmpty()
  email!: string

  @IsString() @IsNotEmpty()
  phone!: string

  @IsOptional() @IsString() @IsNotEmpty()
  notes?: string
}

class ProductRefDto {
  @IsString() @IsNotEmpty()
  id!: string
}

class OrderItemDto {
  @ValidateNested() @Type(() => ProductRefDto)
  product!: ProductRefDto

  @IsNumber() @IsPositive()
  quantity!: number
}

export class CreateOrderDto {
  @ValidateNested() @Type(() => DeliveryDto)
  delivery!: DeliveryDto

  @ValidateNested() @Type(() => PaymentDto)
  payment!: PaymentDto

  @IsOptional() @IsNumber() @IsPositive()
  totalPrice?: number

  @ValidateNested() @Type(() => ShippingDetailsDto)
  shippingDetails!: ShippingDetailsDto

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items!: OrderItemDto[]
}
