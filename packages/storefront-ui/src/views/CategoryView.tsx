"use client"

import React from "react"
import Link from "next/link"
import {
  CategoryView as CategoryModel,
  ProductFilterView,
  ProductView,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { CatalogView } from "./CatalogView"

export interface CategoryViewProps {
  category: CategoryModel
  products: ProductView[]
  totalCount?: number
  filters: ProductFilterView
  onFilterChange: (filters: ProductFilterView) => void
  onResetFilters: () => void
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  linkComponent?: React.ComponentType<{ href: string; className?: string; children: React.ReactNode }>
}

export function CategoryView({
  category,
  products,
  totalCount,
  filters,
  onFilterChange,
  onResetFilters,
  routes,
  capabilities,
  linkComponent = Link,
}: CategoryViewProps) {
  const breadcrumbs = [
    { label: "Home", href: routes.home() },
    { label: "Shop", href: routes.catalog() },
    { label: category.name, href: routes.category(category.handle) },
  ]

  return (
    <CatalogView
      title={category.name}
      description={category.description || `Explore our curated edit of ${category.name.toLowerCase()}.`}
      products={products}
      totalCount={totalCount}
      filters={filters}
      onFilterChange={onFilterChange}
      onResetFilters={onResetFilters}
      routes={routes}
      capabilities={capabilities}
      breadcrumbs={breadcrumbs}
      linkComponent={linkComponent}
    />
  )
}
