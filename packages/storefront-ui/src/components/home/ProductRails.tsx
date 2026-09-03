"use client"

import React, { useRef } from "react"
import Link from "next/link"
import {
  ProductView,
  QuickAddRequest,
  QuickAddResult,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { ProductCard } from "../product/ProductCard"
import { ArrowLeftIcon, ArrowRightIcon } from "../icons"
import { LinkComponent } from "../../types"

export interface ProductRailsProps {
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
  products: ProductView[]
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  linkComponent?: LinkComponent
}

export function ProductRails({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  products,
  routes,
  capabilities,
  onQuickAdd,
  linkComponent: LinkComp = Link,
}: ProductRailsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  if (!products || products.length === 0) return null

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -340 : 340
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" })
    }
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white border-b border-brand-border/80">
      <div className="editorial-container space-y-6 sm:space-y-8">
        {/* Rail Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-border/60 pb-4">
          <div className="space-y-1.5">
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl text-brand-primary tracking-tight font-normal">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-brand-muted max-w-xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            {viewAllHref && (
              <LinkComp
                href={viewAllHref}
                className="text-xs font-heading font-bold uppercase tracking-wider text-brand-accent hover:underline flex items-center gap-1 group"
              >
                <span>{viewAllLabel}</span>
                <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </LinkComp>
            )}

            {/* Desktop Previous / Next Controls */}
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-brand-border/60">
              <button
                type="button"
                onClick={() => scroll("left")}
                aria-label="Previous garments"
                className="w-8 h-8 rounded-full border border-brand-border bg-white hover:bg-brand-secondary text-brand-primary flex items-center justify-center transition-colors"
              >
                <ArrowLeftIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => scroll("right")}
                aria-label="Next garments"
                className="w-8 h-8 rounded-full border border-brand-border bg-white hover:bg-brand-secondary text-brand-primary flex items-center justify-center transition-colors"
              >
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Scrollable Product Rail */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto no-scrollbar pb-4 pt-1 snap-x snap-mandatory"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="w-[260px] sm:w-[280px] lg:w-[310px] flex-shrink-0 snap-start"
            >
              <ProductCard
                product={product}
                href={routes.product(product.handle)}
                capabilities={capabilities}
                onQuickAdd={onQuickAdd}
                linkComponent={LinkComp}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
