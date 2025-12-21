export interface Cart {
  userId: number
  items: CartItem[]
  totalPrice: number
}

export interface CartItem {
  productId: number
  title: string
  unitPrice: number
  quantity: number
  totalPrice: number
  imageUrl: string
}
