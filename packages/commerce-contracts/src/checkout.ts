import { CartView } from "./cart"
import { MoneyView } from "./money"

export interface AddressView {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  address1: string
  address2?: string
  city: string
  postalCode?: string
  country: string
  province?: string
}

export type AddressFormView = AddressView

export interface ShippingOptionView {
  id: string
  name: string
  description?: string
  price: MoneyView
  estimatedDelivery?: string
  estimatedDays?: string
  isSelected?: boolean
}

export type ShippingMethodView = ShippingOptionView

export interface PaymentOptionView {
  id: string
  name: string
  description?: string
  type: "stripe" | "manual" | "cod" | "test_card" | "mobile_banking" | (string & {})
  isAvailable: boolean
  badge?: string
}

export type CheckoutStep = "contact" | "address" | "shipping" | "payment" | "review"

export interface CheckoutView {
  cart: CartView
  shippingAddress?: AddressView
  billingAddress?: AddressView
  availableShippingOptions: ShippingOptionView[]
  selectedShippingOptionId?: string
  availablePaymentOptions: PaymentOptionView[]
  selectedPaymentOptionId?: string
  notes?: string
  currentStep?: CheckoutStep
  isGuest?: boolean
}

export interface CheckoutAddressInput {
  address: AddressView
  type?: "shipping" | "billing" | "both"
}

export interface PlaceOrderInput {
  paymentOptionId: string
  paymentData?: Record<string, unknown>
  notes?: string
}

export interface PlaceOrderResult {
  success: boolean
  orderId?: string
  displayId?: string
  redirectUrl?: string
  errorMessage?: string
}

export interface CheckoutActions {
  setAddress(input: CheckoutAddressInput): Promise<void>
  selectShipping(optionId: string): Promise<void>
  selectPayment(optionId: string): Promise<void>
  placeOrder(input: PlaceOrderInput): Promise<PlaceOrderResult>
}
