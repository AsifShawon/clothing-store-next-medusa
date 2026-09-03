"use client"

import React from "react"
import Link from "next/link"
import { OrderView, StoreRoutes } from "@dtc/commerce-contracts"
import { PackageIcon } from "../icons"
import { LinkComponent } from "../../types"

export interface AccountOrdersProps {
  orders: OrderView[]
  routes: StoreRoutes
  linkComponent?: LinkComponent
  getOrderDetailHref?: (id: string) => string
}

export function AccountOrders({
  orders,
  routes,
  linkComponent: LinkComp = Link,
  getOrderDetailHref,
}: AccountOrdersProps) {
  return (
    <div className="bg-white border border-brand-border p-6 space-y-6">
      <div className="border-b border-brand-border pb-4">
        <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
          Order History
        </h2>
        <p className="text-xs text-brand-muted mt-0.5">
          View all bespoke orders, dispatch timelines, and receipts.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="py-16 text-center space-y-4 max-w-sm mx-auto">
          <PackageIcon className="w-10 h-10 text-brand-muted mx-auto" />
          <h3 className="font-heading font-bold text-sm text-brand-primary">
            No Orders Found
          </h3>
          <p className="text-xs text-brand-muted">
            You haven&apos;t placed any orders yet. Explore our tailoring collections.
          </p>
          <div className="pt-2">
            <LinkComp
              href={routes.catalog()}
              className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-black transition-colors"
            >
              Start Shopping
            </LinkComp>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-brand-border border border-brand-border">
          {orders.map((order) => {
            const detailHref = getOrderDetailHref
              ? getOrderDetailHref(order.id)
              : routes.order
              ? routes.order(order.id)
              : `/account/order?id=${order.id}`

            return (
              <div
                key={order.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-brand-surface transition-colors text-xs"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-brand-primary">
                      #{order.displayId || order.id}
                    </span>
                    <span className="px-2 py-0.5 bg-brand-surface border border-brand-border text-[10px] font-heading font-bold uppercase tracking-wider text-brand-primary">
                      {order.status}
                    </span>
                    <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-heading font-bold uppercase tracking-wider">
                      {order.paymentStatus}
                    </span>
                  </div>

                  <p className="text-brand-muted">
                    Placed on{" "}
                    {new Date(order.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}{" "}
                    • {order.items.length} {order.items.length === 1 ? "garment" : "garments"}
                  </p>

                  {order.shippingAddress && (
                    <p className="text-[11px] text-brand-muted">
                      Destination: {order.shippingAddress.address1}, {order.shippingAddress.city}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span className="font-mono font-bold text-sm text-brand-primary">
                    {order.total.formatted}
                  </span>
                  <LinkComp
                    href={detailHref}
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                  >
                    View Details
                  </LinkComp>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
