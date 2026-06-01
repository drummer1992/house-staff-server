import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'

export class UpdateUserDto {
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(255)
  name?: string

  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(255)
  email?: string

  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(50)
  phone?: string

  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(255)
  address?: string

  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(20)
  postalCode?: string

  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100)
  city?: string

  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100)
  country?: string
}
