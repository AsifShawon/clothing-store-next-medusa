"use client"

import React from "react"
import { CatalogSortOption } from "@dtc/commerce-contracts"

export interface SortDropdownProps {
  value?: CatalogSortOption
  onChange: (sort: CatalogSortOption) => void
}

export function SortDropdown({ value = "featured", onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      <label htmlFor="catalog-sort" className="font-heading font-semibold uppercase tracking-wider text-brand-primary hidden sm:inline">
        Sort By:
      </label>
      <select
        id="catalog-sort"
        value={value}
        onChange={(e) => onChange(e.target.value as CatalogSortOption)}
        className="px-3 py-2 bg-brand-surface border border-brand-border text-xs text-brand-primary font-medium focus:outline-none focus:border-brand-primary uppercase tracking-wider"
      >
        <option value="featured">Featured</option>
        <option value="newest">Newest Arrivals</option>
        <option value="price_asc">Price: Low to High</option>
        <option value="price_desc">Price: High to Low</option>
      </select>
    </div>
  )
}
