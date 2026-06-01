import { ArrayNotEmpty, IsArray, IsNotEmpty, IsString } from 'class-validator'

export class AddProductsDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  productsIds!: string[]
}
