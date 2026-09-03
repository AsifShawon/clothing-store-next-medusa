"use client"

import React from "react"
import Link from "next/link"
import {
  AddressFormView,
  CartItemView,
  CartTotalsView,
  ShippingMethodView,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { AddressForm } from "../components/checkout/AddressForm"
import { ShippingMethodSelect } from "../components/checkout/ShippingMethodSelect"
import { PaymentSection } from "../components/checkout/PaymentSection"
import { OrderReview } from "../components/checkout/OrderReview"
import { OrderSummary } from "../components/cart/OrderSummary"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { LinkComponent } from "../types"

export interface CheckoutViewProps {
  email: string
  onEmailChange: (email: string) => void
  shippingAddress: AddressFormView
  onShippingAddressChange: (address: AddressFormView) => void
  addressErrors?: Partial<Record<keyof AddressFormView, string>>
  onSaveContactAndAddress?: (address: AddressFormView, email: string) => Promise<void> | void
  isSavingAddress?: boolean
  canContinueToShipping?: boolean
  shippingMethods: ShippingMethodView[]
  selectedShippingMethodId?: string
  onSelectShippingMethod: (id: string) => void
  isSelectingShipping?: boolean
  canContinueToPayment?: boolean
  isInitializingPayment?: boolean
  selectedPaymentMethodId?: string
  onSelectPaymentMethod?: (id: string) => Promise<void> | void
  paymentSlot: React.ReactNode
  items: CartItemView[]
  totals: CartTotalsView
  promotions?: Array<{ code: string; description?: string }>
  onApplyPromoCode?: (code: string) => Promise<boolean | void> | boolean | void
  onRemovePromoCode?: (code: string) => Promise<void> | void
  promoError?: string
  checkoutError?: string | null
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  onPlaceOrder: () => void | Promise<void>
  isPlacingOrder?: boolean
  canPlaceOrder?: boolean
  submitButtonSlot?: React.ReactNode
  linkComponent?: LinkComponent
}

export function CheckoutView({
  email,
  onEmailChange,
  shippingAddress,
  onShippingAddressChange,
  addressErrors = {},
  onSaveContactAndAddress,
  isSavingAddress = false,
  canContinueToShipping = true,
  shippingMethods,
  selectedShippingMethodId,
  onSelectShippingMethod,
  isSelectingShipping = false,
  canContinueToPayment = true,
  isInitializingPayment = false,
  selectedPaymentMethodId,
  onSelectPaymentMethod,
  paymentSlot,
  items,
  totals,
  promotions = [],
  onApplyPromoCode,
  onRemovePromoCode,
  promoError,
  checkoutError,
  routes,
  capabilities,
  onPlaceOrder,
  isPlacingOrder = false,
  canPlaceOrder = true,
  submitButtonSlot,
  linkComponent: LinkComp = Link,
}: CheckoutViewProps) {
  const selectedShipping = shippingMethods.find((s) => s.id === selectedShippingMethodId)


  return (
    <div className="bg-white min-h-screen py-8 sm:py-14">
      <div className="content-container">
        {/* Checkout Header Navigation */}
        <div className="border-b border-brand-border pb-5 mb-8 sm:mb-12 flex items-center justify-between">
          <LinkComp
            href={routes.cart()}
            className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-primary flex items-center gap-1.5 transition-colors"
          >
            <span>← Return to Bag</span>
          </LinkComp>

          <span className="font-display text-xl sm:text-2xl text-brand-primary tracking-tight">
            Checkout
          </span>

          <span className="text-[11px] font-heading font-semibold text-emerald-800 uppercase tracking-widest bg-emerald-50 border border-emerald-200 px-2.5 py-1">
            🔒 Secure Step
          </span>
        </div>

        {/* 2-Column Checkout Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Flow Column (7 cols) */}
          <div className="lg:col-span-7 space-y-10">
            {checkoutError && (
              <div
                className="p-4 bg-red-50 border border-rose-300 text-rose-800 text-xs font-medium flex items-start gap-2"
                data-testid="checkout-error-banner"
              >
                <span className="font-bold">⚠️</span>
                <div>{checkoutError}</div>
              </div>
            )}

            {/* Step 1: Customer Contact */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs font-heading font-bold flex items-center justify-center">
                  1
                </span>
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
                  Contact Information
                </h3>
              </div>
              <Input
                label="Email Address for Order & Delivery Updates"
                type="email"
                value={email}
                onChange={(e) => onEmailChange(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </section>

            {/* Step 2: Delivery Address */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs font-heading font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
                  Shipping Address (Bangladesh)
                </h3>
              </div>
              <AddressForm
                formData={shippingAddress}
                onChange={onShippingAddressChange}
                errors={addressErrors}
              />
              {onSaveContactAndAddress && (
                <div className="pt-2 flex justify-end">
                  <Button
                    type="button"
                    onClick={() => onSaveContactAndAddress(shippingAddress, email)}
                    isLoading={isSavingAddress}
                    disabled={isSavingAddress}
                    variant="secondary"
                    className="h-10 text-xs font-bold uppercase tracking-wider"
                    data-testid="save-address-button"
                  >
                    {canContinueToShipping ? "Update Saved Address" : "Save Address & Continue →"}
                  </Button>
                </div>
              )}
            </section>

            {/* Step 3: Delivery Options */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs font-heading font-bold flex items-center justify-center">
                  3
                </span>
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
                  Delivery Method
                </h3>
              </div>
              {!canContinueToShipping ? (
                <div className="p-4 bg-brand-surface border border-brand-border text-xs text-brand-muted">
                  Please complete and save your contact information and shipping address to view available delivery options.
                </div>
              ) : (
                <ShippingMethodSelect
                  methods={shippingMethods}
                  selectedId={selectedShippingMethodId}
                  onSelect={onSelectShippingMethod}
                  disabled={isSelectingShipping}
                />
              )}
            </section>

            {/* Step 4: Payment Method (Provider-Specific Container Slot) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-brand-border pb-3">
                <span className="w-5 h-5 rounded-full bg-brand-primary text-white text-xs font-heading font-bold flex items-center justify-center">
                  4
                </span>
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
                  Payment Details
                </h3>
              </div>
              {!canContinueToPayment ? (
                <div className="p-4 bg-brand-surface border border-brand-border text-xs text-brand-muted">
                  Please save your shipping address and select a delivery option to view payment details.
                </div>
              ) : (
                <PaymentSection paymentSlot={paymentSlot} />
              )}
            </section>

            {/* Step 5: Order Review & Place Order */}
            <section className="space-y-6 pt-4 border-t border-brand-border">
              <OrderReview
                email={email}
                shippingAddress={shippingAddress}
                shippingMethod={selectedShipping}
                items={items}
              />

              <div>
                {submitButtonSlot || (
                  <Button
                    type="button"
                    onClick={onPlaceOrder}
                    disabled={!canPlaceOrder || isPlacingOrder}
                    isLoading={isPlacingOrder}
                    variant="primary"
                    className="w-full h-12 text-xs font-bold uppercase tracking-widest shadow-md"
                  >
                    Confirm &amp; Place Order ({totals.total.formatted})
                  </Button>
                )}
                <p className="text-[11px] text-brand-muted text-center mt-2.5">
                  By confirming your order, you agree to London Boy&apos;s Terms of Service and 24-Hour Return Guarantee.
                </p>
              </div>
            </section>
          </div>

          {/* Right Sticky Order Summary (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <OrderSummary
              totals={totals}
              promotions={promotions}
              onApplyPromoCode={onApplyPromoCode}
              onRemovePromoCode={onRemovePromoCode}
              promoError={promoError}
              capabilities={capabilities}
              checkoutButtonSlot={<div />} // Omit duplicate button in sidebar during checkout
            />
          </div>
        </div>
      </div>
    </div>
  )
}
