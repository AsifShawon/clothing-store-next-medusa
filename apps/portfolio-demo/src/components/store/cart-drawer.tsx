"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { CartDrawer as SharedCartDrawer } from "@dtc/storefront-ui"
import { toCartView } from "../../adapters/local-storage/cart"
import { demoRoutes } from "../../adapters/local-storage/routes"

export function CartDrawer() {
  const {
    items,
    subtotal,
    discount,
    appliedPromo,
    updateItemQuantity,
    removeItem,
  } = useDemoCart()

  const { isCartDrawerOpen, setIsCartDrawerOpen } = useDemoStore()

  const cartView = useMemo(
    () => toCartView(items, subtotal, discount, undefined, appliedPromo?.code),
    [items, subtotal, discount, appliedPromo]
  )

  return (
    <SharedCartDrawer
      isOpen={isCartDrawerOpen}
      onClose={() => setIsCartDrawerOpen(false)}
      cart={cartView}
      onUpdateQuantity={updateItemQuantity}
      onRemoveItem={removeItem}
      routes={demoRoutes}
      linkComponent={Link}
    />
  )
}
