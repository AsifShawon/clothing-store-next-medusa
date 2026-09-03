"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ProductView,
  SearchCategorySuggestion,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { LinkComponent } from "../../types"
import { MagnifyingGlassIcon, XMarkIcon, ArrowRightIcon } from "../icons"

export interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
  query: string
  onQueryChange: (query: string) => void
  onSubmit?: (e: React.FormEvent) => void
  products?: ProductView[]
  totalCount?: number
  isSearching?: boolean
  querySuggestions?: string[]
  categorySuggestions?: SearchCategorySuggestion[]
  popularSearches?: string[]
  trendingCategories?: Array<{ name: string; handle: string }>
  bestsellerProducts?: ProductView[]
  routes: StoreRoutes
  onSelectProduct?: (product: ProductView) => void
  onSelectSuggestion?: (s: string) => void
  onSelectCategory?: (handle: string) => void
  onViewAllResults?: (query: string) => void
  linkComponent?: LinkComponent
}

export function SearchOverlay({
  isOpen,
  onClose,
  query,
  onQueryChange,
  onSubmit,
  products = [],
  totalCount,
  isSearching = false,
  querySuggestions = [],
  categorySuggestions = [],
  popularSearches = [
    "Heavyweight T-Shirt",
    "Oxford Shirt",
    "Regent Polo",
    "Mayfair Chinos",
    "French Linen",
    "Twill Cap",
  ],
  trendingCategories = [
    { name: "New Arrivals", handle: "new-arrivals" },
    { name: "Men's Tailoring", handle: "men" },
    { name: "French Linen Edit", handle: "women" },
    { name: "Accessories", handle: "accessories" },
  ],
  bestsellerProducts = [],
  routes,
  onSelectProduct,
  onSelectSuggestion,
  onSelectCategory,
  onViewAllResults,
  linkComponent: LinkComp = Link,
}: SearchOverlayProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1)

  // Calculate flat suggestions list for keyboard navigation
  const flatSuggestions = React.useMemo(() => {
    const list: Array<{ type: "query" | "category"; value: string; handle?: string }> = []
    querySuggestions.forEach((s) => list.push({ type: "query", value: s }))
    categorySuggestions.forEach((c) =>
      list.push({ type: "category", value: c.name, handle: c.handle })
    )
    return list
  }, [querySuggestions, categorySuggestions])

  // Reset highlight on query change or open
  useEffect(() => {
    setHighlightedIndex(-1)
  }, [query, isOpen])

  // Focus input and lock body scroll on open
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
      document.body.style.overflow = "hidden"
      return () => {
        clearTimeout(timer)
        document.body.style.overflow = ""
      }
    } else {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatSuggestions.length === 0) return

    if (e.key === "ArrowDown") {
      e.preventDefault()
      const nextIndex = (highlightedIndex + 1) % flatSuggestions.length
      setHighlightedIndex(nextIndex)
      const selected = flatSuggestions[nextIndex]
      if (selected.type === "query") {
        onQueryChange(selected.value)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const prevIndex =
        highlightedIndex <= 0 ? flatSuggestions.length - 1 : highlightedIndex - 1
      setHighlightedIndex(prevIndex)
      const selected = flatSuggestions[prevIndex]
      if (selected.type === "query") {
        onQueryChange(selected.value)
      }
    } else if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < flatSuggestions.length) {
        e.preventDefault()
        const selected = flatSuggestions[highlightedIndex]
        if (selected.type === "query") {
          onQueryChange(selected.value)
          onSelectSuggestion?.(selected.value)
        } else if (selected.type === "category" && selected.handle) {
          onSelectCategory?.(selected.handle)
        }
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSubmit) {
      onSubmit(e)
    } else if (onViewAllResults && query.trim()) {
      onViewAllResults(query.trim())
    }
  }

  if (!isOpen) return null

  const displayCount = totalCount !== undefined ? totalCount : products.length
  const hasQuery = query.trim().length > 0

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Predictive garment search"
      className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm animate-mega-enter"
    >
      {/* Backdrop click to close */}
      <div
        className="fixed inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Main Search Panel Container */}
      <div className="relative z-10 w-full max-w-5xl mx-auto bg-white shadow-2xl border-b border-brand-border flex flex-col max-h-[92vh] sm:mt-12 sm:rounded-2xl overflow-hidden">
        {/* Search Header Bar */}
        <div className="p-4 sm:p-6 border-b border-brand-border bg-white flex items-center gap-3">
          <MagnifyingGlassIcon className="w-5 h-5 text-brand-primary/50 flex-shrink-0" />

          <form onSubmit={handleSubmit} className="flex-1 flex items-center">
            <input
              ref={inputRef}
              type="search"
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={hasQuery}
              aria-controls="search-suggestions-listbox"
              aria-activedescendant={
                highlightedIndex >= 0 ? `suggestion-item-${highlightedIndex}` : undefined
              }
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search garments, 240 GSM cotton, Oxford shirts, chinos..."
              className="w-full bg-transparent text-sm sm:text-base font-heading text-brand-primary placeholder:text-brand-muted/70 focus:outline-none"
            />
          </form>

          {hasQuery && (
            <button
              type="button"
              onClick={() => onQueryChange("")}
              className="p-1.5 text-xs text-brand-muted hover:text-brand-primary font-heading font-semibold uppercase tracking-wider"
              aria-label="Clear search input"
            >
              Clear
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-brand-primary/70 hover:text-brand-primary hover:bg-brand-secondary rounded-full transition-colors flex items-center justify-center min-w-[44px] min-h-[44px]"
            aria-label="Close search overlay"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Screen Reader Live Region for Announcements */}
        <div role="status" aria-live="polite" className="sr-only">
          {hasQuery
            ? isSearching
              ? `Searching for ${query}`
              : `${displayCount} garments found for ${query}`
            : ""}
        </div>

        {/* Scrollable Results / Suggestions Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 bg-brand-surface">
          {/* STATE 1: Empty Query - Recommendations & Fast Discovery */}
          {!hasQuery && (
            <div className="space-y-8 animate-mega-enter">
              {/* Popular Search Chips */}
              <div className="space-y-3">
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-muted block">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => {
                        onQueryChange(term)
                        onSelectSuggestion?.(term)
                      }}
                      className="px-3.5 py-1.5 rounded-full bg-brand-secondary hover:bg-brand-primary hover:text-white border border-brand-border text-xs font-heading font-medium text-brand-primary transition-colors min-h-[36px]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Categories */}
              <div className="space-y-3">
                <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-muted block">
                  Explore Wardrobe Departments
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {trendingCategories.map((cat) => (
                    <LinkComp
                      key={cat.handle}
                      href={routes.category ? routes.category(cat.handle) : routes.catalog({ category: cat.handle })}
                      onClick={onClose}
                      className="p-3.5 bg-white hover:bg-brand-secondary border border-brand-border/80 rounded-xl text-center transition-colors group"
                    >
                      <span className="text-xs font-heading font-bold text-brand-primary group-hover:text-brand-accent transition-colors block">
                        {cat.name}
                      </span>
                      <span className="text-[10px] text-brand-muted uppercase tracking-wider mt-0.5 block">
                        Explore →
                      </span>
                    </LinkComp>
                  ))}
                </div>
              </div>

              {/* Bestseller Preview Rail */}
              {bestsellerProducts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-heading font-bold uppercase tracking-widest text-brand-muted">
                      Iconic Bestsellers
                    </span>
                    <LinkComp
                      href={routes.collection("best-sellers")}
                      onClick={onClose}
                      className="text-xs font-heading font-semibold text-brand-accent hover:underline uppercase tracking-wider"
                    >
                      View All →
                    </LinkComp>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {bestsellerProducts.slice(0, 4).map((p) => (
                      <LinkComp
                        key={p.id}
                        href={routes.product(p.handle)}
                        onClick={onClose}
                        className="group flex flex-col bg-white border border-brand-border rounded-xl p-2.5 hover:border-brand-primary transition-colors"
                      >
                        <div className="relative aspect-[3/4] w-full bg-brand-secondary rounded-lg overflow-hidden mb-2">
                          {p.thumbnail && (
                            <Image
                              src={p.thumbnail.url}
                              alt={p.title}
                              fill
                              sizes="180px"
                              className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                            />
                          )}
                        </div>
                        <span className="text-xs font-heading font-bold text-brand-primary truncate">
                          {p.title}
                        </span>
                        <span className="text-[11px] font-mono text-brand-primary/80 mt-0.5">
                          {p.minPrice.formatted}
                        </span>
                      </LinkComp>
                    ))}
                  </div>
                </div>
              )}

              {/* Need Help / Customer Concierge Shortcuts */}
              <div className="pt-4 border-t border-brand-border/60 flex flex-wrap items-center justify-between text-xs text-brand-primary/70">
                <span className="font-heading font-semibold uppercase tracking-wider text-[10px] text-brand-muted">
                  Need Help Finding Sizing?
                </span>
                <div className="flex gap-4">
                  <LinkComp href={routes.sizeGuide()} onClick={onClose} className="hover:text-brand-primary underline">
                    Size Guide
                  </LinkComp>
                  <LinkComp href={routes.faq()} onClick={onClose} className="hover:text-brand-primary underline">
                    FAQ
                  </LinkComp>
                  <LinkComp href={routes.contact()} onClick={onClose} className="hover:text-brand-primary underline">
                    Customer Concierge
                  </LinkComp>
                </div>
              </div>
            </div>
          )}

          {/* STATE 2: Typed Query - Suggestions & Instant Matches */}
          {hasQuery && (
            <div className="space-y-6">
              {/* Header result count & View all trigger */}
              <div className="flex items-center justify-between border-b border-brand-border pb-3">
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-brand-primary">
                  {isSearching
                    ? "Searching..."
                    : `${displayCount} ${displayCount === 1 ? "Garment" : "Garments"} Found`}
                </span>

                {displayCount > 0 && (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-accent hover:underline uppercase tracking-wider"
                  >
                    <span>View all results for &quot;{query}&quot;</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* No results fallback */}
              {!isSearching && displayCount === 0 && (
                <div className="py-12 text-center space-y-3 max-w-md mx-auto">
                  <p className="font-heading font-bold text-sm text-brand-primary">
                    No garments match &quot;{query}&quot;
                  </p>
                  <p className="text-xs text-brand-muted leading-relaxed">
                    Try searching for fabric types like &quot;Oxford&quot;, &quot;240 GSM&quot;, or &quot;French Linen&quot;, or browse our primary departments below.
                  </p>
                  <div className="flex justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => onQueryChange("")}
                      className="px-4 py-2 rounded-full bg-brand-primary text-white text-xs font-heading font-semibold uppercase tracking-wider hover:bg-black transition-colors"
                    >
                      Clear Search
                    </button>
                  </div>
                </div>
              )}

              {/* Results Grid */}
              {products.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((prod) => (
                    <LinkComp
                      key={prod.id}
                      href={routes.product(prod.handle)}
                      onClick={() => {
                        onClose()
                        onSelectProduct?.(prod)
                      }}
                      className="group flex items-center gap-3.5 p-3 bg-white border border-brand-border rounded-xl hover:border-brand-primary hover:shadow-subtle transition-all duration-200"
                    >
                      <div className="relative w-16 h-20 bg-brand-secondary rounded-lg overflow-hidden flex-shrink-0">
                        {prod.thumbnail && (
                          <Image
                            src={prod.thumbnail.url}
                            alt={prod.thumbnail.altText || prod.title}
                            fill
                            sizes="64px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-bold text-xs text-brand-primary truncate group-hover:text-brand-accent transition-colors">
                          {prod.title}
                        </h4>
                        <p className="text-[11px] text-brand-primary/60 truncate mt-0.5">
                          {prod.subtitle || prod.material || "British Smart-Casual"}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="font-heading font-bold text-xs text-brand-primary">
                            {prod.minPrice.formatted}
                          </span>
                          {prod.inStock ? (
                            <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              In Stock
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                              Sold Out
                            </span>
                          )}
                        </div>
                      </div>
                    </LinkComp>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
