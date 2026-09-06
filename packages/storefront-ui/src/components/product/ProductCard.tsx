"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ProductView,
  QuickAddRequest,
  QuickAddResult,
  StoreCapabilities,
} from "@dtc/commerce-contracts"
import { COLOR_SWATCHES } from "../../theme/colors"
import { LinkComponent } from "../../types"
import { MobileQuickAddSheet } from "./MobileQuickAddSheet"
import { CheckIcon } from "../icons"

export interface ProductCardProps {
  product: ProductView
  href: string
  capabilities?: StoreCapabilities
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  linkComponent?: LinkComponent
}

export function ProductCard({
  product,
  href,
  capabilities,
  onQuickAdd,
  linkComponent: LinkComp = Link,
}: ProductCardProps) {
  const colorOption = product.options?.find((o) => o.title.toLowerCase() === "color")
  const sizeOption = product.options?.find((o) => o.title.toLowerCase() === "size")

  // Active color state
  const [selectedColor, setSelectedColor] = useState<string>(
    colorOption?.values[0] || ""
  )

  // Quick Add states
  const [pendingVariantId, setPendingVariantId] = useState<string | null>(null)
  const [successVariantId, setSuccessVariantId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isMobileSheetOpen, setIsMobileSheetOpen] = useState(false)

  // Color-specific primary and secondary image
  const primaryImage = useMemo(() => {
    if (selectedColor) {
      // 1. Variant image
      const variantWithColor = product.variants.find(
        (v) =>
          (v.options["Color"] || v.options["color"])?.toLowerCase() ===
          selectedColor.toLowerCase()
      )
      if (variantWithColor?.images && variantWithColor.images.length > 0) {
        return variantWithColor.images[0]
      }
      // 2. Alt text match
      const altMatch = product.images.find((img) =>
        img.altText?.toLowerCase().includes(selectedColor.toLowerCase())
      )
      if (altMatch) return altMatch
    }
    return product.thumbnail || product.images[0]
  }, [product.variants, product.images, product.thumbnail, selectedColor])

  const secondaryImage = useMemo(() => {
    const candidates = product.images.filter((img) => img.url !== primaryImage?.url)
    return candidates.length > 0 ? candidates[0] : undefined
  }, [product.images, primaryImage])

  // Stock status
  const isSoldOut =
    !product.inStock || (product.totalStock !== undefined && product.totalStock <= 0)
  const isLowStock =
    !isSoldOut &&
    product.totalStock !== undefined &&
    product.totalStock > 0 &&
    product.totalStock <= 5

  const fabricInfo = product.material || product.subtitle || "British Smart-Casual"

  // Unique sizes count
  const uniqueSizesCount = useMemo(() => {
    if (sizeOption?.values?.length) {
      return sizeOption.values.length
    }
    const sizeSet = new Set<string>()
    for (const variant of product.variants) {
      const sizeVal = variant.options["Size"] || variant.options["size"]
      if (sizeVal) sizeSet.add(sizeVal)
    }
    return sizeSet.size || product.variants.length
  }, [sizeOption, product.variants])

  // Sizes available for the selected color
  const availableSizes = useMemo(() => {
    if (!sizeOption) return []
    return sizeOption.values.map((size) => {
      const variant = product.variants.find((v) => {
        const matchColor =
          !colorOption ||
          (v.options["Color"] || v.options["color"])?.toLowerCase() ===
            selectedColor.toLowerCase()
        const matchSize =
          (v.options["Size"] || v.options["size"])?.toLowerCase() ===
          size.toLowerCase()
        return matchColor && matchSize
      })
      return {
        size,
        variantId: variant?.id,
        inStock: variant ? variant.inStock : false,
      }
    })
  }, [product.variants, sizeOption, colorOption, selectedColor])

  // Quick Add size click handler
  const handleQuickAddSize = async (variantId: string | undefined) => {
    if (!variantId || pendingVariantId || !onQuickAdd) return

    setPendingVariantId(variantId)
    setErrorMessage(null)

    try {
      const result = await onQuickAdd({
        productId: product.id,
        variantId,
        quantity: 1,
      })

      if (result && result.success === false) {
        setErrorMessage(result.message || "Could not add")
      } else {
        setSuccessVariantId(variantId)
        setTimeout(() => setSuccessVariantId(null), 1800)
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error")
    } finally {
      setPendingVariantId(null)
    }
  }

  return (
    <>
      <article
        data-testid="product-wrapper"
        className="product-card group relative flex flex-col bg-white border border-brand-border/80 hover:border-brand-primary rounded-xl overflow-hidden transition-all duration-300 shadow-subtle hover:shadow-editorial"
      >
        {/* 1. Image Canvas & Badges */}
        <div className="relative aspect-[3/4] w-full bg-brand-secondary overflow-hidden">
          <LinkComp
            href={href}
            className="block w-full h-full relative"
            aria-label={`View details for ${product.title}`}
          >
            {primaryImage?.url ? (
              <Image
                src={primaryImage.url}
                alt={primaryImage.altText || product.title}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={`object-cover object-center transition-all duration-500 ${
                  secondaryImage
                    ? "group-hover:opacity-0 group-hover:scale-105"
                    : "group-hover:scale-105"
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
                London Boy
              </div>
            )}

            {secondaryImage?.url && (
              <Image
                src={secondaryImage.url}
                alt={secondaryImage.altText || `${product.title} alternate angle`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
              />
            )}
          </LinkComp>

          {/* Status Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
            {product.isNewArrival && (
              <span className="bg-brand-accent text-white text-[9px] font-heading font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                New In
              </span>
            )}
            {product.isBestSeller && !product.isNewArrival && (
              <span className="bg-brand-secondary text-brand-accent border border-brand-accent/30 text-[9px] font-heading font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                Bestseller
              </span>
            )}
            {isSoldOut && (
              <span className="bg-rose-900 text-white text-[9px] font-heading font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                Sold Out
              </span>
            )}
            {isLowStock && (
              <span className="bg-amber-800 text-white text-[9px] font-heading font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full shadow-xs">
                Only {product.totalStock} Left
              </span>
            )}
          </div>

          {/* Desktop Quick Add Hover Tray */}
          {onQuickAdd && !isSoldOut && availableSizes.length > 0 && (
            <div className="hidden lg:flex absolute inset-x-2 bottom-2 z-20 bg-white/95 backdrop-blur-sm border border-brand-border/90 rounded-lg p-2 flex-col gap-1.5 shadow-md transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto transition-all duration-200">
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-heading font-bold uppercase tracking-wider text-brand-muted">
                  Quick Add
                </span>
                {errorMessage ? (
                  <span className="text-[10px] text-rose-700 font-bold">Failed</span>
                ) : successVariantId ? (
                  <span className="text-[10px] text-emerald-700 font-bold flex items-center gap-1">
                    <CheckIcon className="w-3 h-3" /> Added ✓
                  </span>
                ) : null}
              </div>

              <div className="flex items-center gap-1">
                {availableSizes.map(({ size, variantId, inStock }) => {
                  const isPending = pendingVariantId === variantId
                  const isSuccess = successVariantId === variantId

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!inStock || isPending || Boolean(pendingVariantId)}
                      onClick={() => handleQuickAddSize(variantId)}
                      aria-label={`Quick add size ${size}`}
                      className={`flex-1 h-8 rounded text-[11px] font-heading font-semibold uppercase tracking-wider transition-all flex items-center justify-center ${
                        !inStock
                          ? "opacity-30 line-through cursor-not-allowed bg-brand-surface text-brand-muted"
                          : isSuccess
                            ? "bg-emerald-700 text-white"
                            : isPending
                              ? "bg-brand-secondary text-brand-primary animate-pulse"
                              : "bg-white hover:bg-brand-primary hover:text-white border border-brand-border text-brand-primary"
                      }`}
                    >
                      {isPending ? (
                        <span
                          className="inline-block w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"
                          aria-hidden="true"
                        />
                      ) : (
                        size
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Mobile Quick Add Trigger Button */}
          {onQuickAdd && !isSoldOut && (
            <button
              type="button"
              onClick={() => setIsMobileSheetOpen(true)}
              className="lg:hidden absolute bottom-2 right-2 z-20 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-sm text-brand-primary border border-brand-border text-[10px] font-heading font-bold uppercase tracking-wider shadow-sm flex items-center gap-1"
              aria-label={`Quick Add ${product.title}`}
            >
              <span>+ Quick Add</span>
            </button>
          )}
        </div>

        {/* 2. Product Details & Swatches */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3 bg-white">
          <div className="space-y-1">
            <LinkComp href={href} className="block group-hover:text-brand-accent transition-colors">
              <h3
                className="font-heading font-bold text-sm text-brand-primary line-clamp-2 leading-snug group-hover:underline"
                data-testid="product-title"
              >
                {product.title}
              </h3>
            </LinkComp>
            <p className="text-[11px] text-brand-primary/60 truncate">
              {fabricInfo}
            </p>
          </div>

          {/* Color Swatches */}
          {colorOption && colorOption.values.length > 0 && (
            <div className="space-y-1 pt-0.5">
              <div
                role="radiogroup"
                aria-label={`Available colors for ${product.title}`}
                className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
              >
                {colorOption.values.map((val) => {
                  const isSelected = selectedColor.toLowerCase() === val.toLowerCase()
                  const hex = COLOR_SWATCHES[val.toLowerCase()] || "#cccccc"

                  return (
                    <button
                      key={val}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      onClick={() => setSelectedColor(val)}
                      title={`Color: ${val}`}
                      aria-label={`Select color ${val}`}
                      className={`relative w-4 h-4 rounded-full transition-transform flex items-center justify-center ${
                        isSelected ? "ring-2 ring-brand-primary ring-offset-1 scale-110" : "hover:scale-105"
                      }`}
                    >
                      <span
                        style={{ backgroundColor: hex }}
                        className="w-full h-full rounded-full border border-black/15 shadow-2xs block"
                      />
                    </button>
                  )
                })}
              </div>

              {selectedColor && (
                <span className="text-[10px] font-heading text-brand-muted block">
                  {selectedColor}
                </span>
              )}
            </div>
          )}

          {/* Pricing & Variant Info */}
          <div className="pt-2 border-t border-brand-border/50 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-xs sm:text-sm text-brand-primary">
                {product.minPrice.formatted}
              </span>
              {product.minPrice.approxUsd && (
                <span className="text-[10px] text-brand-muted font-mono">
                  (≈${product.minPrice.approxUsd})
                </span>
              )}
            </div>

            {uniqueSizesCount > 0 && (
              <span className="text-[10px] uppercase font-heading font-medium tracking-wider text-brand-muted">
                {uniqueSizesCount} {uniqueSizesCount === 1 ? "Size" : "Sizes"}
              </span>
            )}
          </div>
        </div>
      </article>

      {/* Mobile Quick Add Bottom Sheet Modal */}
      {isMobileSheetOpen && (
        <MobileQuickAddSheet
          isOpen={isMobileSheetOpen}
          onClose={() => setIsMobileSheetOpen(false)}
          product={product}
          initialColor={selectedColor}
          href={href}
          onQuickAdd={onQuickAdd}
          linkComponent={LinkComp}
        />
      )}
    </>
  )
}
