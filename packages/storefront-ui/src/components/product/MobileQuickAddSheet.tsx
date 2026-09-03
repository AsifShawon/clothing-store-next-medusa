"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ProductView, QuickAddRequest, QuickAddResult } from "@dtc/commerce-contracts"
import { COLOR_SWATCHES } from "../../theme/colors"
import { LinkComponent } from "../../types"
import { XMarkIcon, CheckIcon } from "../icons"

export interface MobileQuickAddSheetProps {
  isOpen: boolean
  onClose: () => void
  product: ProductView
  href: string
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  linkComponent?: LinkComponent
}

export function MobileQuickAddSheet({
  isOpen,
  onClose,
  product,
  href,
  onQuickAdd,
  linkComponent: LinkComp = Link,
}: MobileQuickAddSheetProps) {
  const colorOption = product.options?.find((o) => o.title.toLowerCase() === "color")
  const sizeOption = product.options?.find((o) => o.title.toLowerCase() === "size")

  const [selectedColor, setSelectedColor] = useState<string>(
    colorOption?.values[0] || ""
  )
  const [selectedSize, setSelectedSize] = useState<string>(
    sizeOption?.values[0] || ""
  )
  const [isPending, setIsPending] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Reset state when sheet opens
  useEffect(() => {
    if (isOpen) {
      setSelectedColor(colorOption?.values[0] || "")
      setSelectedSize(sizeOption?.values[0] || "")
      setSuccessMessage(null)
      setErrorMessage(null)
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen, colorOption, sizeOption])

  // Escape key handler
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  // Find active variant matching selected color & size
  const activeVariant = product.variants.find((v) => {
    const matchColor = !colorOption || v.options["Color"]?.toLowerCase() === selectedColor.toLowerCase()
    const matchSize = !sizeOption || v.options["Size"]?.toLowerCase() === selectedSize.toLowerCase()
    return matchColor && matchSize
  }) || product.variants[0]

  const isSoldOut = activeVariant ? !activeVariant.inStock : !product.inStock

  const handleAdd = async () => {
    if (!activeVariant || isPending || isSoldOut || !onQuickAdd) return

    setIsPending(true)
    setErrorMessage(null)

    try {
      const result = await onQuickAdd({
        productId: product.id,
        variantId: activeVariant.id,
        quantity: 1,
      })

      if (result && result.success === false) {
        setErrorMessage(result.message || "Could not add to bag. Please try again.")
      } else {
        setSuccessMessage("Added to Bag ✓")
        setTimeout(() => {
          onClose()
        }, 800)
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error adding to bag.")
    } finally {
      setIsPending(false)
    }
  }

  const thumbnail = product.thumbnail || product.images[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick Add ${product.title}`}
      className="fixed inset-0 z-50 flex items-end justify-center lg:hidden"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container */}
      <div className="relative z-10 w-full max-w-lg bg-white rounded-t-2xl shadow-2xl p-6 space-y-5 animate-mega-enter max-h-[85vh] overflow-y-auto">
        {/* Header: Product Preview & Close */}
        <div className="flex items-start justify-between gap-4 border-b border-brand-border/60 pb-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {thumbnail && (
              <div className="relative w-14 h-18 bg-brand-secondary rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={thumbnail.url}
                  alt={thumbnail.altText || product.title}
                  fill
                  sizes="60px"
                  className="object-cover object-center"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-brand-primary truncate">
                {product.title}
              </h3>
              <p className="font-heading font-bold text-xs text-brand-primary mt-0.5">
                {activeVariant?.price.formatted || product.minPrice.formatted}
              </p>
              <LinkComp
                href={href}
                onClick={onClose}
                className="text-[11px] text-brand-accent underline hover:opacity-80 block mt-1"
              >
                View full product page →
              </LinkComp>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 -mr-2 text-brand-primary/60 hover:text-brand-primary rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close Quick Add sheet"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Color Choice if available */}
        {colorOption && colorOption.values.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-heading font-bold uppercase tracking-wider text-brand-muted text-[11px]">
                Color
              </span>
              <span className="font-heading font-semibold text-brand-primary text-xs">
                {selectedColor}
              </span>
            </div>
            <div role="radiogroup" aria-label="Select color" className="flex flex-wrap gap-2">
              {colorOption.values.map((color) => {
                const isSelected = selectedColor.toLowerCase() === color.toLowerCase()
                const hex = COLOR_SWATCHES[color.toLowerCase()] || "#cccccc"
                return (
                  <button
                    key={color}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => setSelectedColor(color)}
                    className={`flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-heading font-medium transition-colors min-h-[44px] ${
                      isSelected
                        ? "border-brand-primary bg-brand-secondary/60 text-brand-primary font-bold"
                        : "border-brand-border text-brand-primary/80 hover:border-brand-primary"
                    }`}
                  >
                    <span
                      style={{ backgroundColor: hex }}
                      className="w-3.5 h-3.5 rounded-full border border-black/10 flex-shrink-0"
                    />
                    <span>{color}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Size Choice if available */}
        {sizeOption && sizeOption.values.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-heading font-bold uppercase tracking-wider text-brand-muted text-[11px]">
                Size
              </span>
              <span className="font-heading font-semibold text-brand-primary text-xs">
                {selectedSize}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {sizeOption.values.map((size) => {
                const isSelected = selectedSize.toLowerCase() === size.toLowerCase()
                const variant = product.variants.find((v) => {
                  const matchColor = !colorOption || v.options["Color"]?.toLowerCase() === selectedColor.toLowerCase()
                  const matchSize = v.options["Size"]?.toLowerCase() === size.toLowerCase()
                  return matchColor && matchSize
                })
                const sizeOutOfStock = variant ? !variant.inStock : false

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={sizeOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`h-11 rounded-lg border text-xs font-heading font-semibold uppercase tracking-wider transition-colors flex items-center justify-center ${
                      sizeOutOfStock
                        ? "border-brand-border/40 text-brand-muted line-through bg-brand-surface opacity-40 cursor-not-allowed"
                        : isSelected
                          ? "border-brand-primary bg-brand-primary text-white"
                          : "border-brand-border bg-white text-brand-primary hover:border-brand-primary"
                    }`}
                  >
                    {size}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Feedback messages */}
        {errorMessage && (
          <p className="text-xs text-rose-700 bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-center font-medium">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg font-bold">
            <CheckIcon className="w-4 h-4 text-emerald-700" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Add to Bag CTA */}
        <button
          type="button"
          onClick={handleAdd}
          disabled={isPending || isSoldOut || !onQuickAdd}
          className="w-full h-12 rounded-full bg-brand-primary hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-subtle min-h-[44px]"
        >
          {isPending ? (
            <span>Adding to Bag...</span>
          ) : isSoldOut ? (
            <span>Sold Out</span>
          ) : (
            <span>Add to Bag • {activeVariant?.price.formatted || product.minPrice.formatted}</span>
          )}
        </button>
      </div>
    </div>
  )
}
