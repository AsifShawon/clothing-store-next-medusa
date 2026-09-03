"use client"

import React from "react"
import Link from "next/link"
import { CartView as CartModel, StoreCapabilities, StoreRoutes } from "@dtc/commerce-contracts"
import { CartItemList } from "../components/cart/CartItemList"
import { OrderSummary } from "../components/cart/OrderSummary"
import { ArrowRightIcon, ShoppingBagIcon } from "../components/icons"
import { LinkComponent } from "../types"

export interface CartViewProps {
  cart: CartModel
  onUpdateQuantity?: (id: string, qty: number) => void
  onRemoveItem?: (id: string) => void
  onClearCart?: () => void
  onApplyPromoCode?: (code: string) => Promise<boolean | void> | boolean | void
  onRemovePromoCode?: (code: string) => Promise<void> | void
  promoError?: string
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  onProceedToCheckout?: () => void
  checkoutButtonSlot?: React.ReactNode
  linkComponent?: LinkComponent
}

export function CartView({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onApplyPromoCode,
  onRemovePromoCode,
  promoError,
  routes,
  capabilities,
  onProceedToCheckout,
  checkoutButtonSlot,
  linkComponent: LinkComp = Link,
}: CartViewProps) {
  const hasItems = cart.items && cart.items.length > 0

  if (!hasItems) {
    return (
      <div className="bg-white min-h-[60vh] flex items-center justify-center py-16">
        <div className="content-container text-center max-w-lg mx-auto space-y-5">
          <div className="w-16 h-16 bg-brand-surface rounded-full flex items-center justify-center mx-auto text-brand-muted border border-brand-border">
            <ShoppingBagIcon className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="font-display text-3xl sm:text-4xl text-brand-primary">
              Your Shopping Bag is Empty
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              You haven&apos;t added any British smart-casual clothing to your bag yet. Explore our authentic heavyweight tees, oxford shirts, and chinos.
            </p>
          </div>
          <div className="pt-2">
            <LinkComp
              href={routes.catalog()}
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors shadow-sm"
            >
              <span>Explore Catalog</span>
              <ArrowRightIcon className="w-4 h-4" />
            </LinkComp>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="content-container space-y-10">
        {/* Page Title & Breadcrumb */}
        <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl text-brand-primary">
              Shopping Bag
            </h1>
            <p className="text-xs sm:text-sm text-brand-muted mt-1">
              Review your selected garments, apply promotion codes, and calculate Dhaka delivery rates.
            </p>
          </div>

          {onClearCart && (
            <button
              type="button"
              onClick={onClearCart}
              className="text-xs text-brand-muted hover:text-rose-700 underline font-medium self-start sm:self-auto transition-colors"
            >
              Clear entire bag
            </button>
          )}
        </div>

        {/* 2-Column Cart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Items List (7 cols) */}
          <div className="lg:col-span-7">
            <CartItemList
              items={cart.items}
              onUpdateQuantity={onUpdateQuantity}
              onRemoveItem={onRemoveItem}
              linkComponent={LinkComp}
              getItemHref={(item) => (item.productHandle ? routes.product(item.productHandle) : "#")}
            />
          </div>

          {/* Sticky Order Summary (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28">
            <OrderSummary
              totals={cart.totals}
              promotions={cart.promotions}
              onApplyPromoCode={onApplyPromoCode}
              onRemovePromoCode={onRemovePromoCode}
              promoError={promoError}
              capabilities={capabilities}
              onProceedToCheckout={onProceedToCheckout}
              checkoutButtonSlot={
                checkoutButtonSlot || (
                  <LinkComp
                    href={routes.checkout()}
                    className="w-full h-12 bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold uppercase tracking-widest flex items-center justify-center transition-colors shadow-sm"
                  >
                    Proceed to Checkout
                  </LinkComp>
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}
