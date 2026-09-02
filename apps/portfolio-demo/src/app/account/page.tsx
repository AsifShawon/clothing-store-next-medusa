"use client"

import React, { useMemo } from "react"
import Link from "next/link"
import { useDemoCustomer, useDemoOrders } from "@lib/demo-store-context"
import {
  AccountAddresses,
  AccountOverview,
  AccountProfile,
  AccountShell,
  LoginPrompt,
} from "@dtc/storefront-ui"
import { toCustomerView } from "../../adapters/local-storage/account"
import { toOrderView } from "../../adapters/local-storage/cart"
import { demoRoutes } from "../../adapters/local-storage/routes"

export default function AccountPage() {
  const { customer, isLoggedIn, loginAsDemoCustomer, logoutCustomer, updateCustomerProfile } =
    useDemoCustomer()
  const { orders } = useDemoOrders()

  // Filter orders for this customer
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
      <LoginPrompt
        isSimulatedDemo
        onDemoLogin={loginAsDemoCustomer}
      />
    )
  }

  const handleUpdateProfile = (data: {
    firstName: string
    lastName: string
    email: string
    phone?: string
  }) => {
    updateCustomerProfile({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone || customer.phone,
    })
  }

  const handleSaveAddress = (address: any) => {
    updateCustomerProfile({
      defaultAddress: {
        firstName: address.firstName,
        lastName: address.lastName,
        email: customer.email,
        phone: address.phone,
        address1: address.address1,
        address2: address.address2,
        city: address.city,
        postalCode: address.postalCode,
        country: "Bangladesh",
      },
    })
  }

  return (
    <AccountShell
      customer={customerView}
      currentPath="/account"
      routes={demoRoutes}
      onLogout={logoutCustomer}
      linkComponent={Link}
    >
      <div className="space-y-10">
        <AccountOverview
          customer={customerView}
          recentOrders={customerOrders}
          routes={demoRoutes}
          linkComponent={Link}
        />

        <div className="grid grid-cols-1 gap-8">
          <AccountProfile
            customer={customerView}
            onUpdateProfile={handleUpdateProfile}
          />
          <AccountAddresses
            customer={customerView}
            onSaveAddress={handleSaveAddress}
          />
        </div>
      </div>
    </AccountShell>
  )
}
