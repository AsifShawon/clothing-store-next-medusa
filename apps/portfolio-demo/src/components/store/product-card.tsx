"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { DemoProduct } from "@lib/types"
import { Price } from "./price"

interface ProductCardProps {
  product: DemoProduct
}

const COLOR_SWATCHES: Record<string, string> = {
  black: "#111111",
  white: "#FFFFFF",
  "sky blue": "#87CEEB",
  "forest green": "#1E4937",
  "midnight navy": "#1B2A4A",
  khaki: "#C3B091",
  charcoal: "#36454F",
  olive: "#556B2F",
  sand: "#CFC4B5",
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const minPrice = Math.min(...product.variants.map((v) => v.price))
  const totalStock = product.variants.reduce((sum, v) => sum + (v.inventoryQuantity || 0), 0)
  const isOutOfStock = totalStock <= 0
  const isLowStock = totalStock > 0 && totalStock < 25

  const primaryImage = product.thumbnail || product.images[0]
  const secondaryImage = product.images[1] || primaryImage

  // Extract unique colors for display swatches
  const colorOption = product.options.find((opt) => opt.title.toLowerCase() === "color")
  const colors = colorOption ? colorOption.values : []

  return (
    <div
      className="group relative flex flex-col bg-white border border-brand-border overflow-hidden transition-all duration-300 hover:shadow-md hover:border-brand-accent/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Container */}
      <Link
        href={`/product?handle=${product.handle}`}
        className="relative aspect-[3/4] w-full bg-brand-secondary overflow-hidden block"
        aria-label={`View details for ${product.title}`}
      >
        <Image
          src={isHovered && secondaryImage ? secondaryImage : primaryImage}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover object-center transition-all duration-500 ease-out group-hover:scale-105"
        />

        {/* Status Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.collectionHandle === "new-arrivals" && (
            <span className="bg-brand-accent text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 shadow-sm">
              New Arrival
            </span>
          )}
          {product.collectionHandle === "best-sellers" && (
            <span className="bg-brand-primary text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 shadow-sm">
              Best Seller
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-rose-900 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 shadow-sm">
              Sold Out
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="bg-amber-800 text-white text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 shadow-sm">
              Low Stock ({totalStock} left)
            </span>
          )}
        </div>

        {/* Quick View Pill */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
          <div className="w-full py-2 bg-brand-primary/95 text-white text-xs font-semibold text-center uppercase tracking-wider backdrop-blur-sm shadow">
            View Details
          </div>
        </div>
      </Link>

      {/* Product Information */}
      <div className="p-4 flex flex-col flex-1 space-y-2">
        {/* Category & Color Swatches */}
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] uppercase font-bold tracking-wider text-brand-accent">
            {product.categoryNames[0] || "Garment"}
          </span>

          {colors.length > 0 && (
            <div className="flex items-center gap-1">
              {colors.map((c) => {
                const hex = COLOR_SWATCHES[c.toLowerCase()] || "#E5E5E5"
                return (
                  <span
                    key={c}
                    title={c}
                    className={`w-2.5 h-2.5 rounded-full border ${
                      hex === "#FFFFFF" ? "border-grey-40" : "border-transparent"
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                )
              })}
            </div>
          )}
        </div>

        {/* Title */}
        <h3 className="font-heading font-bold text-sm text-brand-primary group-hover:text-brand-accent transition-colors line-clamp-1">
          <Link href={`/product?handle=${product.handle}`}>
            {product.title}
          </Link>
        </h3>

        {/* Subtitle / Fabric info */}
        <p className="text-xs text-grey-50 line-clamp-1 flex-1">
          {product.subtitle || product.material}
        </p>

        {/* Price & Variant Count */}
        <div className="pt-2 border-t border-brand-border/60 flex items-center justify-between">
          <Price amount={minPrice} className="text-sm font-bold text-brand-primary" />
          <span className="text-[11px] text-grey-40 font-medium">
            {product.variants.length} {product.variants.length === 1 ? "variant" : "variants"}
          </span>
        </div>
      </div>
    </div>
  )
}
