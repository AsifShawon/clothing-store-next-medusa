"use client"

import React, { useState } from "react"
import { CartTotalsView, StoreCapabilities } from "@dtc/commerce-contracts"
import { BadgeCheckIcon, ShieldCheckIcon, TagIcon, TrashIcon, TruckIcon } from "../icons"
import { Button } from "../ui/button"

export interface OrderSummaryProps {
  totals: CartTotalsView
  promotions?: Array<{
    code: string
    description?: string
  }>
  onApplyPromoCode?: (code: string) => Promise<boolean | void> | boolean | void
  onRemovePromoCode?: (code: string) => Promise<void> | void
  promoError?: string
  capabilities?: StoreCapabilities
  checkoutButtonSlot?: React.ReactNode
  onProceedToCheckout?: () => void
  isSubmitting?: boolean
  className?: string
}

export function OrderSummary({
  totals,
  promotions = [],
  onApplyPromoCode,
  onRemovePromoCode,
  promoError,
  capabilities,
  checkoutButtonSlot,
  onProceedToCheckout,
  isSubmitting = false,
  className = "",
}: OrderSummaryProps) {
  const [inputCode, setInputCode] = useState("")
  const [isLoadingPromo, setIsLoadingPromo] = useState(false)
  const [localError, setLocalError] = useState("")

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputCode.trim() || !onApplyPromoCode) return

    setLocalError("")
    setIsLoadingPromo(true)
    try {
      const result = await onApplyPromoCode(inputCode.trim())
      if (result !== false) {
        setInputCode("")
      }
    } catch (err: any) {
      setLocalError(err.message || "Failed to apply promotional code")
    } finally {
      setIsLoadingPromo(false)
    }
  }

  const activeError = promoError || localError

  return (
    <div className={`bg-brand-surface border border-brand-border p-6 space-y-6 ${className}`}>
      <h3 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider pb-3 border-b border-brand-border">
        Order Summary
      </h3>

      {/* Breakdown lines */}
      <div className="space-y-3 text-xs">
        <div className="flex justify-between text-brand-primary">
          <span>Subtotal</span>
          <span className="font-heading font-bold">{totals.subtotal.formatted}</span>
        </div>

        {totals.discount && (
          <div className="flex justify-between text-emerald-700">
            <span>Promotion Discount</span>
            <span className="font-heading font-bold">-{totals.discount.formatted}</span>
          </div>
        )}

        <div className="flex justify-between text-brand-primary">
          <span>Shipping</span>
          <span className="font-heading">
            {totals.shipping ? totals.shipping.formatted : "Calculated next"}
          </span>
        </div>

        {totals.tax && (
          <div className="flex justify-between text-brand-muted">
            <span>Tax (Included)</span>
            <span>{totals.tax.formatted}</span>
          </div>
        )}

        <div className="pt-3 border-t border-brand-border flex items-baseline justify-between">
          <div>
            <span className="font-heading font-bold text-sm text-brand-primary">Total</span>
            {totals.total.approxUsd && (
              <span className="block text-[11px] text-brand-muted">
                ≈ ${totals.total.approxUsd} USD
              </span>
            )}
          </div>
          <span className="font-heading font-bold text-lg text-brand-primary">
            {totals.total.formatted}
          </span>
        </div>
      </div>

      {/* Promotion Code Section */}
      {capabilities?.hasPromotions !== false && onApplyPromoCode && (
        <div className="pt-2 border-t border-brand-border space-y-3">
          {/* Active Promo Badges */}
          {promotions.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-muted block">
                Applied Offers
              </span>
              {promotions.map((p) => (
                <div
                  key={p.code}
                  className="flex items-center justify-between p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xs"
                >
                  <div className="flex items-center gap-1.5 font-mono font-bold">
                    <TagIcon className="w-3.5 h-3.5" />
                    <span>{p.code}</span>
                  </div>
                  {onRemovePromoCode && (
                    <button
                      type="button"
                      onClick={() => onRemovePromoCode(p.code)}
                      className="text-emerald-700 hover:text-rose-700 p-0.5"
                      aria-label={`Remove promo code ${p.code}`}
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Promo Form */}
          <form onSubmit={handleApply} className="space-y-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputCode}
                onChange={(e) => {
                  setInputCode(e.target.value)
                  if (activeError) setLocalError("")
                }}
                placeholder="Discount code (e.g. LONDON10)"
                className="input-base flex-1 uppercase font-mono text-xs"
              />
              <Button
                type="submit"
                variant="secondary"
                size="small"
                isLoading={isLoadingPromo}
                disabled={!inputCode.trim()}
              >
                Apply
              </Button>
            </div>
            {activeError && (
              <p className="text-[11px] text-rose-700">{activeError}</p>
            )}
          </form>
        </div>
      )}

      {/* Checkout Action Button or Slot */}
      <div className="pt-2">
        {checkoutButtonSlot || (
          <Button
            type="button"
            onClick={onProceedToCheckout}
            isLoading={isSubmitting}
            variant="primary"
            className="w-full h-12 text-xs font-bold uppercase tracking-widest"
          >
            Proceed to Checkout
          </Button>
        )}
      </div>

      {/* Trust Badges */}
      <div className="pt-4 border-t border-brand-border space-y-2 text-[11px] text-brand-muted">
        <div className="flex items-center gap-2">
          <TruckIcon className="w-4 h-4 text-brand-primary flex-shrink-0" />
          <span>Inside Dhaka: 24-48 Hours (৳60)</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheckIcon className="w-4 h-4 text-brand-primary flex-shrink-0" />
          <span>24-Hour door-to-door size exchange in Dhaka</span>
        </div>
        <div className="flex items-center gap-2">
          <BadgeCheckIcon className="w-4 h-4 text-brand-primary flex-shrink-0" />
          <span>Cash on Delivery &amp; Secure Checkout</span>
        </div>
      </div>
    </div>
  )
}
