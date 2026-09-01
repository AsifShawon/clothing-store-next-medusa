"use client"

import CartTotals from "@modules/common/components/cart-totals"
import DiscountCode from "@modules/checkout/components/discount-code"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

type SummaryProps = {
  cart: HttpTypes.StoreCart
}

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (!cart?.shipping_methods || cart.shipping_methods.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart }: SummaryProps) => {
  const step = getCheckoutStep(cart)
  const isCartEmpty = !cart?.items || cart.items.length === 0

  return (
    <div className="bg-brand-secondary/40 border border-brand-border p-6 space-y-6">
      <div className="border-b border-brand-border/60 pb-3">
        <h2 className="font-display text-2xl text-brand-primary">Order Summary</h2>
      </div>

      <DiscountCode cart={cart} />

      <div className="border-t border-brand-border/60 pt-4">
        <CartTotals totals={cart} />
      </div>

      <div>
        <LocalizedClientLink
          href={isCartEmpty ? "/store" : "/checkout?step=" + step}
          data-testid="checkout-button"
        >
          <button
            disabled={isCartEmpty}
            className="w-full py-3.5 bg-brand-primary hover:bg-black text-white text-xs font-heading font-semibold uppercase tracking-widest transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Proceed to Checkout →
          </button>
        </LocalizedClientLink>
      </div>

      {/* Trust micro-banner */}
      <div className="pt-2 border-t border-brand-border/60 space-y-2 text-[11px] text-brand-primary/70">
        <div className="flex items-center gap-2">
          <span className="text-brand-accent font-bold">🚚</span>
          <span>Inside Dhaka Delivery: ৳60 (24–48h)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-brand-accent font-bold">🛡️</span>
          <span>24-Hour Return &amp; Exchange Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-brand-accent font-bold">💳</span>
          <span>Cash on Delivery (COD) Available</span>
        </div>
      </div>
    </div>
  )
}

export default Summary
