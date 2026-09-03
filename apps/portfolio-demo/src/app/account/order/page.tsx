"use client"

import React, { useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useDemoCustomer, useDemoOrders } from "@lib/demo-store-context"
import { AccountShell, LoginPrompt, OrderConfirmationView } from "@dtc/storefront-ui"
import { toCustomerView } from "../../../adapters/local-storage/account"
import { toOrderView } from "../../../adapters/local-storage/cart"
import { demoRoutes } from "../../../adapters/local-storage/routes"

function AccountOrderDetailContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || ""
  const { customer, isLoggedIn, loginAsDemoCustomer, logoutCustomer } = useDemoCustomer()
  const { getOrder, orders } = useDemoOrders()

  const order = useMemo(() => {
    if (!orderId) return null
    return getOrder(orderId)
  }, [orderId, getOrder])

  const isAuthorized = useMemo(() => {
    if (!order || !isLoggedIn) return false
    return (
      order.customer.id === customer.id ||
      order.customerId === customer.id ||
      order.customer.email.toLowerCase() === customer.email.toLowerCase()
    )
  }, [order, customer, isLoggedIn])

  const customerOrders = useMemo(
    () =>
      orders
        .filter((o) => o.customer.id === customer.id || o.customerId === customer.id)
        .map(toOrderView),
    [orders, customer.id]
  )

  const customerView = useMemo(
    () => toCustomerView(customer, customerOrders.length, 0),
    [customer, customerOrders.length]
  )

  if (!isLoggedIn) {
    return <LoginPrompt isSimulatedDemo onDemoLogin={loginAsDemoCustomer} />
  }

  if (!order) {
    return (
      <div className="content-container py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-display text-2xl text-brand-primary">Order Not Found</h2>
        <p className="text-xs text-brand-muted">We could not locate this order in local demo storage.</p>
        <Link
          href="/account/orders"
          className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
        >
          Back to Order History
        </Link>
      </div>
    )
  }

  if (!isAuthorized) {
    return (
      <div className="content-container py-20 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 space-y-2">
          <p className="font-bold text-sm text-rose-800">Unauthorized Order Access</p>
          <p className="text-xs text-rose-700">
            This order belongs to a different customer record. Customer account access is isolated to your own demonstration orders.
          </p>
        </div>
        <Link
          href="/account/orders"
          className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
        >
          Return to My Orders
        </Link>
      </div>
    )
  }

  const orderView = toOrderView(order)

  return (
    <AccountShell
      customer={customerView}
      currentPath="/account/orders"
      routes={demoRoutes}
      onLogout={logoutCustomer}
      linkComponent={Link}
    >
      <div className="space-y-4">
        <Link
          href="/account/orders"
          className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-muted hover:text-brand-primary flex items-center gap-1.5 transition-colors pb-2"
        >
          ← Back to Order History
        </Link>
        <OrderConfirmationView order={orderView} routes={demoRoutes} linkComponent={Link} />
      </div>
    </AccountShell>
  )
}

export default function AccountOrderDetailPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Order...</div>}>
      <AccountOrderDetailContent />
    </Suspense>
  )
}
