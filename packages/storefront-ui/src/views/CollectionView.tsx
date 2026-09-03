"use client"

import React from "react"
import Link from "next/link"
import {
  CollectionView as CollectionModel,
  ProductFilterView,
  ProductView,
  QuickAddRequest,
  QuickAddResult,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { CatalogView } from "./CatalogView"
import { LinkComponent } from "../types"

export interface CollectionViewProps {
  collection: CollectionModel
  products: ProductView[]
  totalCount?: number
  filters: ProductFilterView
  onFilterChange: (filters: ProductFilterView) => void
  onResetFilters: () => void
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  isLoading?: boolean
  linkComponent?: LinkComponent
}

export function CollectionView({
  collection,
  products,
  totalCount,
  filters,
  onFilterChange,
  onResetFilters,
  routes,
  capabilities,
  onQuickAdd,
  isLoading,
  linkComponent = Link,
}: CollectionViewProps) {
  const breadcrumbs = [
    { label: "Home", href: routes.home() },
    { label: "Shop", href: routes.catalog() },
    { label: collection.title, href: routes.collection(collection.handle) },
  ]

  return (
    <CatalogView
      title={collection.title}
      description={collection.description || `Explore our seasonal capsule of ${collection.title.toLowerCase()}.`}
      products={products}
      totalCount={totalCount}
      filters={filters}
      onFilterChange={onFilterChange}
      onResetFilters={onResetFilters}
      routes={routes}
      capabilities={capabilities}
      onQuickAdd={onQuickAdd}
      isLoading={isLoading}
      breadcrumbs={breadcrumbs}
      linkComponent={linkComponent}
    />
  )
}
