"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { formatBDT } from "@lib/utils"
import { Price } from "./price"
import {
  XMark,
  Trash,
  ShoppingBag,
  ArrowRight,
  ExclamationCircle,
  Tag,
  Check,
} from "@medusajs/icons"

export function CartDrawer() {
  const {
    items,
    itemsCount,
    subtotal,
    discount,
    total,
    appliedPromo,
    updateItemQuantity,
    removeItem,
    applyPromoCode,
    removePromoCode,
  } = useDemoCart()

  const { isCartDrawerOpen, setIsCartDrawerOpen, state } = useDemoStore()
  const [promoInput, setPromoInput] = useState("")
  const [promoError, setPromoError] = useState("")

  // Prevent body scroll when open
  useEffect(() => {
    if (isCartDrawerOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isCartDrawerOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isCartDrawerOpen) {
        setIsCartDrawerOpen(false)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isCartDrawerOpen, setIsCartDrawerOpen])

  if (!isCartDrawerOpen) return null

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError("")
    if (!promoInput.trim()) return

    const res = applyPromoCode(promoInput)
    if (res.success) {
      setPromoInput("")
    } else {
      setPromoError(res.message)
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-enter">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-brand-border flex items-center justify-between bg-brand-surface">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-brand-primary" />
            <h3 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
              Shopping Bag
            </h3>
            <span className="text-xs bg-brand-primary text-white font-bold px-2 py-0.5 rounded-full">
              {itemsCount}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsCartDrawerOpen(false)}
            className="p-1.5 text-grey-50 hover:text-brand-primary rounded hover:bg-black/5"
            aria-label="Close bag"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-brand-secondary px-4 py-2.5 border-b border-brand-border text-xs text-brand-primary flex items-center justify-between">
          {subtotal >= 3000 ? (
            <div className="flex items-center gap-1.5 text-emerald-800 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>You have unlocked complimentary delivery!</span>
            </div>
          ) : (
            <span>
              Add <strong>{formatBDT(3000 - subtotal)}</strong> more for complimentary delivery across Bangladesh.
            </span>
          )}
        </div>

        {/* Body: Item List or Empty */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center mx-auto text-grey-40">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading font-bold text-base text-brand-primary">Your bag is empty</h4>
                <p className="text-xs text-grey-50 max-w-xs mx-auto">
                  Explore our British-tailored garments, heavy cottons, and timeless smart-casuals.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCartDrawerOpen(false)}
                className="px-6 py-2.5 bg-brand-primary text-white text-xs font-semibold uppercase tracking-wider hover:bg-brand-accent transition-colors"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-brand-border space-y-4">
              {items.map((item) => {
                // Reconcile item against current catalog state
                const currentProd = state.products.find((p) => p.id === item.productId)
                const currentVar = currentProd?.variants.find((v) => v.id === item.variantId)
                const isUnavailable = !currentProd || !currentVar || (currentVar.manageInventory && currentVar.inventoryQuantity <= 0)
                const isPriceChanged = currentVar && currentVar.price !== item.unitPrice

                return (
                  <div key={item.id} className="pt-4 first:pt-0 flex gap-3.5">
                    {/* Thumbnail */}
                    <div className="relative w-20 h-24 bg-brand-secondary flex-shrink-0 border border-brand-border overflow-hidden">
                      <Image
                        src={item.thumbnail || "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80"}
                        alt={item.productTitle}
                        fill
                        className="object-cover object-center"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-bold text-brand-primary truncate hover:text-brand-accent">
                            <Link
                              href={`/product?handle=${item.productHandle}`}
                              onClick={() => setIsCartDrawerOpen(false)}
                            >
                              {item.productTitle}
                            </Link>
                          </h4>
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="text-grey-40 hover:text-rose-600 p-0.5"
                            aria-label={`Remove ${item.productTitle}`}
                          >
                            <Trash className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="text-[11px] text-grey-50 mt-0.5 space-y-0.5">
                          <p>
                            {Object.entries(item.options)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" • ")}
                          </p>
                          <p className="font-mono text-[10px] text-grey-40">SKU: {item.sku}</p>
                        </div>

                        {/* Reconciliation alerts */}
                        {isUnavailable && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                            <ExclamationCircle className="w-3 h-3" />
                            <span>This garment is now out of stock</span>
                          </div>
                        )}
                        {isPriceChanged && (
                          <div className="mt-1 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            <ExclamationCircle className="w-3 h-3" />
                            <span>Price updated in store to {formatBDT(currentVar.price)}</span>
                          </div>
                        )}
                      </div>

                      {/* Quantity Stepper & Line Total */}
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center border border-brand-border bg-brand-surface rounded">
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 flex items-center justify-center text-xs font-bold text-grey-60 hover:text-brand-primary hover:bg-brand-secondary"
                            aria-label="Decrease quantity"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-xs font-semibold text-brand-primary font-mono">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.maxInventory}
                            className={`w-7 h-7 flex items-center justify-center text-xs font-bold ${
                              item.quantity >= item.maxInventory
                                ? "text-grey-30 cursor-not-allowed"
                                : "text-grey-60 hover:text-brand-primary hover:bg-brand-secondary"
                            }`}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <Price
                            amount={item.unitPrice * item.quantity}
                            className="text-xs font-bold text-brand-primary"
                          />
                          {item.quantity > 1 && (
                            <span className="text-[10px] text-grey-40 block">
                              {formatBDT(item.unitPrice)} each
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer: Promo & Calculations */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-brand-border bg-brand-surface space-y-4">
            {/* Promo Code Input */}
            <div>
              {appliedPromo ? (
                <div className="p-2.5 bg-brand-accent/10 border border-brand-accent/30 rounded flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-brand-accent font-semibold">
                    <Tag className="w-3.5 h-3.5" />
                    <span>Coupon <strong>{appliedPromo.code}</strong> Applied</span>
                  </div>
                  <button
                    type="button"
                    onClick={removePromoCode}
                    className="text-grey-40 hover:text-rose-600 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyPromo} className="space-y-1">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => {
                        setPromoInput(e.target.value)
                        setPromoError("")
                      }}
                      placeholder="Promo Code (Try LONDON10)"
                      className="flex-1 px-3 py-1.5 bg-white border border-brand-border text-xs text-brand-primary placeholder:text-grey-40 focus:outline-none focus:border-brand-primary uppercase"
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 bg-brand-secondary border border-brand-border hover:bg-brand-sand text-xs font-semibold text-brand-primary transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {promoError && (
                    <p className="text-[10px] text-rose-600 pl-1">{promoError}</p>
                  )}
                </form>
              )}
            </div>

            {/* Price Calculations */}
            <div className="space-y-1.5 text-xs text-grey-70 border-t border-brand-border pt-3">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-brand-primary">{formatBDT(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-brand-accent font-semibold">
                  <span>Promotion Discount</span>
                  <span>-{formatBDT(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[11px] text-grey-50">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-brand-primary pt-2 border-t border-brand-border">
                <span>Estimated Total</span>
                <span>{formatBDT(total)}</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2 pt-1">
              <Link
                href="/checkout"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-3 bg-brand-primary text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-brand-accent transition-colors shadow"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/cart"
                onClick={() => setIsCartDrawerOpen(false)}
                className="w-full py-2 bg-white border border-brand-border text-center text-xs font-semibold text-grey-70 hover:bg-brand-secondary transition-colors block"
              >
                View Full Bag Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
