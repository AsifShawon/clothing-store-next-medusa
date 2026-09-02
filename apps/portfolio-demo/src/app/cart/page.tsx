"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useDemoCart } from "@lib/demo-store-context"
import { CartView } from "@dtc/storefront-ui"
import { DEFAULT_DEMO_CAPABILITIES } from "@dtc/commerce-contracts"
import { toCartView } from "../../adapters/local-storage/cart"
import { demoRoutes } from "../../adapters/local-storage/routes"

export default function CartPage() {
  const {
    items,
    subtotal,
    discount,
    appliedPromo,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useDemoCart()

  const [promoError, setPromoError] = useState("")

  const cartView = useMemo(
    () => toCartView(items, subtotal, discount, undefined, appliedPromo?.code),
    [items, subtotal, discount, appliedPromo]
  )

  const handleApplyPromo = (code: string) => {
    setPromoError("")
    const res = applyPromoCode(code)
    if (!res.success) {
      setPromoError(res.message)
      return false
    }
  }

  return (
    <CartView
      cart={cartView}
      onUpdateQuantity={updateItemQuantity}
      onRemoveItem={removeItem}
      onClearCart={clearCart}
      onApplyPromoCode={handleApplyPromo}
      onRemovePromoCode={removePromoCode}
      promoError={promoError}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      linkComponent={Link}
    />
  )
}
