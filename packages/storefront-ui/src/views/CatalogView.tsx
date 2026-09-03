"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  CategoryView,
  ProductFilterView,
  ProductView,
  QuickAddRequest,
  QuickAddResult,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { FilterSidebar } from "../components/catalog/FilterSidebar"
import { SortDropdown } from "../components/catalog/SortDropdown"
import { ProductGrid } from "../components/product/ProductGrid"
import { Drawer } from "../components/ui/drawer"
import { AdjustmentsIcon, XMarkIcon } from "../components/icons"
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
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  isLoading?: boolean
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
  onQuickAdd,
  isLoading = false,
  breadcrumbs = [
    { label: "Home", href: routes.home() },
    { label: "Shop", href: routes.catalog() },
  ],
  linkComponent: LinkComp = Link,
}: CatalogViewProps) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const displayCount = totalCount !== undefined ? totalCount : products.length

  // Build active filter chips
  const activeChips: Array<{ id: string; label: string; onRemove: () => void }> = []
  if (filters.category) {
    const catName = categories?.find((c) => c.handle === filters.category)?.name || filters.category
    activeChips.push({
      id: "category",
      label: `Category: ${catName}`,
      onRemove: () => onFilterChange({ ...filters, category: undefined }),
    })
  }
  if (filters.size) {
    activeChips.push({
      id: "size",
      label: `Size: ${filters.size}`,
      onRemove: () => onFilterChange({ ...filters, size: undefined }),
    })
  }
  if (filters.color) {
    activeChips.push({
      id: "color",
      label: `Color: ${filters.color}`,
      onRemove: () => onFilterChange({ ...filters, color: undefined }),
    })
  }
  if (filters.inStockOnly) {
    activeChips.push({
      id: "inStock",
      label: "In Stock Only",
      onRemove: () => onFilterChange({ ...filters, inStockOnly: false }),
    })
  }
  if (filters.search) {
    activeChips.push({
      id: "search",
      label: `Keyword: "${filters.search}"`,
      onRemove: () => onFilterChange({ ...filters, search: undefined }),
    })
  }

  return (
    <div className="bg-white min-h-screen">
      {/* Catalog Header Banner */}
      <div className="border-b border-brand-border/80 bg-brand-surface py-10 sm:py-14">
        <div className="editorial-container space-y-4">
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
              <h1 className="font-display text-3xl sm:text-5xl text-brand-primary font-normal tracking-tight">
                {title}
              </h1>
              {description && (
                <p className="text-xs sm:text-sm text-brand-muted leading-relaxed font-sans">
                  {description}
                </p>
              )}
            </div>

            <div className="text-xs font-heading font-semibold uppercase tracking-wider text-brand-muted">
              <span>{displayCount} {displayCount === 1 ? "Garment" : "Garments"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="editorial-container py-8 sm:py-12">
        {/* Filter and Sort Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-6 border-b border-brand-border/80">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-brand-surface border border-brand-border rounded-full text-xs font-heading font-semibold uppercase tracking-wider text-brand-primary hover:bg-brand-secondary transition-colors"
          >
            <AdjustmentsIcon className="w-4 h-4 text-brand-accent" />
            <span>Refine ({activeChips.length})</span>
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-primary">
              Refine Collection
            </span>
            {displayCount > 0 && (
              <span className="text-[11px] text-brand-muted font-heading">
                • {displayCount} results
              </span>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-heading text-brand-muted hidden sm:inline">
              Sort by:
            </span>
            <SortDropdown
              value={filters.sortBy}
              onChange={(sortBy) => onFilterChange({ ...filters, sortBy })}
            />
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeChips.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pb-6 mb-6 border-b border-brand-border/60 animate-mega-enter">
            <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-muted mr-1">
              Active Filters:
            </span>
            {activeChips.map((chip) => (
              <span
                key={chip.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-secondary border border-brand-border rounded-full text-xs font-heading font-medium text-brand-primary"
              >
                <span>{chip.label}</span>
                <button
                  type="button"
                  onClick={chip.onRemove}
                  className="hover:text-rose-700 transition-colors p-0.5"
                  aria-label={`Remove filter ${chip.label}`}
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </span>
            ))}
            <button
              type="button"
              onClick={onResetFilters}
              className="text-xs font-heading font-bold text-brand-accent hover:underline uppercase tracking-wider ml-2"
            >
              Clear All
            </button>
          </div>
        )}

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
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="flex flex-col space-y-3">
                    <div className="aspect-[3/4] bg-brand-secondary rounded-xl" />
                    <div className="h-4 bg-brand-secondary rounded w-3/4" />
                    <div className="h-3 bg-brand-secondary rounded w-1/2" />
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid
                products={products}
                routes={routes}
                capabilities={capabilities}
                onQuickAdd={onQuickAdd}
                emptyStateTitle="No garments match your filters"
                emptyStateMessage="Try adjusting size, color, or category choices, or clear all filters to view our full collection."
                linkComponent={LinkComp}
              />
            )}
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
