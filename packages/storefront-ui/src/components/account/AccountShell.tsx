"use client"

import React from "react"
import Link from "next/link"
import clsx from "clsx"
import { CustomerView, StoreRoutes } from "@dtc/commerce-contracts"
import {
  MapPinIcon,
  PackageIcon,
  SignOutIcon,
  UserIcon,
} from "../icons"
import { LinkComponent } from "../../types"

export interface AccountShellProps {
  customer: CustomerView
  currentPath?: string
  routes: StoreRoutes
  onLogout?: () => void | Promise<void>
  children: React.ReactNode
  linkComponent?: LinkComponent
}

export function AccountShell({
  customer,
  currentPath = "",
  routes,
  onLogout,
  children,
  linkComponent: LinkComp = Link,
}: AccountShellProps) {
  const navItems = [
    {
      label: "Overview",
      href: routes.account(),
      icon: UserIcon,
      isActive: currentPath === routes.account() || currentPath.endsWith("/account"),
    },
    {
      label: "Profile",
      href: routes.accountProfile?.() || "/account/profile",
      icon: UserIcon,
      isActive: currentPath.includes("/profile"),
    },
    {
      label: "Addresses",
      href: routes.accountAddresses?.() || "/account/addresses",
      icon: MapPinIcon,
      isActive: currentPath.includes("/addresses"),
    },
    {
      label: "Orders",
      href: routes.accountOrders?.() || "/account/orders",
      icon: PackageIcon,
      isActive: currentPath.includes("/orders") || currentPath.includes("/order"),
    },
  ]

  return (
    <div className="bg-white min-h-[80vh] py-10 sm:py-16">
      <div className="content-container max-w-6xl mx-auto space-y-10">
        {/* Header greeting banner */}
        <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
          <div>
            {customer.isSimulatedDemo && (
              <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-brand-accent block mb-1">
                Portfolio Demonstration Environment
              </span>
            )}
            <h1 className="font-display text-3xl sm:text-4xl text-brand-primary">
              Welcome, {customer.firstName} {customer.lastName}
            </h1>
            <p className="text-xs text-brand-muted mt-1">
              Manage your personal details, Dhaka shipping addresses, and bespoke order receipts.
            </p>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="text-xs text-brand-muted hover:text-rose-700 flex items-center gap-1.5 transition-colors self-start sm:self-auto"
            >
              <SignOutIcon className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          )}
        </div>

        {/* 2-Column Account Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Sidebar Nav (3 cols) */}
          <nav aria-label="Account Menu" className="md:col-span-3 space-y-1 border border-brand-border bg-brand-surface p-2">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <LinkComp
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-heading font-semibold transition-colors",
                    item.isActive
                      ? "bg-brand-primary text-white"
                      : "text-brand-primary hover:bg-brand-secondary"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </LinkComp>
              )
            })}

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-heading font-semibold text-rose-700 hover:bg-rose-50 transition-colors"
              >
                <SignOutIcon className="w-4 h-4" />
                <span>Log out</span>
              </button>
            )}
          </nav>

          {/* Main Content Area (9 cols) */}
          <main className="md:col-span-9">
            {children}
          </main>
        </div>

        {/* Customer Support Footer Banner */}
        <div className="border-t border-brand-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div>
            <span className="font-heading font-bold text-brand-primary block">
              Have questions about an order or sizing?
            </span>
            <p className="text-[11px] mt-0.5">
              Our Dhaka client advisors are available 7 days a week from 10:00 AM – 10:00 PM.
            </p>
          </div>
          <LinkComp
            href={routes.contact ? routes.contact() : "/contact"}
            className="px-5 py-2.5 border border-brand-border hover:border-brand-primary text-brand-primary font-heading font-semibold uppercase tracking-wider text-xs transition-colors flex-shrink-0"
          >
            Contact Customer Support
          </LinkComp>
        </div>
      </div>
    </div>
  )
}
