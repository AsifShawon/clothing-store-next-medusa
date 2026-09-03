"use client"

import React, { useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useDemoOrders } from "@lib/demo-store-context"
import { OrderConfirmationView } from "@dtc/storefront-ui"
import { toOrderView } from "../../adapters/local-storage/cart"
import { demoRoutes } from "../../adapters/local-storage/routes"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || ""
  const { getOrder, orders } = useDemoOrders()

  const order = useMemo(() => {
    if (!orderId) return orders[0] || null
    return getOrder(orderId)
  }, [orderId, getOrder, orders])

  if (!order) {
    return (
      <div className="content-container py-24 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-2xl text-brand-primary">Order Receipt Not Found</h2>
        <p className="text-xs text-brand-muted">
          We could not locate this order in local storage. It may have been reset or placed in another browser session.
        </p>
        <Link
          href="/shop"
          className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    )
  }

  const orderView = toOrderView(order)

  return (
    <OrderConfirmationView
      order={orderView}
      routes={demoRoutes}
      linkComponent={Link}
    />
  )
}

export default function OrderPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Order...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
