"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { useDemoCustomer, useDemoOrders } from "@lib/demo-store-context"
import { AccountOrders, AccountShell, AuthShell, LoginPrompt } from "@dtc/storefront-ui"
import { toCustomerView } from "../../../adapters/local-storage/account"
import { toOrderView } from "../../../adapters/local-storage/cart"
import { demoRoutes } from "../../../adapters/local-storage/routes"

export default function AccountOrdersPage() {
  const { customer, isLoggedIn, loginAsDemoCustomer, logoutCustomer } = useDemoCustomer()
  const { orders } = useDemoOrders()

  const customerOrders = useMemo(
    () =>
      orders
        .filter((o) => o.customer.id === customer.id || o.customerId === customer.id)
        .map(toOrderView),
    [orders, customer.id]
  )

  const totalSpent = useMemo(
    () => customerOrders.reduce((sum, o) => sum + (o.total.amount || 0), 0),
    [customerOrders]
  )

  const customerView = useMemo(
    () => toCustomerView(customer, customerOrders.length, totalSpent),
    [customer, customerOrders.length, totalSpent]
  )

  if (!isLoggedIn) {
    return (
      <AuthShell
        title="Order History"
        subtitle="This is a portfolio demonstration environment. Sign in with the seeded customer session to view simulated orders."
      >
        <LoginPrompt isSimulatedDemo onDemoLogin={loginAsDemoCustomer} />
      </AuthShell>
    )
  }


  return (
    <AccountShell
      customer={customerView}
      currentPath="/account/orders"
      routes={demoRoutes}
      onLogout={logoutCustomer}
      linkComponent={Link}
    >
      <AccountOrders
        orders={customerOrders}
        routes={demoRoutes}
        linkComponent={Link}
        getOrderDetailHref={(id) => `/account/order?id=${id}`}
      />
    </AccountShell>
  )
}
