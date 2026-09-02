import { ImageView } from "./catalog"
import { AddressView, ShippingOptionView } from "./checkout"
import { MoneyView } from "./money"

export interface OrderLineView {
  id: string
  productId: string
  productTitle: string
  productHandle?: string
  variantTitle: string
  sku: string
  thumbnail?: ImageView
  unitPrice: MoneyView
  totalPrice: MoneyView
  quantity: number
}

export type OrderStatusView =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "canceled"

export type OrderPaymentStatusView =
  | "pending"
  | "authorized"
  | "captured"
  | "refunded"
  | "failed"

export interface OrderTimelineStep {
  title: string
  description?: string
  timestamp?: string
  isCompleted: boolean
  isCurrent: boolean
}

export interface OrderView {
  id: string
  displayId: string
  status: OrderStatusView
  paymentStatus: OrderPaymentStatusView
  createdAt: string
  items: OrderLineView[]
  shippingAddress: AddressView
  shippingOption: ShippingOptionView
  paymentMethod: string
  paymentDetails?: {
    simulatedMethod?: string
    transactionReference?: string
    last4?: string
  }
  itemSubtotal: MoneyView
  discountTotal: MoneyView
  shippingTotal: MoneyView
  total: MoneyView
  appliedPromotionCode?: string
  trackingNumber?: string
  courier?: string
  notes?: string
  isGuestOrder?: boolean
  timeline?: OrderTimelineStep[]
}
