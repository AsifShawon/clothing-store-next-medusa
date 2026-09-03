"use client"

import React from "react"
import { CategoryView, ProductFilterView, StoreCapabilities } from "@dtc/commerce-contracts"
import { COLOR_SWATCHES } from "../../theme/colors"

export interface FilterSidebarProps {
  filters: ProductFilterView
  onFilterChange: (filters: ProductFilterView) => void
  categories?: CategoryView[]
  availableSizes?: string[]
  availableColors?: string[]
  capabilities?: StoreCapabilities
  onResetFilters?: () => void
}

const DEFAULT_SIZES = ["S", "M", "L", "XL", "30", "32", "34", "36", "One Size"]
const DEFAULT_COLORS = ["Black", "White", "Forest Green", "Midnight Navy", "Khaki", "Sky Blue"]

export function FilterSidebar({
  filters,
  onFilterChange,
  categories = [],
  availableSizes = DEFAULT_SIZES,
  availableColors = DEFAULT_COLORS,
  capabilities,
  onResetFilters,
}: FilterSidebarProps) {
  const handleCategorySelect = (handle: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === handle ? undefined : handle,
    })
  }

  const handleSizeSelect = (size: string) => {
    onFilterChange({
      ...filters,
      size: filters.size === size ? undefined : size,
    })
  }

  const handleColorSelect = (color: string) => {
    onFilterChange({
      ...filters,
      color: filters.color === color ? undefined : color,
    })
  }

  const handleInStockToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      ...filters,
      inStockOnly: e.target.checked,
    })
  }

  const hasActiveFilters = Boolean(
    filters.category || filters.size || filters.color || filters.inStockOnly || filters.search
  )

  return (
    <aside className="w-full space-y-8 text-xs">
      {/* Active Filter Clear Action */}
      {hasActiveFilters && (
        <div className="flex items-center justify-between pb-4 border-b border-brand-border">
          <span className="font-heading font-semibold uppercase tracking-wider text-brand-primary">
            Active Filters
          </span>
          <button
            type="button"
            onClick={onResetFilters}
            className="text-[11px] font-medium text-brand-accent hover:underline uppercase tracking-wider"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Category Facet */}
      {categories.length > 0 && (
        <div className="space-y-3 pb-6 border-b border-brand-border">
          <h4 className="font-heading font-semibold uppercase tracking-wider text-brand-primary">
            Category
          </h4>
          <ul className="space-y-2">
            {categories.map((cat) => {
              const isSelected = filters.category === cat.handle
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => handleCategorySelect(cat.handle)}
                    className={`w-full text-left py-1 transition-colors flex items-center justify-between ${
                      isSelected
                        ? "text-brand-accent font-bold"
                        : "text-brand-muted hover:text-brand-primary"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {isSelected && <span className="text-[11px]">✓</span>}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* Size Facet */}
      <div className="space-y-3 pb-6 border-b border-brand-border">
        <h4 className="font-heading font-semibold uppercase tracking-wider text-brand-primary">
          Size
        </h4>
        <div className="grid grid-cols-3 gap-2">
          {availableSizes.map((size) => {
            const isSelected = filters.size === size
            return (
              <button
                key={size}
                type="button"
                onClick={() => handleSizeSelect(size)}
                className={`py-2 px-1 text-center font-heading font-medium text-xs border transition-colors ${
                  isSelected
                    ? "bg-brand-primary text-white border-brand-primary"
                    : "bg-brand-surface text-brand-primary border-brand-border hover:border-brand-primary"
                }`}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      {/* Color Facet if enabled */}
      {capabilities?.hasColorSwatches && (
        <div className="space-y-3 pb-6 border-b border-brand-border">
          <h4 className="font-heading font-semibold uppercase tracking-wider text-brand-primary">
            Color
          </h4>
          <div className="flex flex-wrap gap-2">
            {availableColors.map((color) => {
              const isSelected = filters.color?.toLowerCase() === color.toLowerCase()
              const hex = COLOR_SWATCHES[color.toLowerCase()] || "#cccccc"
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => handleColorSelect(color)}
                  title={color}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    isSelected ? "ring-2 ring-brand-primary ring-offset-2 scale-110" : "border-brand-border"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              )
            })}
          </div>
        </div>
      )}

      {/* Availability Toggle */}
      <div className="space-y-3">
        <h4 className="font-heading font-semibold uppercase tracking-wider text-brand-primary">
          Availability
        </h4>
        <label className="flex items-center gap-2.5 cursor-pointer select-none text-brand-primary">
          <input
            type="checkbox"
            checked={Boolean(filters.inStockOnly)}
            onChange={handleInStockToggle}
            className="w-4 h-4 accent-brand-accent cursor-pointer"
          />
          <span className="text-xs">In Stock Only</span>
        </label>
      </div>
    </aside>
  )
}
