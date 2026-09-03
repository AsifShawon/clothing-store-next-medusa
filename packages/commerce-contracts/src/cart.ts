import { ImageView } from "./catalog"
import { CurrencyCode, MoneyView } from "./money"

export interface CartLineView {
  id: string
  productId: string
  productTitle: string
  title?: string
  subtitle?: string
  productHandle: string
  variantId: string
  variantTitle: string
  sku: string
  thumbnail?: ImageView
  unitPrice: MoneyView
  totalPrice: MoneyView
  originalTotalPrice?: MoneyView
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

export type CartItemView = CartLineView

export interface CartTotalsView {
  subtotal: MoneyView
  discount?: MoneyView
  shipping?: MoneyView
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
  promotions?: PromotionView[]
  currencyCode: CurrencyCode
  regionName?: string
}

export interface AddCartItemInput {
  productId: string
  variantId: string
  quantity: number
}

export interface QuickAddRequest {
  productId: string
  variantId: string
  quantity: number
}

export interface QuickAddResult {
  success: boolean
  message?: string
}

export type QuickAddHandler = (req: QuickAddRequest) => Promise<QuickAddResult>

export interface CartActions {
  addItem(input: AddCartItemInput): Promise<void>
  updateItem(lineId: string, quantity: number): Promise<void>
  removeItem(lineId: string): Promise<void>
  applyPromotion(code: string): Promise<{ success: boolean; message?: string }>
  removePromotion(code: string): Promise<void>
  clearCart?(): Promise<void>
}
