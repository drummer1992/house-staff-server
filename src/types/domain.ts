export interface User {
  id: string
  email: string
  name: string
  phone?: string
  address?: string
  postalCode?: string
  city?: string
  country?: string
}

export interface Country {
  name: string
  code: string
  vatRate: number
}

export interface DeliveryMethod {
  id: string
  name: string
  price: number
}

export interface PaymentMethod {
  id: string
  name: string
}
