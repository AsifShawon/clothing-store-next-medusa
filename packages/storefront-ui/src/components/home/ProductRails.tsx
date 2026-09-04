import React from "react"
import {
  ProductView,
  QuickAddRequest,
  QuickAddResult,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { ProductCard } from "../product/ProductCard"
import { ProductRailScroller } from "./ProductRailScroller"
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
  linkComponent,
}: ProductRailsProps) {
  if (!products || products.length === 0) return null

  return (
    <ProductRailScroller
      title={title}
      subtitle={subtitle}
      viewAllHref={viewAllHref}
      viewAllLabel={viewAllLabel}
      linkComponent={linkComponent}
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
          />
        </div>
      ))}
    </ProductRailScroller>
  )
}
