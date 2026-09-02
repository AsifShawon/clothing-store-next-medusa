import React from "react"
import { AddressFormView, CartItemView, ShippingMethodView } from "@dtc/commerce-contracts"
import { MapPinIcon, TruckIcon } from "../icons"

export interface OrderReviewProps {
  email: string
  shippingAddress: AddressFormView
  shippingMethod?: ShippingMethodView
  items: CartItemView[]
  onEditAddress?: () => void
  onEditShipping?: () => void
}

export function OrderReview({
  email,
  shippingAddress,
  shippingMethod,
  items: _items,
  onEditAddress,
  onEditShipping,
}: OrderReviewProps) {
  return (
    <div className="space-y-4 text-xs">
      {/* Contact & Shipping Summary Card */}
      <div className="border border-brand-border bg-brand-surface p-4 space-y-4">
        {/* Recipient & Address */}
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-brand-border">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 font-heading font-semibold uppercase tracking-wider text-brand-primary text-[11px]">
              <MapPinIcon className="w-3.5 h-3.5" />
              <span>Delivery Destination</span>
            </div>
            <p className="font-bold text-brand-primary">
              {shippingAddress.firstName} {shippingAddress.lastName} • {shippingAddress.phone}
            </p>
            <p className="text-brand-muted">
              {shippingAddress.address1}
              {shippingAddress.address2 ? `, ${shippingAddress.address2}` : ""},{" "}
              {shippingAddress.city} {shippingAddress.postalCode}
            </p>
            <p className="text-[11px] text-brand-muted">Email updates: {email}</p>
          </div>
          {onEditAddress && (
            <button
              type="button"
              onClick={onEditAddress}
              className="text-xs font-semibold text-brand-accent hover:underline uppercase tracking-wider"
            >
              Edit
            </button>
          )}
        </div>

        {/* Shipping Method */}
        {shippingMethod && (
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-heading font-semibold uppercase tracking-wider text-brand-primary text-[11px]">
                <TruckIcon className="w-3.5 h-3.5" />
                <span>Selected Delivery Courier</span>
              </div>
              <p className="font-semibold text-brand-primary">
                {shippingMethod.name} — {shippingMethod.price.formatted}
              </p>
              {shippingMethod.estimatedDays && (
                <p className="text-[11px] text-brand-muted">
                  Estimated Arrival: {shippingMethod.estimatedDays}
                </p>
              )}
            </div>
            {onEditShipping && (
              <button
                type="button"
                onClick={onEditShipping}
                className="text-xs font-semibold text-brand-accent hover:underline uppercase tracking-wider"
              >
                Edit
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
