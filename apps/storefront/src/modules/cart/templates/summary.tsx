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
          <svg className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.25V3.75A1.125 1.125 0 0013.125 2.625H4.875A1.125 1.125 0 003.75 3.75v10.5h10.5" />
          </svg>
          <span>Inside Dhaka Delivery: ৳60 (24–48h)</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span>24-Hour Return &amp; Exchange Guarantee</span>
        </div>
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-brand-accent flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
          </svg>
          <span>Cash on Delivery (COD) Available</span>
        </div>
      </div>
    </div>
  )
}

export default Summary
