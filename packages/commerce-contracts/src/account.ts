import { AddressView } from "./checkout"
import { MoneyView } from "./money"

export interface CustomerAddressView extends AddressView {
  id: string
  isDefaultShipping?: boolean
  isDefaultBilling?: boolean
}

export interface CustomerView {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  defaultAddress?: AddressView
  addresses?: CustomerAddressView[]
  lifetimeOrdersCount?: number
  totalSpent?: MoneyView
  isSimulatedDemo?: boolean
}

export type AuthViewMode = "sign-in" | "register" | "forgot-password" | "reset-password"

export interface LoginFormData {
  email: string
  password?: string
}

export interface RegisterFormData {
  firstName: string
  lastName: string
  email: string
  password?: string
  phone?: string
}

export interface ForgotPasswordFormData {
  email: string
}

export interface ResetPasswordFormData {
  password: string
  confirmPassword: string
  token?: string
  email?: string
}

export interface CustomerActions {
  login(email: string, password?: string): Promise<{ success: boolean; error?: string }>
  register(input: RegisterFormData): Promise<{ success: boolean; error?: string }>
  logout(): Promise<void>
  updateProfile(input: {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    defaultAddress?: AddressView
  }): Promise<void>
  saveAddress?(address: AddressView, addressId?: string): Promise<void>
  deleteAddress?(addressId: string): Promise<void>
}
