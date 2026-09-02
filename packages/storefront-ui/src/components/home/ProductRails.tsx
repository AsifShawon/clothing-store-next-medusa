import React from "react"
import Link from "next/link"
import { ProductView, StoreCapabilities, StoreRoutes } from "@dtc/commerce-contracts"
import { ProductCard } from "../product/ProductCard"

export interface ProductRailsProps {
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
  products: ProductView[]
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>
}

export function ProductRails({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View All",
  products,
  routes,
  capabilities,
  linkComponent: LinkComp = Link,
}: ProductRailsProps) {
  if (!products || products.length === 0) return null

  return (
    <section className="py-16 sm:py-20 bg-white border-b border-brand-border">
      <div className="content-container space-y-8">
        {/* Rail Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-brand-border pb-4">
          <div className="space-y-1">
            <h2 className="font-display text-2xl sm:text-3xl text-brand-primary font-normal">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-brand-muted max-w-lg">
                {subtitle}
              </p>
            )}
          </div>
          {viewAllHref && (
            <LinkComp
              href={viewAllHref}
              className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:text-brand-accent underline underline-offset-4 transition-colors"
            >
              {viewAllLabel} →
            </LinkComp>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              href={routes.product(product.handle)}
              capabilities={capabilities}
              linkComponent={LinkComp}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
