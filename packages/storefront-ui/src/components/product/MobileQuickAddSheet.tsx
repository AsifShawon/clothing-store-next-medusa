"use client"

import React, { useEffect, useState, useRef, useMemo, useCallback } from "react"
import { createPortal } from "react-dom"
import Link from "next/link"
import Image from "next/image"
import clsx from "clsx"
import { ProductView, QuickAddRequest, QuickAddResult } from "@dtc/commerce-contracts"
import { COLOR_SWATCHES } from "../../theme/colors"
import { LinkComponent } from "../../types"
import { XMarkIcon, CheckIcon } from "../icons"

export interface MobileQuickAddSheetProps {
  isOpen: boolean
  onClose: () => void
  product: ProductView
  href: string
  initialColor?: string
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  linkComponent?: LinkComponent
}

export function MobileQuickAddSheet({
  isOpen,
  onClose,
  product,
  href,
  initialColor,
  onQuickAdd,
  linkComponent: LinkComp = Link,
}: MobileQuickAddSheetProps) {
  const colorOption = product.options?.find((o) => o.title.toLowerCase() === "color")
  const sizeOption = product.options?.find((o) => o.title.toLowerCase() === "size")

  const defaultColor = useMemo(() => {
    if (initialColor && colorOption?.values.some((v) => v.toLowerCase() === initialColor.toLowerCase())) {
      return initialColor
    }
    return colorOption?.values[0] || ""
  }, [initialColor, colorOption])

  const [selectedColor, setSelectedColor] = useState<string>(defaultColor)
  // If multiple sizes exist, require explicit size selection
  const [selectedSize, setSelectedSize] = useState<string>(
    sizeOption?.values.length === 1 ? sizeOption.values[0] : ""
  )
  const [isMounted, setIsMounted] = useState(isOpen)
  const [isClosing, setIsClosing] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const triggerRef = useRef<HTMLElement | null>(null)

  // Reset state when sheet opens or product changes
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement | null
      setSelectedColor(defaultColor)
      setSelectedSize(sizeOption?.values.length === 1 ? sizeOption.values[0] : "")
      setSuccessMessage(null)
      setErrorMessage(null)
      setIsMounted(true)
      setIsClosing(false)
      document.body.style.overflow = "hidden"
    } else if (isMounted && !isClosing) {
      const prefersReduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches

      if (prefersReduced) {
        setIsMounted(false)
        document.body.style.overflow = ""
        triggerRef.current?.focus()
      } else {
        setIsClosing(true)
        const timer = setTimeout(() => {
          setIsMounted(false)
          setIsClosing(false)
          document.body.style.overflow = ""
          triggerRef.current?.focus()
        }, 250)
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen, defaultColor, sizeOption])

  // Clear timers & scroll on unmount
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
      document.body.style.overflow = ""
    }
  }, [])

  // When changing color, verify if selected size is available in that color; if not, clear selection
  const handleColorChange = useCallback(
    (newColor: string) => {
      setSelectedColor(newColor)
      setErrorMessage(null)

      if (selectedSize) {
        const variantForNewColor = product.variants.find(
          (v) =>
            v.options["Color"]?.toLowerCase() === newColor.toLowerCase() &&
            v.options["Size"]?.toLowerCase() === selectedSize.toLowerCase()
        )
        if (!variantForNewColor) {
          // Combination does not exist for this color, clear size selection
          setSelectedSize("")
        }
      }
    },
    [product.variants, selectedSize]
  )

  // Escape key handler
  useEffect(() => {
    if (!isMounted) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isMounted, onClose])

  // Strict variant resolution: NEVER fall back to product.variants[0]
  const activeVariant = useMemo(() => {
    if (sizeOption && sizeOption.values.length > 1 && !selectedSize) {
      return undefined
    }
    return product.variants.find((v) => {
      const matchColor =
        !colorOption || v.options["Color"]?.toLowerCase() === selectedColor.toLowerCase()
      const matchSize =
        !sizeOption || v.options["Size"]?.toLowerCase() === selectedSize.toLowerCase()
      return matchColor && matchSize
    })
  }, [product.variants, colorOption, sizeOption, selectedColor, selectedSize])

  // Color-specific imagery
  const activeThumbnail = useMemo(() => {
    if (selectedColor) {
      const match = product.images.find((img) =>
        img.altText?.toLowerCase().includes(selectedColor.toLowerCase())
      )
      if (match) return match
    }
    return product.thumbnail || product.images[0]
  }, [product.images, product.thumbnail, selectedColor])

  const isSizeRequired = Boolean(sizeOption && sizeOption.values.length > 1 && !selectedSize)
  const isCombinationMissing = Boolean(selectedSize && !activeVariant)
  const isSoldOut = activeVariant ? !activeVariant.inStock : false
  const canAdd = Boolean(activeVariant && !isSoldOut && !isPending && !isSizeRequired && onQuickAdd)

  const handleAdd = async () => {
    if (!canAdd || !activeVariant || !onQuickAdd) return

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
        closeTimerRef.current = setTimeout(() => {
          onClose()
        }, 700)
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error adding to bag.")
    } finally {
      setIsPending(false)
    }
  }

  if (!isMounted) return null

  const sheetContent = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Quick Add ${product.title}`}
      className="fixed inset-0 z-50 flex items-end justify-center lg:hidden"
    >
      {/* Backdrop */}
      <div
        className={clsx(
          "fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-250",
          isClosing ? "opacity-0" : "opacity-100 animate-fade-in"
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Bottom Sheet Container */}
      <div
        className={clsx(
          "relative z-10 w-full max-w-lg bg-[#FAFAF7] rounded-t-2xl shadow-2xl p-5 sm:p-6 space-y-4 max-h-[85dvh] overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))] transition-transform duration-250 ease-out border-t border-brand-border",
          isClosing ? "animate-sheet-exit" : "animate-sheet-enter"
        )}
      >
        {/* Drag handle pill */}
        <div className="w-10 h-1 bg-brand-border rounded-full mx-auto -mt-1 mb-2 opacity-60" />

        {/* Header: Product Preview & Close */}
        <div className="flex items-start justify-between gap-4 border-b border-brand-border/70 pb-3.5">
          <div className="flex items-center gap-3.5 min-w-0">
            {activeThumbnail && (
              <div className="relative w-14 h-18 bg-brand-secondary rounded-lg overflow-hidden flex-shrink-0 border border-brand-border/60">
                <Image
                  src={activeThumbnail.url}
                  alt={activeThumbnail.altText || product.title}
                  fill
                  sizes="60px"
                  className="object-cover object-center"
                />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-heading font-bold text-sm text-brand-primary line-clamp-2 leading-snug">
                {product.title}
              </h3>
              <p className="font-heading font-bold text-xs text-brand-primary mt-1 tabular-nums">
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
            className="p-2 -mr-2 text-brand-primary/60 hover:text-brand-primary rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
            aria-label="Close Quick Add sheet"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Color Swatch Radio Group */}
        {colorOption && colorOption.values.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-heading font-semibold uppercase tracking-wider text-brand-muted text-[11px]">
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
                    onClick={() => handleColorChange(color)}
                    className={clsx(
                      "flex items-center gap-2 px-3 py-2 border rounded-lg text-xs font-heading transition-colors min-h-[44px]",
                      isSelected
                        ? "border-brand-primary bg-white text-brand-primary font-bold shadow-xs ring-1 ring-brand-primary"
                        : "border-brand-border bg-white text-brand-primary/80 hover:border-brand-primary"
                    )}
                  >
                    <span
                      style={{ backgroundColor: hex }}
                      className="w-3.5 h-3.5 rounded-full border border-black/15 flex-shrink-0"
                    />
                    <span>{color}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Size Selection Grid */}
        {sizeOption && sizeOption.values.length > 0 && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-heading font-semibold uppercase tracking-wider text-brand-muted text-[11px]">
                Size {isSizeRequired && <span className="text-amber-700 font-bold">*Required</span>}
              </span>
              {selectedSize && (
                <span className="font-heading font-semibold text-brand-primary text-xs">
                  {selectedSize}
                </span>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {sizeOption.values.map((size) => {
                const isSelected = selectedSize.toLowerCase() === size.toLowerCase()
                const variant = product.variants.find((v) => {
                  const matchColor =
                    !colorOption || v.options["Color"]?.toLowerCase() === selectedColor.toLowerCase()
                  const matchSize = v.options["Size"]?.toLowerCase() === size.toLowerCase()
                  return matchColor && matchSize
                })
                const combinationMissing = !variant
                const sizeOutOfStock = variant ? !variant.inStock : true

                return (
                  <button
                    key={size}
                    type="button"
                    disabled={sizeOutOfStock}
                    onClick={() => {
                      setSelectedSize(size)
                      setErrorMessage(null)
                    }}
                    aria-label={`Size ${size}${sizeOutOfStock ? " unavailable" : ""}`}
                    className={clsx(
                      "h-11 rounded-lg border text-xs font-heading font-semibold uppercase tracking-wider transition-colors flex items-center justify-center min-h-[44px]",
                      sizeOutOfStock
                        ? "border-brand-border/40 text-brand-muted line-through bg-brand-surface opacity-40 cursor-not-allowed"
                        : isSelected
                          ? "border-brand-primary bg-brand-primary text-white shadow-xs"
                          : "border-brand-border bg-white text-brand-primary hover:border-brand-primary"
                    )}
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
          disabled={!canAdd}
          className="w-full h-12 rounded-full bg-brand-primary hover:bg-black text-white text-xs font-heading font-bold uppercase tracking-wider transition-all disabled:opacity-40 disabled:pointer-events-none flex items-center justify-center gap-2 shadow-subtle min-h-[48px]"
        >
          {isPending ? (
            <span className="flex items-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding to Bag...</span>
            </span>
          ) : isSizeRequired ? (
            <span>Select a Size</span>
          ) : isCombinationMissing ? (
            <span>Combination Unavailable</span>
          ) : isSoldOut ? (
            <span>Sold Out</span>
          ) : (
            <span>
              Add to Bag • {activeVariant?.price.formatted || product.minPrice.formatted}
            </span>
          )}
        </button>
      </div>
    </div>
  )

  if (typeof document !== "undefined") {
    return createPortal(sheetContent, document.body)
  }
  return sheetContent
}
