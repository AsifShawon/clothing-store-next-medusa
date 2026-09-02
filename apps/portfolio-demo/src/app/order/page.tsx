"use client"

import React, { useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useDemoOrders } from "@lib/demo-store-context"
import { Price } from "@components/store/price"
import { OrderTimeline } from "@components/store/order-timeline"
import { formatBDT, formatDateTime } from "@lib/utils"
import {
  Check,
  BuildingStorefront,
  ArrowRight,
  ShieldCheck,
  TruckFast,
  User,
  ShoppingBag,
} from "@medusajs/icons"

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
        <p className="text-xs text-grey-50">
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

  return (
    <div className="content-container py-10 sm:py-16 space-y-10 max-w-4xl">
      {/* Confirmation Hero Banner */}
      <div className="bg-brand-primary text-white p-6 sm:p-10 border border-brand-primary space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-brand-accent text-white flex items-center justify-center flex-shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-brand-sand">
              Simulated Order Confirmed
            </span>
            <h1 className="font-display text-2xl sm:text-3xl text-white">
              Thank You for Your Order
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-grey-30 max-w-xl leading-relaxed">
          Order <strong>{order.displayId}</strong> has been confirmed and registered in your browser demo environment. All variant allocations were updated at the Dhaka Central Warehouse.
        </p>

        {/* Quick Admin Action */}
        <div className="pt-3 flex flex-wrap items-center gap-3">
          <Link
            href={`/demo-admin/order?id=${order.id}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            <BuildingStorefront className="w-3.5 h-3.5" />
            <span>Inspect in Demo Admin Panel</span>
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Fulfillment Status Stepper */}
      <OrderTimeline status={order.status} createdAt={order.createdAt} />

      {/* Main Order Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
        {/* Customer & Address Details */}
        <div className="bg-white border border-brand-border p-6 space-y-4">
          <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-accent" />
            <span>Recipient & Delivery Destination</span>
          </h3>
          <div className="space-y-2 text-grey-70">
            <p className="font-bold text-brand-primary">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.address1}</p>
            {order.shippingAddress.address2 && <p>{order.shippingAddress.address2}</p>}
            <p>
              {order.shippingAddress.city} {order.shippingAddress.postalCode && `- ${order.shippingAddress.postalCode}`}, {order.shippingAddress.country}
            </p>
            <p className="pt-1 text-grey-50 font-mono">
              Phone: {order.shippingAddress.phone} • Email: {order.shippingAddress.email}
            </p>
          </div>
        </div>

        {/* Delivery Method & Payment Simulation */}
        <div className="bg-white border border-brand-border p-6 space-y-4">
          <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
            <TruckFast className="w-4 h-4 text-brand-accent" />
            <span>Shipping & Simulated Payment</span>
          </h3>
          <div className="space-y-3 text-grey-70">
            <div>
              <span className="text-grey-40 block font-medium">Delivery Option:</span>
              <span className="font-bold text-brand-primary">{order.shippingOption.name}</span>
              <span className="text-[11px] text-grey-50 block">Estimated: {order.shippingOption.estimatedDelivery}</span>
            </div>
            <div>
              <span className="text-grey-40 block font-medium">Payment Mode:</span>
              <span className="font-bold text-brand-primary capitalize">
                {order.paymentMethod === "cod"
                  ? "Cash on Delivery (COD)"
                  : order.paymentMethod === "test_card"
                  ? "Demo Card (Simulated)"
                  : "Demo Mobile Banking (bKash/Nagad)"}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px] uppercase">
                Payment Status: {order.paymentStatus}
              </span>
            </div>
            {order.paymentDetails?.transactionReference && (
              <p className="font-mono text-[10px] text-grey-40">
                Ref: {order.paymentDetails.transactionReference}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Ordered Line Items */}
      <div className="bg-white border border-brand-border p-6 space-y-4">
        <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-brand-accent" />
          <span>Garment Specifications & Quantities</span>
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
                <p className="font-mono text-[11px] text-grey-40">SKU: {item.sku}</p>
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

        {/* Invoice Breakdown */}
        <div className="pt-4 border-t border-brand-border space-y-2 text-xs text-grey-70">
          <div className="flex justify-between">
            <span>Items Subtotal</span>
            <span className="font-semibold text-brand-primary">{formatBDT(order.itemSubtotal)}</span>
          </div>
          {order.discountTotal > 0 && (
            <div className="flex justify-between text-brand-accent font-semibold">
              <span>Promotion Discount ({order.appliedPromotionCode || "Coupon"})</span>
              <span>-{formatBDT(order.discountTotal)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery Fee ({order.shippingOption.name})</span>
            <span className="font-semibold text-brand-primary">{formatBDT(order.shippingTotal)}</span>
          </div>
          <div className="flex justify-between text-base font-bold text-brand-primary pt-3 border-t border-brand-border">
            <span>Total Paid / Payable</span>
            <span>{formatBDT(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Order Receipt...</div>}>
      <OrderConfirmationContent />
    </Suspense>
  )
}
