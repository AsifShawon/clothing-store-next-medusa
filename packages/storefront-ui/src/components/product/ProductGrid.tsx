import React from "react"
import Link from "next/link"
import {
  ProductView,
  QuickAddRequest,
  QuickAddResult,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { ProductCard } from "./ProductCard"
import { LinkComponent } from "../../types"

export interface ProductGridProps {
  products: ProductView[]
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  emptyStateTitle?: string
  emptyStateMessage?: string
  linkComponent?: LinkComponent
}

export function ProductGrid({
  products,
  routes,
  capabilities,
  onQuickAdd,
  emptyStateTitle = "No garments found",
  emptyStateMessage = "Try adjusting your filters or search keywords.",
  linkComponent: LinkComp = Link,
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return (
      <div className="py-20 text-center space-y-4 border border-brand-border bg-brand-surface p-8 max-w-xl mx-auto my-8">
        <h3 className="font-heading font-bold text-base text-brand-primary uppercase tracking-wider">
          {emptyStateTitle}
        </h3>
        <p className="text-xs text-brand-muted max-w-md mx-auto">
          {emptyStateMessage}
        </p>
        <div className="pt-2">
          <LinkComp
            href={routes.catalog()}
            className="contrast-btn text-xs inline-block"
          >
            Explore All Garments
          </LinkComp>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          href={routes.product(product.handle)}
          capabilities={capabilities}
          onQuickAdd={onQuickAdd}
          linkComponent={LinkComp}
        />
      ))}
    </div>
  )
}
