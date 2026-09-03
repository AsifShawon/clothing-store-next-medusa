"use client"

import React from "react"
import Link from "next/link"
import { OrderView, StoreRoutes } from "@dtc/commerce-contracts"
import { CheckIcon, MapPinIcon, ShieldCheckIcon, TruckIcon } from "../components/icons"
import { CartItemList } from "../components/cart/CartItemList"
import { LinkComponent } from "../types"

export interface OrderConfirmationViewProps {
  order: OrderView
  routes: StoreRoutes
  linkComponent?: LinkComponent
}

export function OrderConfirmationView({
  order,
  routes,
  linkComponent: LinkComp = Link,
}: OrderConfirmationViewProps) {
  const displayId = order.displayId || order.id
  const customerEmail = order.email || order.shippingAddress?.email || "your email"
  const shippingMethod = order.shippingOption || order.shippingMethod
  const subtotal = order.itemSubtotal || order.totals?.subtotal
  const discount = order.discountTotal || order.totals?.discount
  const shipping = order.shippingTotal || order.totals?.shipping || shippingMethod?.price
  const total = order.total || order.totals?.total

  return (
    <div className="bg-white min-h-screen py-12 sm:py-20">
      <div className="content-container max-w-3xl mx-auto space-y-10">
        {/* Celebration Header */}
        <div className="text-center space-y-4 pb-8 border-b border-brand-border">
          <div className="w-14 h-14 bg-emerald-100 text-emerald-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckIcon className="w-7 h-7" />
          </div>
          <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-accent block">
            Receipt &amp; Dispatch Confirmation
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-primary">
            Thank you for your order.
          </h1>
          <p className="text-xs sm:text-sm text-brand-muted max-w-md mx-auto leading-relaxed">
            Order <strong>#{displayId}</strong> is confirmed and being prepared at our Dhaka fulfillment center. A confirmation has been sent to <strong>{customerEmail}</strong>.
          </p>
        </div>

        {/* Order Meta Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-brand-surface border border-brand-border text-xs">
          <div>
            <span className="text-[10px] font-heading uppercase text-brand-muted block">Order ID</span>
            <span className="font-mono font-bold text-brand-primary">#{displayId}</span>
          </div>
          <div>
            <span className="text-[10px] font-heading uppercase text-brand-muted block">Date</span>
            <span className="font-heading text-brand-primary">
              {new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-heading uppercase text-brand-muted block">Payment</span>
            <span className="font-heading font-semibold text-emerald-800 capitalize">
              {order.paymentStatus}
            </span>
          </div>
          <div>
            <span className="text-[10px] font-heading uppercase text-brand-muted block">Fulfillment</span>
            <span className="font-heading font-semibold text-brand-primary capitalize">
              {(order.fulfillmentStatus || "confirmed").replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Ordered Items */}
        <div className="space-y-4">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
            Purchased Garments ({order.items.length})
          </h3>
          <div className="border border-brand-border bg-white px-4">
            <CartItemList items={order.items} linkComponent={LinkComp} />
          </div>
        </div>

        {/* Summary Breakdown & Shipping Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Details */}
          {order.shippingAddress && (
            <div className="p-5 border border-brand-border bg-brand-surface space-y-3 text-xs">
              <div className="flex items-center gap-1.5 font-heading font-bold uppercase tracking-wider text-brand-primary text-[11px]">
                <MapPinIcon className="w-3.5 h-3.5" />
                <span>Delivery Address</span>
              </div>
              <p className="font-bold text-brand-primary">
                {order.shippingAddress.firstName} {order.shippingAddress.lastName} • {order.shippingAddress.phone}
              </p>
              <p className="text-brand-muted leading-relaxed">
                {order.shippingAddress.address1}
                {order.shippingAddress.address2 ? `, ${order.shippingAddress.address2}` : ""},{" "}
                {order.shippingAddress.city} {order.shippingAddress.postalCode}
              </p>

              {shippingMethod && (
                <div className="pt-2 border-t border-brand-border flex items-center gap-2 text-brand-primary">
                  <TruckIcon className="w-4 h-4 text-brand-accent" />
                  <span>{shippingMethod.name}</span>
                </div>
              )}
            </div>
          )}

          {/* Totals Breakdown */}
          <div className="p-5 border border-brand-border bg-brand-surface space-y-2.5 text-xs">
            <h4 className="font-heading font-bold uppercase tracking-wider text-brand-primary text-[11px] pb-2 border-b border-brand-border">
              Financial Breakdown
            </h4>
            {subtotal && (
              <div className="flex justify-between text-brand-primary">
                <span>Subtotal</span>
                <span className="font-bold">{subtotal.formatted}</span>
              </div>
            )}
            {discount && (
              <div className="flex justify-between text-emerald-700">
                <span>Discount</span>
                <span className="font-bold">-{discount.formatted}</span>
              </div>
            )}
            <div className="flex justify-between text-brand-primary">
              <span>Delivery Fee</span>
              <span>{shipping ? shipping.formatted : "৳0"}</span>
            </div>
            {total && (
              <div className="pt-2 border-t border-brand-border flex justify-between items-baseline font-heading font-bold text-sm text-brand-primary">
                <span>Total Paid</span>
                <span className="text-base">{total.formatted}</span>
              </div>
            )}
          </div>
        </div>

        {/* 24-Hour Exchange Reassurance */}
        <div className="p-4 bg-brand-secondary border border-brand-border text-xs flex items-center gap-3">
          <ShieldCheckIcon className="w-5 h-5 text-brand-accent flex-shrink-0" />
          <p className="text-brand-muted">
            Remember, every London Boy purchase includes our <strong>24-Hour Door-to-Door Size Exchange Guarantee</strong> across Dhaka.
          </p>
        </div>

        {/* Return to Store CTA */}
        <div className="pt-4 text-center">
          <LinkComp
            href={routes.catalog()}
            className="inline-block px-8 py-3.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors shadow-sm"
          >
            Continue Shopping
          </LinkComp>
        </div>
      </div>
    </div>
  )
}
