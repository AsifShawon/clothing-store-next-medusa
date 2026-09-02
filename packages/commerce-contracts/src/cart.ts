import { ImageView } from "./catalog"
import { CurrencyCode, MoneyView } from "./money"

export interface CartLineView {
  id: string
  productId: string
  productTitle: string
  productHandle: string
  variantId: string
  variantTitle: string
  sku: string
  thumbnail?: ImageView
  unitPrice: MoneyView
  totalPrice: MoneyView
  quantity: number
  maxQuantity?: number
  options: Record<string, string>
  isSoldOut?: boolean
  isPriceChanged?: boolean
}

export interface PromotionView {
  id: string
  code: string
  description?: string
  discountType: "percentage" | "fixed"
  amount: number
  formattedDiscount: string
}

export interface CartTotalsView {
  subtotal: MoneyView
  discount: MoneyView
  shipping: MoneyView
  total: MoneyView
  tax?: MoneyView
  freeShippingThreshold?: MoneyView
  freeShippingRemaining?: MoneyView
  isFreeShippingUnlocked?: boolean
}

export interface CartView {
  id: string
  items: CartLineView[]
  itemsCount: number
  totals: CartTotalsView
  appliedPromotions: PromotionView[]
  currencyCode: CurrencyCode
  regionName?: string
}

export interface AddCartItemInput {
  productId: string
  variantId: string
  quantity: number
}

export interface CartActions {
  addItem(input: AddCartItemInput): Promise<void>
  updateItem(lineId: string, quantity: number): Promise<void>
  removeItem(lineId: string): Promise<void>
  applyPromotion(code: string): Promise<{ success: boolean; message?: string }>
  removePromotion(code: string): Promise<void>
  clearCart?(): Promise<void>
}
