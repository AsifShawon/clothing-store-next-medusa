"use client"

import { convertToLocale } from "@lib/util/money"
import React from "react"

type CartTotalsProps = {
  totals: {
    total?: number | null
    subtotal?: number | null
    tax_total?: number | null
    currency_code: string
    item_subtotal?: number | null
    shipping_subtotal?: number | null
    discount_subtotal?: number | null
  }
}

const CartTotals: React.FC<CartTotalsProps> = ({ totals }) => {
  const {
    currency_code,
    total,
    tax_total,
    item_subtotal,
    shipping_subtotal,
    discount_subtotal,
  } = totals

  return (
    <div className="space-y-3 text-xs">
      <div className="flex items-center justify-between text-brand-primary/80">
        <span>Subtotal</span>
        <span
          className="font-medium text-brand-primary"
          data-testid="cart-subtotal"
          data-value={item_subtotal || 0}
        >
          {convertToLocale({ amount: item_subtotal ?? 0, currency_code })}
        </span>
      </div>

      <div className="flex items-center justify-between text-brand-primary/80">
        <span>Estimated Delivery (Inside/Outside Dhaka)</span>
        <span
          className="font-medium text-brand-primary"
          data-testid="cart-shipping"
          data-value={shipping_subtotal || 0}
        >
          {shipping_subtotal !== undefined && shipping_subtotal !== null && shipping_subtotal > 0
            ? convertToLocale({ amount: shipping_subtotal, currency_code })
            : "Calculated at checkout"}
        </span>
      </div>

      {!!discount_subtotal && discount_subtotal > 0 && (
        <div className="flex items-center justify-between text-brand-accent font-semibold">
          <span>Promotion Discount</span>
          <span
            data-testid="cart-discount"
            data-value={discount_subtotal}
          >
            - {convertToLocale({
              amount: discount_subtotal,
              currency_code,
            })}
          </span>
        </div>
      )}

      {tax_total !== null && tax_total !== undefined && tax_total > 0 && (
        <div className="flex items-center justify-between text-brand-primary/70">
          <span>VAT / Tax (Included)</span>
          <span data-testid="cart-taxes" data-value={tax_total}>
            {convertToLocale({ amount: tax_total, currency_code })}
          </span>
        </div>
      )}

      <div className="border-t border-brand-border/60 pt-3 my-2" />

      <div className="flex items-baseline justify-between text-brand-primary">
        <span className="font-heading font-bold text-sm uppercase tracking-wider">Total</span>
        <span
          className="font-heading font-extrabold text-lg text-brand-primary"
          data-testid="cart-total"
          data-value={total || 0}
        >
          {convertToLocale({ amount: total ?? 0, currency_code })}
        </span>
      </div>
    </div>
  )
}

export default CartTotals
