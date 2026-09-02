/**
 * Strongly typed domain entities for London Boy Portfolio Demo
 */

export interface DemoProductOption {
  id: string
  title: string
  values: string[]
}

export interface DemoProductVariant {
  id: string
  title: string
  sku: string
  options: Record<string, string>
  price: number // in BDT (Bangladeshi Taka)
  usdPrice?: number
  inventoryQuantity: number
  manageInventory: boolean
}

export interface DemoProduct {
  id: string
  title: string
  handle: string
  subtitle?: string
  description: string
  material: string
  status: "published" | "draft"
  collectionHandle?: string
  categoryNames: string[]
  tags: string[]
  images: string[] // static image URLs, no binary / base64
  thumbnail: string
  options: DemoProductOption[]
  variants: DemoProductVariant[]
  metadata?: {
    careInstructions?: string
    fit?: string
    origin?: string
    [key: string]: any
  }
  createdAt: string
  updatedAt: string
}

export interface DemoCategory {
  id: string
  name: string
  handle: string
  description: string
  image?: string
}

export interface DemoCollection {
  id: string
  title: string
  handle: string
  description: string
  image?: string
}

export interface DemoCartItem {
  id: string
  productId: string
  productTitle: string
  productHandle: string
  variantId: string
  variantTitle: string
  sku: string
  options: Record<string, string>
  unitPrice: number
  quantity: number
  thumbnail: string
  maxInventory: number
}

export interface DemoCart {
  items: DemoCartItem[]
  appliedPromotionCode?: string
  updatedAt: string
}

export interface DemoAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  address2?: string
  city: string
  postalCode: string
  country: string
}

export interface DemoCustomer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  ordersCount: number
  totalSpent: number
  defaultAddress?: DemoAddress
  createdAt: string
}

export type DemoOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "canceled"
export type DemoPaymentStatus = "pending" | "authorized" | "paid" | "refunded"
export type DemoFulfillmentStatus = "not_fulfilled" | "partially_fulfilled" | "fulfilled" | "returned"

export interface DemoOrderItem {
  id: string
  productId: string
  productTitle: string
  productHandle: string
  variantId: string
  variantTitle: string
  sku: string
  quantity: number
  unitPrice: number
  totalPrice: number
  thumbnail: string
}

export interface DemoShippingOption {
  id: string
  name: string
  price: number // in BDT
  description: string
  estimatedDelivery: string
}

export interface DemoPromotion {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number // percentage (e.g. 10) or flat BDT amount (e.g. 500)
  minOrderAmount?: number
  description: string
  isActive: boolean
}

export interface DemoOrder {
  id: string
  displayId: string
  createdAt: string
  status: DemoOrderStatus
  paymentStatus: DemoPaymentStatus
  fulfillmentStatus: DemoFulfillmentStatus
  paymentMethod: "cod" | "test_card" | "mobile_banking"
  paymentDetails?: {
    simulatedMethod: string
    transactionReference?: string
    failureReason?: string
  }
  isGuestOrder?: boolean
  customerId?: string
  items: DemoOrderItem[]
  customer: {
    id?: string
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shippingAddress: DemoAddress
  shippingOption: DemoShippingOption
  itemSubtotal: number
  discountTotal: number
  shippingTotal: number
  total: number
  appliedPromotionCode?: string
  appliedPromoCode?: string
  notes?: string
}

export interface DemoSettings {
  storeName: string
  currencyCode: "BDT" | "USD"
  countryCode: "BD"
  warehouseName: string
  warehouseAddress: string
  supportEmail: string
  supportPhone: string
  lowStockThreshold: number
  announcementText?: string
  returnPeriodDays?: number
}

export interface DemoInventoryEvent {
  id: string
  variantId: string
  sku: string
  change: number // +5, -2, etc.
  previousStock: number
  newStock: number
  reason: "order_placement" | "order_cancellation" | "manual_adjustment" | "seed_initialization" | "restock"
  referenceId?: string // orderId or admin action
  timestamp: string
}

export interface DemoActivityEvent {
  id: string
  type: "product_created" | "product_updated" | "product_deleted" | "order_created" | "order_status_updated" | "promo_toggled" | "store_reset"
  description: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface DemoStoreState {
  schemaVersion: number
  initializedAt: string
  updatedAt: string
  products: DemoProduct[]
  categories: DemoCategory[]
  collections: DemoCollection[]
  customers: DemoCustomer[]
  currentCustomerId: string
  cart: DemoCart
  orders: DemoOrder[]
  promotions: DemoPromotion[]
  shippingOptions: DemoShippingOption[]
  settings: DemoSettings
  inventoryEvents: DemoInventoryEvent[]
  activityEvents: DemoActivityEvent[]
}

// Backward compatibility alias types
export type Product = DemoProduct
export type ProductVariant = DemoProductVariant
export type ProductOption = DemoProductOption
export type Category = DemoCategory
export type Collection = DemoCollection
export type CartItem = DemoCartItem
export type ShippingOption = DemoShippingOption
export type Promotion = DemoPromotion
export type Address = DemoAddress
export type OrderStatus = DemoOrderStatus
export type PaymentStatus = DemoPaymentStatus
export type OrderItem = DemoOrderItem
export type Order = DemoOrder
export type Customer = DemoCustomer
export type DemoState = DemoStoreState
