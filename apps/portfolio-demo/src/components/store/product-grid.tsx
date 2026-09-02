"use client"

import React from "react"
import { DemoProduct } from "@lib/types"
import { ProductCard } from "./product-card"
import Link from "next/link"

interface ProductGridProps {
  products: DemoProduct[]
  isLoading?: boolean
  emptyMessage?: string
  resetAction?: () => void
}

export function ProductGrid({
  products,
  isLoading = false,
  emptyMessage = "No garments match your current selection.",
  resetAction,
}: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-white border border-brand-border p-4 space-y-3 animate-pulse"
          >
            <div className="aspect-[3/4] bg-brand-secondary/70 w-full" />
            <div className="h-4 bg-brand-secondary/80 w-3/4" />
            <div className="h-3 bg-brand-secondary/60 w-1/2" />
            <div className="h-4 bg-brand-secondary/80 w-1/4 pt-2" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="py-16 text-center bg-white border border-brand-border p-8 space-y-4 max-w-lg mx-auto">
        <div className="w-12 h-12 bg-brand-secondary rounded-full flex items-center justify-center mx-auto text-grey-40">
          ✦
        </div>
        <h3 className="font-heading font-bold text-lg text-brand-primary">No Garments Found</h3>
        <p className="text-xs text-grey-50 leading-relaxed">
          {emptyMessage}
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          {resetAction ? (
            <button
              type="button"
              onClick={resetAction}
              className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
            >
              Reset Filters
            </button>
          ) : (
            <Link
              href="/shop"
              className="px-4 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
            >
              Browse All Clothing
            </Link>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
