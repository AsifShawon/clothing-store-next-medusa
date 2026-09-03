"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  CategoryView,
  ProductFilterView,
  ProductView,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { FilterSidebar } from "../components/catalog/FilterSidebar"
import { SortDropdown } from "../components/catalog/SortDropdown"
import { ProductGrid } from "../components/product/ProductGrid"
import { Drawer } from "../components/ui/drawer"
import { AdjustmentsIcon } from "../components/icons"
import { LinkComponent } from "../types"

export interface CatalogViewProps {
  title?: string
  description?: string
  products: ProductView[]
  totalCount?: number
  categories?: CategoryView[]
  filters: ProductFilterView
  onFilterChange: (filters: ProductFilterView) => void
  onResetFilters: () => void
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  breadcrumbs?: Array<{ label: string; href: string }>
  linkComponent?: LinkComponent
}

export function CatalogView({
  title = "All Clothing",
  description = "Minimalist luxury essentials tailored for the humid climate and versatile lifestyle of Bangladesh.",
  products,
  totalCount,
  categories,
  filters,
  onFilterChange,
  onResetFilters,
  routes,
  capabilities,
  breadcrumbs = [
    { label: "Home", href: routes.home() },
    { label: "Shop", href: routes.catalog() },
  ],
  linkComponent: LinkComp = Link,
}: CatalogViewProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const displayCount = totalCount !== undefined ? totalCount : products.length

  return (
    <div className="bg-white min-h-screen">
      {/* Catalog Header Banner */}
      <div className="border-b border-brand-border bg-brand-surface py-10 sm:py-14">
        <div className="content-container space-y-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-heading uppercase tracking-wider text-brand-muted">
            {breadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.href}>
                {i > 0 && <span>/</span>}
                {i === breadcrumbs.length - 1 ? (
                  <span className="text-brand-primary font-bold">{crumb.label}</span>
                ) : (
                  <LinkComp href={crumb.href} className="hover:text-brand-primary transition-colors">
                    {crumb.label}
                  </LinkComp>
                )}
              </React.Fragment>
            ))}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1 max-w-2xl">
              <h1 className="font-display text-3xl sm:text-4xl text-brand-primary font-normal tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xs text-brand-muted leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            <div className="text-xs font-heading font-medium text-brand-muted">
              <span>Showing {displayCount} {displayCount === 1 ? "Garment" : "Garments"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="content-container py-8 sm:py-12">
        {/* Filter and Sort Control Bar */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-brand-border">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3.5 py-2 bg-brand-surface border border-brand-border text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:bg-brand-secondary transition-colors"
          >
            <AdjustmentsIcon className="w-4 h-4 text-brand-accent" />
            <span>Filters</span>
          </button>

          <div className="hidden lg:block">
            {/* Desktop spacer */}
            <span className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary">
              Refine Collection
            </span>
          </div>

          {/* Sort Dropdown */}
          <SortDropdown
            value={filters.sortBy}
            onChange={(sortBy) => onFilterChange({ ...filters, sortBy })}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <FilterSidebar
              filters={filters}
              onFilterChange={onFilterChange}
              categories={categories}
              capabilities={capabilities}
              onResetFilters={onResetFilters}
            />
          </div>

          {/* Product Grid Area */}
          <div className="lg:col-span-9">
            <ProductGrid
              products={products}
              routes={routes}
              capabilities={capabilities}
              linkComponent={LinkComp}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <Drawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        title="Refine Garments"
        position="left"
        maxWidth="sm"
      >
        <div className="py-2">
          <FilterSidebar
            filters={filters}
            onFilterChange={(newFilters) => {
              onFilterChange(newFilters)
              setIsMobileFilterOpen(false)
            }}
            categories={categories}
            capabilities={capabilities}
            onResetFilters={() => {
              onResetFilters()
              setIsMobileFilterOpen(false)
            }}
          />
        </div>
      </Drawer>
    </div>
  )
}
