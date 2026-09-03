"use client"

import React from "react"
import Link from "next/link"
import { CustomerView, OrderView, StoreRoutes } from "@dtc/commerce-contracts"
import { MapPinIcon, PackageIcon, UserIcon } from "../icons"
import { LinkComponent } from "../../types"

export interface AccountOverviewProps {
  customer: CustomerView
  recentOrders?: OrderView[]
  routes: StoreRoutes
  linkComponent?: LinkComponent
}

export function AccountOverview({
  customer,
  recentOrders = [],
  routes,
  linkComponent: LinkComp = Link,
}: AccountOverviewProps) {
  return (
    <div className="space-y-8">
      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 border border-brand-border bg-brand-surface space-y-1">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-muted block">
            Orders Placed
          </span>
          <span className="font-heading font-bold text-2xl text-brand-primary">
            {customer.lifetimeOrdersCount ?? recentOrders.length}
          </span>
        </div>

        <div className="p-5 border border-brand-border bg-brand-surface space-y-1">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-muted block">
            Total Expenditure
          </span>
          <span className="font-heading font-bold text-2xl text-brand-primary">
            {customer.totalSpent ? customer.totalSpent.formatted : "৳0"}
          </span>
        </div>

        <div className="p-5 border border-brand-border bg-brand-surface space-y-1">
          <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-muted block">
            Account Status
          </span>
          <span className="font-heading font-bold text-base text-emerald-800 flex items-center gap-1.5 pt-1">
            <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
            Verified Customer
          </span>
        </div>
      </div>

      {/* Profile & Default Address 2-Column */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
        {/* Profile Card */}
        <div className="border border-brand-border bg-white p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-brand-primary text-[11px]">
              <UserIcon className="w-3.5 h-3.5" />
              <span>Personal Details</span>
            </div>
            <LinkComp
              href={routes.accountProfile?.() || "/account/profile"}
              className="text-xs font-semibold text-brand-accent hover:underline uppercase tracking-wider"
            >
              Edit
            </LinkComp>
          </div>
          <div className="space-y-1 text-brand-primary">
            <p className="font-bold text-sm">
              {customer.firstName} {customer.lastName}
            </p>
            <p className="text-brand-muted">{customer.email}</p>
            {customer.phone && <p className="text-brand-muted">{customer.phone}</p>}
          </div>
        </div>

        {/* Default Shipping Destination */}
        <div className="border border-brand-border bg-white p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-brand-border">
            <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-brand-primary text-[11px]">
              <MapPinIcon className="w-3.5 h-3.5" />
              <span>Default Shipping Address</span>
            </div>
            <LinkComp
              href={routes.accountAddresses?.() || "/account/addresses"}
              className="text-xs font-semibold text-brand-accent hover:underline uppercase tracking-wider"
            >
              Manage
            </LinkComp>
          </div>
          {customer.defaultAddress ? (
            <div className="space-y-1 text-brand-primary">
              <p className="font-bold">
                {customer.defaultAddress.firstName} {customer.defaultAddress.lastName}
              </p>
              <p className="text-brand-muted">
                {customer.defaultAddress.address1}
                {customer.defaultAddress.address2 ? `, ${customer.defaultAddress.address2}` : ""},{" "}
                {customer.defaultAddress.city} {customer.defaultAddress.postalCode}
              </p>
              {customer.defaultAddress.phone && (
                <p className="text-brand-muted">{customer.defaultAddress.phone}</p>
              )}
            </div>
          ) : (
            <p className="text-xs text-brand-muted">
              No default address saved. Add one to enable 1-click checkout.
            </p>
          )}
        </div>
      </div>

      {/* Recent Orders Preview */}
      <div className="border border-brand-border bg-white space-y-4 p-5">
        <div className="flex items-center justify-between pb-3 border-b border-brand-border">
          <div className="flex items-center gap-2 font-heading font-bold uppercase tracking-wider text-brand-primary text-[11px]">
            <PackageIcon className="w-3.5 h-3.5" />
            <span>Recent Orders</span>
          </div>
          <LinkComp
            href={routes.accountOrders?.() || "/account/orders"}
            className="text-xs font-semibold text-brand-accent hover:underline uppercase tracking-wider"
          >
            View All Orders →
          </LinkComp>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-8 text-center text-xs text-brand-muted">
            You have not placed any orders yet.
          </div>
        ) : (
          <div className="divide-y divide-brand-border">
            {recentOrders.slice(0, 3).map((order) => (
              <div
                key={order.id}
                className="py-3 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-brand-primary">
                    #{order.displayId || order.id}
                  </span>
                  <span className="text-brand-muted ml-2">
                    • {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  </span>
                  <span className="text-[11px] ml-2 px-1.5 py-0.5 bg-brand-surface border border-brand-border capitalize">
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold font-mono text-brand-primary">
                    {order.total.formatted}
                  </span>
                  <LinkComp
                    href={routes.order ? routes.order(order.id) : `/account/order?id=${order.id}`}
                    className="text-brand-accent hover:underline text-xs font-semibold"
                  >
                    View
                  </LinkComp>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
