import { Expose } from 'class-transformer'

export class UserResponseDto {
  @Expose() id!: string
  @Expose() email!: string
  @Expose() name!: string
  @Expose() phone?: string | null
  @Expose() address?: string | null
  @Expose() postalCode?: string | null
  @Expose() city?: string | null
  @Expose() country?: string | null
}
