import React from "react"
import { ProductVariantView, ProductView } from "@dtc/commerce-contracts"

export interface ProductInfoProps {
  product: ProductView
  selectedVariant?: ProductVariantView
}

export function ProductInfo({ product, selectedVariant }: ProductInfoProps) {
  const activePrice = selectedVariant?.price || product.minPrice
  const originalPrice = selectedVariant?.originalPrice
  const isSoldOut = selectedVariant
    ? !selectedVariant.inStock
    : !product.inStock

  const stockQty = selectedVariant?.inventoryQuantity !== undefined
    ? selectedVariant.inventoryQuantity
    : product.totalStock

  const isLowStock = !isSoldOut && stockQty !== undefined && stockQty > 0 && stockQty <= 5

  return (
    <div className="space-y-4 border-b border-brand-border pb-6">
      {/* Category Tag & Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {product.categoryNames[0] && (
          <span className="badge-tag">
            {product.categoryNames[0]}
          </span>
        )}
        {product.isNewArrival && (
          <span className="badge-tag bg-brand-primary text-white border-none">
            New In
          </span>
        )}
        {product.isBestSeller && !product.isNewArrival && (
          <span className="badge-tag bg-brand-secondary text-brand-accent border-brand-accent/30">
            Bestseller
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-primary leading-tight">
        {product.title}
      </h1>

      {/* Subtitle / Fabric info */}
      {(product.material || product.subtitle) && (
        <p className="text-xs font-heading font-medium text-brand-muted uppercase tracking-wider">
          {product.material || product.subtitle}
        </p>
      )}

      {/* Pricing & Stock Messaging */}
      <div className="pt-2 flex flex-wrap items-baseline justify-between gap-4">
        <div className="flex items-baseline gap-2">
          <span className="font-heading font-bold text-xl sm:text-2xl text-brand-primary">
            {activePrice.formatted}
          </span>
          {originalPrice && (
            <span className="font-heading text-sm text-brand-muted line-through">
              {originalPrice.formatted}
            </span>
          )}
          {activePrice.approxUsd && (
            <span className="text-xs text-brand-muted">
              (approx. ${activePrice.approxUsd})
            </span>
          )}
        </div>

        {/* Stock Messaging */}
        <div>
          {isSoldOut ? (
            <span className="text-xs font-heading font-bold text-rose-800 uppercase tracking-wider">
              Sold Out
            </span>
          ) : isLowStock ? (
            <span className="text-xs font-heading font-bold text-amber-700 uppercase tracking-wider">
              Only {stockQty} Left
            </span>
          ) : (
            <span className="text-xs font-heading font-semibold text-emerald-800 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-700" />
              <span>In Stock • Ready to Dispatch</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
