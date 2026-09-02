"use client"

import React, { useEffect } from "react"
import { DemoCategory, DemoCollection } from "@lib/types"
import { FilterState } from "./filter-sidebar"
import { formatBDT } from "@lib/utils"
import { XMark, ArrowPath } from "@medusajs/icons"

interface MobileFilterDrawerProps {
  isOpen: boolean
  onClose: () => void
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

export function MobileFilterDrawer({
  isOpen,
  onClose,
  filters,
  setFilters,
  categories,
  collections,
  onReset,
  totalCount,
}: MobileFilterDrawerProps) {
  // Prevent background scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Filters"
      className="fixed inset-0 z-50 flex justify-end"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col z-10 animate-enter">
        {/* Header */}
        <div className="p-4 border-b border-brand-border flex items-center justify-between bg-brand-surface">
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-base text-brand-primary">Filter Garments</h3>
            <span className="text-xs text-grey-50">({totalCount} found)</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-grey-50 hover:text-brand-primary rounded hover:bg-black/5"
            aria-label="Close filters"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Department */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
              Department
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, category: "all" }))}
                className={`py-2 px-2.5 rounded border text-center font-medium transition-colors ${
                  filters.category === "all"
                    ? "bg-brand-primary text-white border-brand-primary font-bold"
                    : "bg-white text-grey-70 border-brand-border"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, category: cat.name }))}
                  className={`py-2 px-2.5 rounded border text-center font-medium transition-colors ${
                    filters.category.toLowerCase() === cat.name.toLowerCase()
                      ? "bg-brand-primary text-white border-brand-primary font-bold"
                      : "bg-white text-grey-70 border-brand-border"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Collection */}
          <div className="space-y-2 pt-4 border-t border-brand-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
              Collection
            </span>
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, collection: "all" }))}
                className={`w-full text-left px-3 py-2 rounded transition-colors ${
                  filters.collection === "all"
                    ? "bg-brand-primary text-white font-semibold"
                    : "text-grey-70 bg-brand-surface"
                }`}
              >
                All Collections
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, collection: col.handle }))}
                  className={`w-full text-left px-3 py-2 rounded transition-colors ${
                    filters.collection === col.handle
                      ? "bg-brand-primary text-white font-semibold"
                      : "text-grey-70 bg-brand-surface"
                  }`}
                >
                  {col.title}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div className="space-y-2 pt-4 border-t border-brand-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
              Size
            </span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => setFilters((prev) => ({ ...prev, size: "all" }))}
                className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                  filters.size === "all"
                    ? "bg-brand-primary text-white border-brand-primary font-bold"
                    : "bg-white text-grey-70 border-brand-border"
                }`}
              >
                All
              </button>
              {AVAILABLE_SIZES.map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, size: filters.size === sz ? "all" : sz }))}
                  className={`px-3 py-1.5 text-xs border rounded transition-colors ${
                    filters.size === sz
                      ? "bg-brand-primary text-white border-brand-primary font-bold"
                      : "bg-white text-grey-70 border-brand-border"
                  }`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="space-y-2 pt-4 border-t border-brand-border">
            <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block">
              Color
            </span>
            <div className="flex flex-wrap gap-2.5">
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
                    className={`w-7 h-7 rounded-full border flex items-center justify-center transition-all ${
                      isSelected ? "ring-2 ring-brand-primary ring-offset-2 scale-110" : ""
                    } ${hex === "#FFFFFF" ? "border-grey-30" : "border-transparent"}`}
                    style={{ backgroundColor: hex }}
                    aria-label={`Filter by ${colorName}`}
                  />
                )
              })}
            </div>
          </div>

          {/* In Stock Toggle */}
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
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-brand-border bg-brand-surface flex items-center gap-2">
          <button
            type="button"
            onClick={onReset}
            className="flex-1 py-2.5 border border-brand-border bg-white text-xs font-semibold text-grey-70 hover:bg-brand-secondary transition-colors"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
          >
            Apply ({totalCount})
          </button>
        </div>
      </div>
    </div>
  )
}
