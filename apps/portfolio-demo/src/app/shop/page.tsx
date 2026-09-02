"use client"

import React, { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useDemoProducts } from "@lib/demo-store-context"
import { ProductGrid } from "@components/store/product-grid"
import { FilterSidebar, FilterState } from "@components/store/filter-sidebar"
import { MobileFilterDrawer } from "@components/store/mobile-filter-drawer"
import { formatBDT } from "@lib/utils"
import {
  Adjustments,
  MagnifyingGlass,
  XMark,
  ArrowUpDown,
} from "@medusajs/icons"

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"
  const initialCollection = searchParams.get("collection") || "all"
  const initialSearch = searchParams.get("q") || ""

  const { allProducts, categories, collections } = useDemoProducts()

  const [filters, setFilters] = useState<FilterState>({
    search: initialSearch,
    category: initialCategory,
    collection: initialCollection,
    size: "all",
    color: "all",
    minPrice: 800,
    maxPrice: 3000,
    inStockOnly: false,
    sortBy: "featured",
  })

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)

  const handleResetFilters = () => {
    setFilters({
      search: "",
      category: "all",
      collection: "all",
      size: "all",
      color: "all",
      minPrice: 800,
      maxPrice: 3000,
      inStockOnly: false,
      sortBy: "featured",
    })
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        // Status check
        if (product.status !== "published") return false

        // Search text check
        if (filters.search.trim()) {
          const q = filters.search.toLowerCase()
          const matchTitle = product.title.toLowerCase().includes(q)
          const matchDesc = product.description.toLowerCase().includes(q)
          const matchMat = product.material.toLowerCase().includes(q)
          const matchTags = product.tags.some((t) => t.toLowerCase().includes(q))
          if (!matchTitle && !matchDesc && !matchMat && !matchTags) return false
        }

        // Category check
        if (filters.category !== "all") {
          const match = product.categoryNames.some(
            (c) => c.toLowerCase() === filters.category.toLowerCase()
          )
          if (!match) return false
        }

        // Collection check
        if (filters.collection !== "all") {
          if (product.collectionHandle !== filters.collection) return false
        }

        // Size check
        if (filters.size !== "all") {
          const hasSize = product.variants.some((v) => v.options["Size"] === filters.size)
          if (!hasSize) return false
        }

        // Color check
        if (filters.color !== "all") {
          const hasColor = product.variants.some(
            (v) => v.options["Color"]?.toLowerCase() === filters.color.toLowerCase()
          )
          if (!hasColor) return false
        }

        // Price range check
        const minVariantPrice = Math.min(...product.variants.map((v) => v.price))
        if (minVariantPrice > filters.maxPrice || minVariantPrice < filters.minPrice) {
          return false
        }

        // In-stock check
        if (filters.inStockOnly) {
          const inStock = product.variants.some(
            (v) => !v.manageInventory || v.inventoryQuantity > 0
          )
          if (!inStock) return false
        }

        return true
      })
      .sort((a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.price))
        const minB = Math.min(...b.variants.map((v) => v.price))

        if (filters.sortBy === "price_asc") return minA - minB
        if (filters.sortBy === "price_desc") return minB - minA
        if (filters.sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        return 0 // "featured" maintains catalog order
      })
  }, [allProducts, filters])

  const activeFilterChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = []
    if (filters.search) {
      chips.push({
        label: `"${filters.search}"`,
        onRemove: () => setFilters((p) => ({ ...p, search: "" })),
      })
    }
    if (filters.category !== "all") {
      chips.push({
        label: `Dept: ${filters.category}`,
        onRemove: () => setFilters((p) => ({ ...p, category: "all" })),
      })
    }
    if (filters.collection !== "all") {
      chips.push({
        label: `Col: ${filters.collection}`,
        onRemove: () => setFilters((p) => ({ ...p, collection: "all" })),
      })
    }
    if (filters.size !== "all") {
      chips.push({
        label: `Size: ${filters.size}`,
        onRemove: () => setFilters((p) => ({ ...p, size: "all" })),
      })
    }
    if (filters.color !== "all") {
      chips.push({
        label: `Color: ${filters.color}`,
        onRemove: () => setFilters((p) => ({ ...p, color: "all" })),
      })
    }
    if (filters.inStockOnly) {
      chips.push({
        label: "In Stock Only",
        onRemove: () => setFilters((p) => ({ ...p, inStockOnly: false })),
      })
    }
    if (filters.maxPrice < 3000) {
      chips.push({
        label: `Max Price: ${formatBDT(filters.maxPrice)}`,
        onRemove: () => setFilters((p) => ({ ...p, maxPrice: 3000 })),
      })
    }
    return chips
  }, [filters])

  return (
    <div className="content-container py-10 sm:py-14 space-y-8">
      {/* Page Header */}
      <div className="border-b border-brand-border pb-6 space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl text-brand-primary">
          All Garments
        </h1>
        <p className="text-xs sm:text-sm text-grey-60 max-w-xl">
          Explore our signature heavyweight 240 GSM tees, British Oxford shirts, mercerized polos, and stretch chinos crafted for everyday luxury.
        </p>
      </div>

      {/* Controls Bar (Search Input, Mobile Filter Trigger, Sort Dropdown, Result Count) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-brand-surface p-3.5 border border-brand-border">
        {/* Search Bar Input */}
        <div className="relative flex-1 max-w-md">
          <MagnifyingGlass className="w-4 h-4 text-grey-40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={filters.search}
            onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
            placeholder="Search by title, SKU, or fabric..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-brand-border text-xs text-brand-primary placeholder:text-grey-40 focus:outline-none focus:border-brand-primary"
          />
        </div>

        {/* Filter Trigger & Sort Options */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 bg-white border border-brand-border text-brand-primary font-semibold flex items-center gap-1.5 hover:bg-brand-secondary transition-colors"
          >
            <Adjustments className="w-4 h-4 text-brand-accent" />
            <span>Filters {activeFilterChips.length > 0 ? `(${activeFilterChips.length})` : ""}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-grey-40 hidden sm:inline" />
            <span className="text-grey-50 hidden sm:inline">Sort:</span>
            <select
              value={filters.sortBy}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, sortBy: e.target.value as FilterState["sortBy"] }))
              }
              className="px-3 py-2 bg-white border border-brand-border text-xs font-medium text-brand-primary focus:outline-none focus:border-brand-primary cursor-pointer"
            >
              <option value="featured">Featured Catalog</option>
              <option value="newest">Newest Additions</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {activeFilterChips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-[11px] font-bold text-grey-40 uppercase tracking-wider">
            Active Filters:
          </span>
          {activeFilterChips.map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-secondary border border-brand-border text-xs text-brand-primary rounded font-medium"
            >
              <span>{chip.label}</span>
              <button
                type="button"
                onClick={chip.onRemove}
                className="text-grey-40 hover:text-brand-primary p-0.5"
                aria-label={`Remove filter ${chip.label}`}
              >
                <XMark className="w-3 h-3" />
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-brand-accent hover:underline font-semibold ml-2"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar + Product Grid */}
      <div className="flex gap-8 items-start">
        {/* Desktop Facet Sidebar */}
        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          categories={categories}
          collections={collections}
          onReset={handleResetFilters}
          totalCount={filteredProducts.length}
        />

        {/* Products Grid & Results Counter */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between text-xs text-grey-50 border-b border-brand-border pb-2">
            <span>
              Showing <strong>{filteredProducts.length}</strong> of {allProducts.length} garments
            </span>
          </div>

          <ProductGrid
            products={filteredProducts}
            emptyMessage="No garments match your selected criteria. Try resetting filters."
            resetAction={handleResetFilters}
          />
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      <MobileFilterDrawer
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        filters={filters}
        setFilters={setFilters}
        categories={categories}
        collections={collections}
        onReset={handleResetFilters}
        totalCount={filteredProducts.length}
      />
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  )
}
