"use client"

import React, { useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useDemoCustomer, useDemoOrders } from "@lib/demo-store-context"
import { OrderTimeline } from "@components/store/order-timeline"
import { formatBDT, formatDateTime } from "@lib/utils"
import {
  ArrowLeft,
  TruckFast,
  User,
  ShoppingBag,
  ExclamationCircle,
} from "@medusajs/icons"

function AccountOrderDetailContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id") || ""
  const { customer, isLoggedIn } = useDemoCustomer()
  const { getOrder, orders } = useDemoOrders()

  const order = useMemo(() => {
    if (!orderId) return null
    return getOrder(orderId)
  }, [orderId, getOrder])

  // Customer authorization isolation check
  const isAuthorized = useMemo(() => {
    if (!order) return false
    if (!isLoggedIn) return false
    // Match customer ID or customer email
    return (
      order.customer.id === customer.id ||
      order.customerId === customer.id ||
      order.customer.email.toLowerCase() === customer.email.toLowerCase()
    )
  }, [order, customer, isLoggedIn])

  if (!isLoggedIn) {
    return (
      <div className="content-container py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-display text-2xl text-brand-primary">Authentication Required</h2>
        <p className="text-xs text-grey-50">
          Please log into your demo customer account to view order details.
        </p>
        <Link
          href="/account"
          className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
        >
          Customer Portal
        </Link>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="content-container py-24 text-center max-w-md mx-auto space-y-4">
        <h2 className="font-display text-2xl text-brand-primary">Order Not Found</h2>
        <p className="text-xs text-grey-50">
          We could not locate this order in local demo storage.
        </p>
        <Link
          href="/account/orders"
          className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
        >
          Back to Order History
        </Link>
      </div>
    )
  }

  // Unauthorized access guard: user is viewing an order belonging to a different fictional customer
  if (!isAuthorized) {
    return (
      <div className="content-container py-20 text-center max-w-md mx-auto space-y-4">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-900 rounded space-y-2">
          <div className="flex items-center justify-center gap-2 font-bold text-sm">
            <ExclamationCircle className="w-5 h-5 text-rose-600" />
            <span>Unauthorized Order Access</span>
          </div>
          <p className="text-xs text-rose-700 leading-relaxed">
            This order ({order.displayId}) belongs to a different customer record. Customer account access is isolated to your own demonstration orders.
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

  return (
    <div className="content-container py-10 sm:py-16 space-y-8 max-w-4xl">
      {/* Header & Breadcrumbs */}
      <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-grey-50 flex items-center gap-2 mb-2">
            <Link href="/account" className="hover:text-brand-primary">
              Account
            </Link>
            <span>/</span>
            <Link href="/account/orders" className="hover:text-brand-primary">
              Orders
            </Link>
            <span>/</span>
            <span className="text-brand-primary font-medium">{order.displayId}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl text-brand-primary">Order {order.displayId}</h1>
            <span className="px-2.5 py-0.5 bg-brand-secondary text-brand-primary text-xs font-bold uppercase rounded">
              {order.status}
            </span>
          </div>
          <p className="text-xs text-grey-50 mt-1">
            Placed on {formatDateTime(order.createdAt)}
          </p>
        </div>

        <Link
          href="/account/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-grey-60 hover:text-brand-primary"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Fulfillment Status Timeline */}
      <OrderTimeline status={order.status} createdAt={order.createdAt} />

      {/* Shipping & Payment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        <div className="bg-white border border-brand-border p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-accent" />
            <span>Delivery Destination</span>
          </h3>
          <div className="text-grey-70 space-y-1">
            <p className="font-bold text-brand-primary">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.postalCode} • {order.shippingAddress.country}
            </p>
            <p className="pt-1 text-grey-50">Phone: {order.shippingAddress.phone}</p>
          </div>
        </div>

        <div className="bg-white border border-brand-border p-6 space-y-3">
          <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-2 flex items-center gap-2">
            <TruckFast className="w-4 h-4 text-brand-accent" />
            <span>Fulfillment & Payment</span>
          </h3>
          <div className="text-grey-70 space-y-1.5">
            <div>
              <span className="text-grey-40 block">Delivery Method:</span>
              <span className="font-bold text-brand-primary">{order.shippingOption.name}</span>
            </div>
            <div>
              <span className="text-grey-40 block">Payment Mode:</span>
              <span className="font-bold text-brand-primary capitalize">
                {order.paymentMethod === "cod" ? "Cash on Delivery" : "Simulated Digital Payment"}
              </span>
            </div>
            <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] uppercase">
              Payment Status: {order.paymentStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Ordered Line Items Table */}
      <div className="bg-white border border-brand-border p-6 space-y-4">
        <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-brand-accent" />
          <span>Garments in this Order ({order.items.length})</span>
        </h3>

        <div className="divide-y divide-brand-border">
          {order.items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 flex gap-4 items-center">
              <div className="relative w-16 h-20 bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden">
                <Image src={item.thumbnail} alt={item.productTitle} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-xs">
                <h4 className="font-bold text-brand-primary truncate">{item.productTitle}</h4>
                <p className="text-grey-50 mt-0.5">{item.variantTitle}</p>
                <p className="font-mono text-[10px] text-grey-40">SKU: {item.sku}</p>
              </div>
              <div className="text-right text-xs">
                <span className="font-bold text-brand-primary block">{formatBDT(item.totalPrice)}</span>
                <span className="text-grey-50 text-[11px]">
                  {formatBDT(item.unitPrice)} × {item.quantity}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice Summary */}
        <div className="pt-4 border-t border-brand-border space-y-2 text-xs text-grey-70">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-semibold text-brand-primary">{formatBDT(order.itemSubtotal)}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-brand-accent font-semibold">
              <span>Promotion Discount</span>
              <span>-{formatBDT(order.discountTotal)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee</span>
            <span className="font-semibold text-brand-primary">{formatBDT(order.shippingTotal)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-brand-primary pt-3 border-t border-brand-border">
            <span>Total Amount</span>
            <span>{formatBDT(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AccountOrderDetailPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Order Invoice...</div>}>
      <AccountOrderDetailContent />
    </Suspense>
  )
}
