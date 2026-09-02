import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ProductView, StoreCapabilities } from "@dtc/commerce-contracts"
import { COLOR_SWATCHES } from "../../theme/colors"

export interface ProductCardProps {
  product: ProductView
  href: string
  capabilities?: StoreCapabilities
  onQuickAdd?: (product: ProductView) => void
  linkComponent?: React.ComponentType<{ href: string; className?: string; children?: React.ReactNode; [key: string]: unknown }>
}

export function ProductCard({
  product,
  href,
  capabilities,
  linkComponent: LinkComp = Link,
}: ProductCardProps) {
  const thumbnail = product.thumbnail || product.images[0]
  const isSoldOut = !product.inStock || (product.totalStock !== undefined && product.totalStock <= 0)
  const isLowStock = !isSoldOut && product.totalStock !== undefined && product.totalStock > 0 && product.totalStock <= 5

  const colorOption = capabilities?.hasColorSwatches
    ? product.options?.find((o) => o.title.toLowerCase() === "color")
    : undefined

  const variantCount = product.variants?.length || 0
  const fabricInfo = product.material || product.subtitle || "British Smart-Casual"

  return (
    <LinkComp
      href={href}
      className="group flex flex-col bg-white border border-brand-border/70 hover:border-brand-primary transition-all duration-300 hover:shadow-lg"
    >
      <div data-testid="product-wrapper" className="flex flex-col h-full">
        {/* Thumbnail Image Container */}
        <div className="relative aspect-[3/4] w-full bg-brand-secondary overflow-hidden">
          {thumbnail?.url ? (
            <Image
              src={thumbnail.url}
              alt={thumbnail.altText || product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-brand-muted text-xs">
              No Image
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10">
            {product.isNewArrival && (
              <div className="bg-brand-accent text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">
                New In
              </div>
            )}
            {product.isBestSeller && !product.isNewArrival && (
              <div className="bg-brand-secondary text-brand-accent border border-brand-accent/30 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">
                Bestseller
              </div>
            )}
            {isSoldOut && (
              <div className="bg-rose-800 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">
                Sold Out
              </div>
            )}
            {isLowStock && (
              <div className="bg-amber-700 text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-xs">
                Only {product.totalStock} Left
              </div>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
          <div className="space-y-1">
            <h3
              className="font-heading font-bold text-sm text-brand-primary group-hover:text-brand-accent transition-colors line-clamp-1"
              data-testid="product-title"
            >
              {product.title}
            </h3>
            <p className="text-[11px] text-brand-primary/60 line-clamp-1">
              {fabricInfo}
            </p>
          </div>

          {/* Color Swatches if enabled */}
          {colorOption && colorOption.values.length > 0 && (
            <div className="flex items-center gap-1.5 pt-1">
              {colorOption.values.slice(0, 5).map((val) => {
                const hex = COLOR_SWATCHES[val.toLowerCase()] || "#cccccc"
                return (
                  <span
                    key={val}
                    title={val}
                    style={{ backgroundColor: hex }}
                    className="w-3 h-3 rounded-full border border-brand-border shadow-2xs"
                  />
                )
              })}
              {colorOption.values.length > 5 && (
                <span className="text-[10px] text-brand-muted font-medium">
                  +{colorOption.values.length - 5}
                </span>
              )}
            </div>
          )}

          <div className="pt-2 border-t border-brand-border/40 flex items-center justify-between">
            <div className="flex items-baseline gap-1.5">
              <span className="font-heading font-bold text-xs sm:text-sm text-brand-primary">
                {product.minPrice.formatted}
              </span>
              {product.minPrice.approxUsd && (
                <span className="text-[10px] text-brand-muted">
                  (≈${product.minPrice.approxUsd})
                </span>
              )}
            </div>

            {variantCount > 0 && (
              <span className="text-[10px] uppercase font-semibold tracking-wider text-brand-primary/50">
                {variantCount} Variants
              </span>
            )}
          </div>
        </div>
      </div>
    </LinkComp>
  )
}
