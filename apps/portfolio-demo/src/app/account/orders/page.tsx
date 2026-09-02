"use client"

import React from "react"
import Link from "next/link"
import { useDemoCustomer, useDemoOrders } from "@lib/demo-store-context"
import { formatBDT } from "@lib/utils"
import { ShoppingBag, ArrowRight, User } from "@medusajs/icons"

export default function AccountOrdersPage() {
  const { customer, isLoggedIn, loginAsDemoCustomer } = useDemoCustomer()
  const { orders } = useDemoOrders()

  if (!isLoggedIn) {
    return (
      <div className="content-container py-20 text-center max-w-md mx-auto space-y-4">
        <h1 className="font-display text-2xl text-brand-primary">Sign In to View Orders</h1>
        <p className="text-xs text-grey-50">
          Please select demo customer mode to view your demonstration orders.
        </p>
        <button
          type="button"
          onClick={loginAsDemoCustomer}
          className="px-6 py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors"
        >
          Continue as Demo Customer
        </button>
      </div>
    )
  }

  const customerOrders = orders.filter(
    (o) => o.customer.id === customer.id || o.customerId === customer.id
  )

  return (
    <div className="content-container py-10 sm:py-16 space-y-8 max-w-5xl">
      {/* Breadcrumb & Title */}
      <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-grey-50 flex items-center gap-2 mb-2">
            <Link href="/account" className="hover:text-brand-primary">
              Account
            </Link>
            <span>/</span>
            <span className="text-brand-primary font-medium">Orders</span>
          </nav>
          <h1 className="font-display text-3xl text-brand-primary">Order History</h1>
          <p className="text-xs text-grey-50 mt-1">
            All orders placed under customer account <strong>{customer.email}</strong>.
          </p>
        </div>
      </div>

      {customerOrders.length === 0 ? (
        <div className="py-20 text-center bg-white border border-brand-border p-8 space-y-4 max-w-md mx-auto">
          <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center mx-auto text-grey-40">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h3 className="font-heading font-bold text-lg text-brand-primary">No Orders Found</h3>
          <p className="text-xs text-grey-50">
            You have not placed any garments in this demonstration session yet.
          </p>
          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="divide-y divide-brand-border bg-white border border-brand-border">
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-surface transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-brand-primary">{order.displayId}</span>
                    <span className="px-2 py-0.5 bg-brand-secondary text-brand-primary text-[10px] font-bold uppercase rounded">
                      {order.status}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase rounded">
                      {order.paymentStatus}
                    </span>
                  </div>
                  <p className="text-xs text-grey-60">
                    Placed on {order.createdAt.substring(0, 10)} • {order.items.length} {order.items.length === 1 ? "item" : "items"}
                  </p>
                  <p className="text-[11px] text-grey-50">
                    Destination: {order.shippingAddress.address1}, {order.shippingAddress.city} ({order.shippingOption.name})
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="font-bold text-base text-brand-primary font-mono">
                    {formatBDT(order.total)}
                  </span>
                  <Link
                    href={`/account/order?id=${order.id}`}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
