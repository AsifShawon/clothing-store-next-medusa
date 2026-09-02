"use client"

import React, { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useDemoAdmin } from "@lib/demo-store-context"
import { DemoOrderStatus, DemoPaymentStatus } from "@lib/types"
import { formatBDT, formatDateTime } from "@lib/utils"
import { StatusBadge } from "@components/admin/status-badge"
import {
  ArrowLeft,
  BuildingStorefront,
  TruckFast,
  User,
  ShoppingBag,
  ArrowPath,
  XMark,
  Check,
} from "@medusajs/icons"

function AdminOrderDetailContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("id")
  const { state, updateOrderStatus, cancelOrder, refundOrder, updateOrderTracking } = useDemoAdmin()
  const { orders } = state

  const order = useMemo(() => {
    if (!orderId) return orders[0] || null
    return orders.find((o) => o.id === orderId || o.displayId === orderId) || orders[0] || null
  }, [orders, orderId])

  const [trackingNumber, setTrackingNumber] = useState("")
  const [carrier, setCarrier] = useState("Pathao Courier")
  const [isAssigningTracking, setIsAssigningTracking] = useState(false)

  if (!order) {
    return (
      <div className="p-16 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-2xl text-brand-primary">Order Not Found</h2>
        <p className="text-xs text-grey-50">
          The requested order ID was not found in browser demo storage.
        </p>
        <Link
          href="/demo-admin/orders"
          className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
        >
          Return to All Orders
        </Link>
      </div>
    )
  }

  const handleAttachTracking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trackingNumber.trim()) return
    updateOrderTracking(order.id, trackingNumber.trim(), carrier)
    setTrackingNumber("")
    setIsAssigningTracking(false)
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <Link
          href="/demo-admin/orders"
          className="text-xs text-grey-50 hover:text-brand-primary flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Orders</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-border pb-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="font-display text-3xl text-brand-primary">{order.displayId}</h1>
              <StatusBadge status={order.status} />
              <StatusBadge status={order.paymentStatus} type="payment" />
            </div>
            <p className="text-xs text-grey-50 mt-1">
              Placed on {formatDateTime(order.createdAt)} • ID: <code className="font-mono text-[11px]">{order.id}</code>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/order?id=${order.id}`}
              target="_blank"
              className="px-3.5 py-2 bg-white border border-brand-border text-xs font-semibold text-brand-primary hover:bg-brand-secondary flex items-center gap-1.5 rounded transition-colors"
            >
              <BuildingStorefront className="w-3.5 h-3.5 text-brand-accent" />
              <span>Customer Receipt</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Fulfillment Operations & Ordered Items */}
        <div className="lg:col-span-8 space-y-6">
          {/* Status & Operations Panel */}
          <div className="bg-white border border-brand-border p-6 space-y-5">
            <h2 className="font-heading font-bold text-base text-brand-primary border-b border-brand-border pb-3 uppercase tracking-wider">
              Fulfillment Operations & Status
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-primary block">
                  Order Fulfillment Status
                </label>
                <select
                  value={order.status}
                  disabled={order.status === "canceled"}
                  onChange={(e) => updateOrderStatus(order.id, e.target.value as DemoOrderStatus)}
                  className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary disabled:opacity-50"
                >
                  <option value="pending">Pending Dispatch</option>
                  <option value="processing">Processing & Packaged</option>
                  <option value="shipped">Handed to Courier (Shipped)</option>
                  <option value="delivered">Delivered to Recipient</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-brand-primary block">
                  Payment Settlement Status
                </label>
                <select
                  value={order.paymentStatus}
                  onChange={(e) =>
                    updateOrderStatus(order.id, order.status, e.target.value as DemoPaymentStatus)
                  }
                  className="w-full px-3 py-2 text-xs border border-brand-border bg-brand-surface text-brand-primary focus:outline-none focus:border-brand-primary"
                >
                  <option value="pending">Payment Pending (Cash on Delivery)</option>
                  <option value="paid">Settled / Paid</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>

            {/* Quick Actions (Tracking, Cancel, Refund) */}
            <div className="pt-3 border-t border-brand-border flex flex-wrap items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => setIsAssigningTracking(!isAssigningTracking)}
                className="px-3.5 py-2 bg-brand-secondary border border-brand-border text-brand-primary font-semibold hover:bg-brand-sand flex items-center gap-1.5 rounded transition-colors"
              >
                <TruckFast className="w-3.5 h-3.5 text-brand-accent" />
                <span>{isAssigningTracking ? "Close Tracking Form" : "Attach Courier Tracking"}</span>
              </button>

              {order.status !== "canceled" && (
                <button
                  type="button"
                  onClick={() => {
                    if (
                      confirm(
                        `Are you sure you want to cancel order ${order.displayId}? Allocated stock will be restored to warehouse inventory.`
                      )
                    ) {
                      cancelOrder(order.id)
                    }
                  }}
                  className="px-3.5 py-2 bg-rose-50 border border-rose-200 text-rose-700 font-semibold hover:bg-rose-100 flex items-center gap-1.5 rounded transition-colors"
                >
                  <XMark className="w-3.5 h-3.5" />
                  <span>Cancel Order & Restore Stock</span>
                </button>
              )}

              {order.paymentStatus !== "refunded" && (
                <button
                  type="button"
                  onClick={() => refundOrder(order.id)}
                  className="px-3.5 py-2 bg-amber-50 border border-amber-200 text-amber-800 font-semibold hover:bg-amber-100 flex items-center gap-1.5 rounded transition-colors"
                >
                  <span>Simulate Refund</span>
                </button>
              )}
            </div>

            {/* Tracking Assignment Form */}
            {isAssigningTracking && (
              <form
                onSubmit={handleAttachTracking}
                className="p-4 bg-brand-surface border border-brand-border rounded space-y-3 animate-enter text-xs"
              >
                <span className="font-bold text-brand-primary block">Assign Courier Tracking Reference:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-grey-50 block mb-1">Courier Carrier</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-brand-border"
                    >
                      <option value="Pathao Courier">Pathao Courier</option>
                      <option value="Steadfast Courier">Steadfast Courier</option>
                      <option value="Paperfly">Paperfly</option>
                      <option value="RedX">RedX Logistics</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-grey-50 block mb-1">Tracking Consignment Number</label>
                    <input
                      type="text"
                      required
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. PTH-884920"
                      className="w-full px-3 py-2 bg-white border border-brand-border font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAssigningTracking(false)}
                    className="px-3 py-1.5 border border-brand-border text-grey-60"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-brand-primary text-white font-semibold hover:bg-brand-accent transition-colors"
                  >
                    Save Tracking
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Ordered Line Items */}
          <div className="bg-white border border-brand-border overflow-hidden">
            <div className="p-4 bg-brand-surface border-b border-brand-border font-heading font-bold text-xs text-brand-primary uppercase tracking-wider flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-brand-accent" />
              <span>Allocated Garments ({order.items.length})</span>
            </div>

            <div className="divide-y divide-brand-border/60">
              {order.items.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4">
                  <div className="relative w-16 h-20 bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden">
                    <Image src={item.thumbnail} alt={item.productTitle} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-xs font-bold text-brand-primary block">{item.productTitle}</span>
                    <span className="text-[11px] text-grey-50">{item.variantTitle}</span>
                    <span className="text-[11px] text-grey-40 block font-mono">SKU: {item.sku}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold text-brand-primary block">
                      {formatBDT(item.unitPrice)}
                    </span>
                    <span className="text-[11px] text-grey-50 block">Qty: {item.quantity}</span>
                    <span className="text-xs font-bold text-brand-primary block mt-1 font-mono">
                      {formatBDT(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customer Details & Financial Breakdown */}
        <div className="lg:col-span-4 space-y-6">
          {/* Customer Card */}
          <div className="bg-white border border-brand-border p-6 space-y-4 text-xs">
            <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-2 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-accent" />
              <span>Customer & Destination</span>
            </h3>
            <div>
              <span className="text-grey-40 block">Customer Name</span>
              <span className="font-bold text-brand-primary mt-0.5 block">
                {order.customer.firstName} {order.customer.lastName}
              </span>
            </div>
            <div>
              <span className="text-grey-40 block">Contact Information</span>
              <p className="text-grey-70 mt-0.5 font-mono">{order.customer.phone}</p>
              <p className="text-grey-70">{order.customer.email}</p>
            </div>
            <div className="pt-2 border-t border-brand-border/60">
              <span className="text-grey-40 block">Delivery Address</span>
              <p className="text-grey-70 mt-0.5">{order.shippingAddress.address1}</p>
              {order.shippingAddress.address2 && <p className="text-grey-70">{order.shippingAddress.address2}</p>}
              <p className="text-grey-70">
                {order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.postalCode}
              </p>
            </div>
            {order.notes && (
              <div className="p-3 bg-brand-surface border border-brand-border text-brand-primary text-[11px] rounded">
                <strong>Customer Notes:</strong> {order.notes}
              </div>
            )}
          </div>

          {/* Financial Breakdown */}
          <div className="bg-white border border-brand-border p-6 space-y-3 text-xs">
            <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider border-b border-brand-border pb-2">
              Financial Breakdown
            </h3>
            <div className="space-y-2 text-grey-70">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-brand-primary">{formatBDT(order.itemSubtotal)}</span>
              </div>
              {order.discountTotal > 0 && (
                <div className="flex justify-between text-brand-accent font-semibold">
                  <span>Coupon Discount ({order.appliedPromotionCode || "Promo"})</span>
                  <span>-{formatBDT(order.discountTotal)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({order.shippingOption.name})</span>
                <span className="font-semibold text-brand-primary">{formatBDT(order.shippingTotal)}</span>
              </div>
              <div className="pt-3 border-t border-brand-border flex justify-between text-base font-bold text-brand-primary">
                <span>Total (BDT)</span>
                <span>{formatBDT(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DemoAdminOrderDetailPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs text-grey-50">Loading order management...</div>}>
      <AdminOrderDetailContent />
    </Suspense>
  )
}
