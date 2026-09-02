"use client"

import React from "react"
import Link from "next/link"
import { CustomerView, OrderView, RegisterFormData, StoreRoutes } from "@dtc/commerce-contracts"
import { AccountShell } from "../components/account/AccountShell"
import { AccountOverview } from "../components/account/AccountOverview"
import { LoginPrompt } from "../components/account/LoginPrompt"
import { LinkComponent } from "../types"

export interface AccountViewProps {
  customer?: CustomerView | null
  isLoggedIn?: boolean
  isSimulatedDemo?: boolean
  onDemoLogin?: () => void
  onLogin?: (email: string, pass: string) => Promise<void> | void
  onRegister?: (data: RegisterFormData) => Promise<void> | void

  onLogout?: () => void | Promise<void>
  recentOrders?: OrderView[]
  routes: StoreRoutes
  currentPath?: string
  children?: React.ReactNode
  linkComponent?: LinkComponent
}

export function AccountView({
  customer,
  isLoggedIn = false,
  isSimulatedDemo = false,
  onDemoLogin,
  onLogin,
  onRegister,
  onLogout,
  recentOrders = [],
  routes,
  currentPath,
  children,
  linkComponent: LinkComp = Link,
}: AccountViewProps) {
  if (!isLoggedIn || !customer) {
    return (
      <LoginPrompt
        isSimulatedDemo={isSimulatedDemo}
        onDemoLogin={onDemoLogin}
        onLogin={onLogin}
        onRegister={onRegister}
      />
    )
  }

  return (
    <AccountShell
      customer={customer}
      currentPath={currentPath}
      routes={routes}
      onLogout={onLogout}
      linkComponent={LinkComp}
    >
      {children || (
        <AccountOverview
          customer={customer}
          recentOrders={recentOrders}
          routes={routes}
          linkComponent={LinkComp}
        />
      )}
    </AccountShell>
  )
}
