"use client"

import React from "react"
import { DemoCategory, DemoCollection } from "@lib/types"
import { formatBDT } from "@lib/utils"
import { ArrowPath } from "@medusajs/icons"

export interface FilterState {
  search: string
  category: string
  collection: string
  size: string
  color: string
  minPrice: number
  maxPrice: number
  inStockOnly: boolean
  sortBy: "featured" | "newest" | "price_asc" | "price_desc"
}

interface FilterSidebarProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  categories: DemoCategory[]
  collections: DemoCollection[]
  onReset: () => void
  totalCount: number
}

const AVAILABLE_SIZES = ["S", "M", "L", "XL", "30", "32", "34", "36", "One Size"]

const COLOR_MAP: Record<string, string> = {
  Black: "#111111",
  White: "#FFFFFF",
  "Sky Blue": "#87CEEB",
  "Forest Green": "#1E4937",
  "Midnight Navy": "#1B2A4A",
  Khaki: "#C3B091",
  Charcoal: "#36454F",
  Olive: "#556B2F",
  Sand: "#CFC4B5",
}

export function FilterSidebar({
  filters,
  setFilters,
  categories,
  collections,
  onReset,
  totalCount,
}: FilterSidebarProps) {
  const hasActiveFilters =
    filters.search !== "" ||
    filters.category !== "all" ||
    filters.collection !== "all" ||
    filters.size !== "all" ||
    filters.color !== "all" ||
    filters.inStockOnly ||
    filters.minPrice > 0 ||
    filters.maxPrice < 3000

  return (
    <aside className="w-64 flex-shrink-0 space-y-6 hidden lg:block" aria-label="Catalog Filters">
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-brand-border pb-3">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
          Filters
        </h3>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs text-brand-accent hover:text-brand-primary font-medium flex items-center gap-1 transition-colors"
          >
            <ArrowPath className="w-3 h-3" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Category Facet */}
      <div className="space-y-2.5">
        <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
          Department
        </span>
        <div className="space-y-1 text-xs">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, category: "all" }))}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
              filters.category === "all"
                ? "bg-brand-primary text-white font-semibold"
                : "text-grey-70 hover:bg-brand-secondary"
            }`}
          >
            All Departments
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, category: cat.name }))}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                filters.category.toLowerCase() === cat.name.toLowerCase()
                  ? "bg-brand-primary text-white font-semibold"
                  : "text-grey-70 hover:bg-brand-secondary"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Collection Facet */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
          Collection
        </span>
        <div className="space-y-1 text-xs">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, collection: "all" }))}
            className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
              filters.collection === "all"
                ? "bg-brand-primary text-white font-semibold"
                : "text-grey-70 hover:bg-brand-secondary"
            }`}
          >
            All Collections
          </button>
          {collections.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, collection: col.handle }))}
              className={`w-full text-left px-2.5 py-1.5 rounded transition-colors ${
                filters.collection === col.handle
                  ? "bg-brand-primary text-white font-semibold"
                  : "text-grey-70 hover:bg-brand-secondary"
              }`}
            >
              {col.title}
            </button>
          ))}
        </div>
      </div>

      {/* Size Facet */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
          Size
        </span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setFilters((prev) => ({ ...prev, size: "all" }))}
            className={`px-2.5 py-1 text-xs border rounded transition-colors ${
              filters.size === "all"
                ? "bg-brand-primary text-white border-brand-primary font-bold"
                : "bg-white text-grey-70 border-brand-border hover:border-brand-primary"
            }`}
          >
            All
          </button>
          {AVAILABLE_SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setFilters((prev) => ({ ...prev, size: filters.size === sz ? "all" : sz }))}
              className={`px-2.5 py-1 text-xs border rounded transition-colors ${
                filters.size === sz
                  ? "bg-brand-primary text-white border-brand-primary font-bold"
                  : "bg-white text-grey-70 border-brand-border hover:border-brand-primary"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Color Facet */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
          Color
        </span>
        <div className="flex flex-wrap gap-2">
          {Object.entries(COLOR_MAP).map(([colorName, hex]) => {
            const isSelected = filters.color.toLowerCase() === colorName.toLowerCase()
            return (
              <button
                key={colorName}
                type="button"
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    color: isSelected ? "all" : colorName,
                  }))
                }
                title={colorName}
                className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                  isSelected ? "ring-2 ring-brand-primary ring-offset-2 scale-110" : "hover:scale-105"
                } ${hex === "#FFFFFF" ? "border-grey-30" : "border-transparent"}`}
                style={{ backgroundColor: hex }}
                aria-label={`Filter by ${colorName}`}
              />
            )
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2.5 pt-4 border-t border-brand-border">
        <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
          Price Range (BDT)
        </span>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-grey-70 font-mono">
            <span>{formatBDT(filters.minPrice)}</span>
            <span>{formatBDT(filters.maxPrice)}</span>
          </div>
          <input
            type="range"
            min={800}
            max={3000}
            step={100}
            value={filters.maxPrice}
            onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))}
            className="w-full accent-brand-accent cursor-pointer"
          />
        </div>
      </div>

      {/* In-Stock Toggle */}
      <div className="pt-4 border-t border-brand-border">
        <label className="flex items-center gap-2.5 text-xs text-brand-primary font-medium cursor-pointer">
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(e) => setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))}
            className="w-4 h-4 rounded text-brand-accent focus:ring-brand-accent border-brand-border"
          />
          <span>In Stock in Dhaka Only</span>
        </label>
      </div>
    </aside>
  )
}
