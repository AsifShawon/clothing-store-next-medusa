"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { Price } from "@components/store/price"
import { formatBDT } from "@lib/utils"
import {
  Trash,
  ShoppingBag,
  ArrowRight,
  Tag,
  ShieldCheck,
  TruckFast,
  ExclamationCircle,
  Check,
} from "@medusajs/icons"

export default function CartPage() {
  const {
    items,
    itemsCount,
    subtotal,
    discount,
    total,
    appliedPromo,
    updateItemQuantity,
    removeItem,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useDemoCart()

  const { state } = useDemoStore()
  const [promoCode, setPromoCode] = useState("")
  const [promoError, setPromoError] = useState("")
  const [selectedShippingId, setSelectedShippingId] = useState<string>(
    state.shippingOptions[0]?.id || "so_dhaka_inside"
  )

  const selectedShippingOption =
    state.shippingOptions.find((so) => so.id === selectedShippingId) || state.shippingOptions[0]

  const finalTotalWithShipping = total + (selectedShippingOption ? selectedShippingOption.price : 60)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError("")
    if (!promoCode.trim()) return

    const res = applyPromoCode(promoCode)
    if (res.success) {
      setPromoCode("")
    } else {
      setPromoError(res.message)
    }
  }

  if (items.length === 0) {
    return (
      <div className="content-container py-20 sm:py-28 text-center max-w-lg mx-auto space-y-5">
        <div className="w-16 h-16 bg-brand-secondary rounded-full flex items-center justify-center mx-auto text-grey-40">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h1 className="font-display text-3xl text-brand-primary">Your Shopping Bag is Empty</h1>
          <p className="text-xs sm:text-sm text-grey-60 leading-relaxed">
            You haven&apos;t added any British smart-casual clothing to your bag yet. Explore our authentic heavyweight tees, oxford shirts, and chinos.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-brand-accent transition-colors shadow"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="content-container py-10 sm:py-16 space-y-10">
      {/* Page Title & Breadcrumb */}
      <div className="border-b border-brand-border pb-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-brand-primary">Shopping Bag</h1>
          <p className="text-xs text-grey-50 mt-1">
            Review your selected garments, apply promotion codes, and calculate Dhaka delivery rates.
          </p>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="text-xs text-grey-50 hover:text-rose-600 underline font-medium self-start sm:self-auto"
        >
          Clear entire bag
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="bg-brand-secondary p-4 border border-brand-border flex items-center justify-between text-xs">
        {subtotal >= 3000 ? (
          <div className="flex items-center gap-2 text-emerald-800 font-semibold">
            <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Complimentary nationwide delivery unlocked on this order!</span>
          </div>
        ) : (
          <div className="text-brand-primary">
            Add <strong>{formatBDT(3000 - subtotal)}</strong> more to unlock complimentary delivery across Bangladesh.
          </div>
        )}
      </div>

      {/* Main Cart Grid: Table + Order Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Items Table */}
        <div className="lg:col-span-8 space-y-4">
          <div className="divide-y divide-brand-border border-y border-brand-border">
            {items.map((item) => {
              // Reconcile item against current catalog
              const currentProd = state.products.find((p) => p.id === item.productId)
              const currentVar = currentProd?.variants.find((v) => v.id === item.variantId)
              const isUnavailable = !currentProd || !currentVar || (currentVar.manageInventory && currentVar.inventoryQuantity <= 0)
              const isPriceChanged = currentVar && currentVar.price !== item.unitPrice

              return (
                <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-5 items-start">
                  {/* Image */}
                  <div className="relative w-24 sm:w-28 aspect-[3/4] bg-brand-secondary border border-brand-border flex-shrink-0 overflow-hidden">
                    <Image
                      src={item.thumbnail || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80"}
                      alt={item.productTitle}
                      fill
                      className="object-cover object-center"
                    />
                  </div>

                  {/* Information & Controls */}
                  <div className="flex-1 min-w-0 space-y-3 w-full">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-heading font-bold text-sm sm:text-base text-brand-primary hover:text-brand-accent">
                          <Link href={`/product?handle=${item.productHandle}`}>
                            {item.productTitle}
                          </Link>
                        </h3>
                        <div className="text-xs text-grey-50 mt-1 space-y-0.5">
                          <p>
                            {Object.entries(item.options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" • ")}
                          </p>
                          <p className="font-mono text-[11px] text-grey-40">SKU: {item.sku}</p>
                        </div>
                      </div>

                      {/* Line Total */}
                      <div className="text-right">
                        <Price
                          amount={item.unitPrice * item.quantity}
                          className="text-base font-bold text-brand-primary"
                        />
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-grey-40 block font-mono">
                            {formatBDT(item.unitPrice)} each
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reconciliation Warnings */}
                    {isUnavailable && (
                      <div className="p-2 bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-1.5 rounded">
                        <ExclamationCircle className="w-4 h-4 flex-shrink-0" />
                        <span>This variant has sold out. Please remove it before proceeding.</span>
                      </div>
                    )}
                    {isPriceChanged && (
                      <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-1.5 rounded">
                        <ExclamationCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Price updated in catalog to {formatBDT(currentVar.price)}.</span>
                      </div>
                    )}

                    {/* Quantity Stepper & Remove Button */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-brand-border bg-brand-surface rounded">
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-xs font-bold text-grey-60 hover:text-brand-primary hover:bg-brand-secondary"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-xs font-bold font-mono text-brand-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.maxInventory}
                          className={`w-8 h-8 flex items-center justify-center text-xs font-bold ${
                            item.quantity >= item.maxInventory
                              ? "text-grey-30 cursor-not-allowed"
                              : "text-grey-60 hover:text-brand-primary hover:bg-brand-secondary"
                          }`}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-grey-50 hover:text-rose-600 flex items-center gap-1 transition-colors"
                      >
                        <Trash className="w-3.5 h-3.5" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="pt-2">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-primary hover:text-brand-accent uppercase tracking-wider"
            >
              <span>← Continue Shopping</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="lg:col-span-4 bg-brand-surface border border-brand-border p-6 space-y-6">
          <h2 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider border-b border-brand-border pb-3">
            Order Summary
          </h2>

          {/* Promo Code Section */}
          <div className="space-y-2">
            <label htmlFor="promo" className="text-xs font-bold uppercase tracking-wider text-brand-primary block">
              Promotion Code
            </label>
            {appliedPromo ? (
              <div className="p-3 bg-brand-accent/10 border border-brand-accent/30 rounded flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-brand-accent font-semibold">
                  <Tag className="w-4 h-4" />
                  <span>Coupon <strong>{appliedPromo.code}</strong> Applied</span>
                </div>
                <button
                  type="button"
                  onClick={removePromoCode}
                  className="text-grey-50 hover:text-rose-600 font-medium"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyPromo} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    id="promo"
                    type="text"
                    value={promoCode}
                    onChange={(e) => {
                      setPromoCode(e.target.value)
                      setPromoError("")
                    }}
                    placeholder="Enter LONDON10"
                    className="flex-1 px-3 py-2 bg-white border border-brand-border text-xs text-brand-primary placeholder:text-grey-40 focus:outline-none focus:border-brand-primary uppercase"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {promoError && (
                  <p className="text-[11px] text-rose-600 pl-1">{promoError}</p>
                )}
              </form>
            )}
          </div>

          {/* Shipping Estimator Option */}
          <div className="space-y-2 pt-2 border-t border-brand-border">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-primary block">
              Delivery Zone Estimate
            </label>
            <select
              value={selectedShippingId}
              onChange={(e) => setSelectedShippingId(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-brand-border text-xs text-brand-primary focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              {state.shippingOptions.map((so) => (
                <option key={so.id} value={so.id}>
                  {so.name} ({formatBDT(so.price)})
                </option>
              ))}
            </select>
            <p className="text-[11px] text-grey-50">
              {selectedShippingOption?.description} ({selectedShippingOption?.estimatedDelivery})
            </p>
          </div>

          {/* Price Breakdown */}
          <div className="space-y-2.5 text-xs text-grey-70 pt-2 border-t border-brand-border">
            <div className="flex justify-between">
              <span>Items Subtotal ({itemsCount} items)</span>
              <span className="font-semibold text-brand-primary">{formatBDT(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-brand-accent font-semibold">
                <span>Promotion Discount ({appliedPromo?.code})</span>
                <span>-{formatBDT(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-brand-primary">
                {formatBDT(selectedShippingOption ? selectedShippingOption.price : 60)}
              </span>
            </div>
            <div className="flex justify-between text-base font-bold text-brand-primary pt-3 border-t border-brand-border">
              <span>Estimated Total</span>
              <span>{formatBDT(finalTotalWithShipping)}</span>
            </div>
          </div>

          {/* Checkout CTA */}
          <div className="space-y-3 pt-2">
            <Link
              href="/checkout"
              className="w-full py-3.5 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-brand-accent transition-colors shadow-lg"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <div className="flex items-center justify-center gap-2 text-[11px] text-grey-50 pt-1">
              <ShieldCheck className="w-4 h-4 text-brand-accent" />
              <span>Cash on Delivery & Simulated Test Card</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
