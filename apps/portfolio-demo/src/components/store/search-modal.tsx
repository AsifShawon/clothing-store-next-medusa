"use client"

import React, { useState, useEffect, useMemo, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDemoProducts } from "@lib/demo-store-context"
import { formatBDT } from "@lib/utils"
import { MagnifyingGlass, XMark, ArrowRight } from "@medusajs/icons"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)
  const { allProducts } = useDemoProducts()

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 50)
    } else {
      setQuery("")
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

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return allProducts.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(trimmed)
      const matchDesc = p.description.toLowerCase().includes(trimmed)
      const matchMat = p.material.toLowerCase().includes(trimmed)
      const matchCat = p.categoryNames.some((c) => c.toLowerCase().includes(trimmed))
      const matchTag = p.tags.some((t) => t.toLowerCase().includes(trimmed))
      return matchTitle || matchDesc || matchMat || matchCat || matchTag
    })
  }, [query, allProducts])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Search Catalog"
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white shadow-2xl border border-brand-border overflow-hidden z-10 animate-enter">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-brand-border flex items-center gap-3 bg-brand-surface">
          <MagnifyingGlass className="w-5 h-5 text-brand-primary/60 flex-shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shirts, heavy tees, polos, chinos, linen..."
            className="w-full bg-transparent text-sm sm:text-base text-brand-primary placeholder:text-grey-40 focus:outline-none"
            aria-label="Search London Boy products"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-grey-40 hover:text-brand-primary text-xs font-medium px-1"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-grey-50 hover:text-brand-primary rounded hover:bg-black/5 transition-colors"
            aria-label="Close search"
          >
            <XMark className="w-5 h-5" />
          </button>
        </div>

        {/* Results / Suggestions Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim() === "" ? (
            <div className="space-y-4 py-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block mb-2">
                  Popular Searches
                </span>
                <div className="flex flex-wrap gap-2">
                  {["Heavyweight T-Shirt", "Oxford Shirt", "Pique Polo", "Tailored Chinos", "Linen Shirt", "Cap"].map(
                    (term) => (
                      <button
                        key={term}
                        type="button"
                        onClick={() => setQuery(term)}
                        className="px-3 py-1.5 bg-brand-secondary hover:bg-brand-sand/50 text-xs text-brand-primary rounded border border-brand-border transition-colors"
                      >
                        {term}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-brand-border">
                <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block mb-2">
                  Browse by Department
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  <Link
                    href="/category?handle=men"
                    onClick={onClose}
                    className="p-2.5 bg-brand-surface hover:bg-brand-secondary border border-brand-border text-brand-primary font-medium flex items-center justify-between"
                  >
                    <span>Men</span>
                    <ArrowRight className="w-3.5 h-3.5 text-grey-40" />
                  </Link>
                  <Link
                    href="/category?handle=women"
                    onClick={onClose}
                    className="p-2.5 bg-brand-surface hover:bg-brand-secondary border border-brand-border text-brand-primary font-medium flex items-center justify-between"
                  >
                    <span>Women</span>
                    <ArrowRight className="w-3.5 h-3.5 text-grey-40" />
                  </Link>
                  <Link
                    href="/collection?handle=new-arrivals"
                    onClick={onClose}
                    className="p-2.5 bg-brand-surface hover:bg-brand-secondary border border-brand-border text-brand-primary font-medium flex items-center justify-between"
                  >
                    <span>New Arrivals</span>
                    <ArrowRight className="w-3.5 h-3.5 text-grey-40" />
                  </Link>
                  <Link
                    href="/collection?handle=essentials"
                    onClick={onClose}
                    className="p-2.5 bg-brand-surface hover:bg-brand-secondary border border-brand-border text-brand-primary font-medium flex items-center justify-between"
                  >
                    <span>Essentials</span>
                    <ArrowRight className="w-3.5 h-3.5 text-grey-40" />
                  </Link>
                </div>
              </div>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-grey-40 block pb-1">
                {results.length} {results.length === 1 ? "Product Found" : "Products Found"}
              </span>
              <div className="divide-y divide-brand-border">
                {results.map((product) => {
                  const minPrice = Math.min(...product.variants.map((v) => v.price))
                  return (
                    <Link
                      key={product.id}
                      href={`/product?handle=${product.handle}`}
                      onClick={onClose}
                      className="flex items-center gap-4 py-3 px-2 hover:bg-brand-secondary rounded transition-colors group"
                    >
                      <div className="relative w-14 h-16 bg-brand-secondary flex-shrink-0 overflow-hidden border border-brand-border">
                        <Image
                          src={product.thumbnail || product.images[0]}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-brand-primary truncate group-hover:text-brand-accent">
                          {product.title}
                        </h4>
                        <p className="text-xs text-grey-50 truncate mt-0.5">{product.material}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs font-bold text-brand-primary">{formatBDT(minPrice)}</span>
                          <span className="text-[10px] text-brand-accent font-medium uppercase px-1.5 py-0.5 bg-brand-accent/10 rounded">
                            {product.categoryNames[0] || "Catalog"}
                          </span>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-grey-40 group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                    </Link>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="py-12 text-center space-y-3">
              <p className="text-sm text-brand-primary font-medium">No garments match &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-grey-50 max-w-sm mx-auto">
                Try searching for broader keywords like &ldquo;shirt&rdquo;, &ldquo;polo&rdquo;, &ldquo;chinos&rdquo;, or browse our complete collection.
              </p>
              <Link
                href="/shop"
                onClick={onClose}
                className="inline-block px-4 py-2 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
              >
                Browse All Garments
              </Link>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-brand-secondary border-t border-brand-border flex items-center justify-between text-[11px] text-grey-50">
          <span>Client-side instant index</span>
          <span className="hidden sm:inline">Press Esc to close</span>
        </div>
      </div>
    </div>
  )
}
