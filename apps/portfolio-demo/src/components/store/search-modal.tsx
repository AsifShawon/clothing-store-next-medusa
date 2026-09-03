"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useDemoProducts } from "@lib/demo-store-context"
import { SearchModal as SharedSearchModal } from "@dtc/storefront-ui"
import { toProductView } from "../../adapters/local-storage/catalog"
import { demoRoutes } from "../../adapters/local-storage/routes"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const { allProducts } = useDemoProducts()

  const productViews = useMemo(() => allProducts.map(toProductView), [allProducts])

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return productViews.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(trimmed)
      const matchDesc = (p.description || "").toLowerCase().includes(trimmed)
      const matchTag = (p.tags || []).some((t) => t.toLowerCase().includes(trimmed))
      return matchTitle || matchDesc || matchTag
    })
  }, [query, productViews])

  return (
    <SharedSearchModal
      isOpen={isOpen}
      onClose={onClose}
      query={query}
      onQueryChange={setQuery}
      resultsSlot={
        query ? (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <span className="text-[11px] font-heading font-semibold uppercase tracking-wider text-brand-muted block">
              {results.length} {results.length === 1 ? "Result" : "Results"}
            </span>
            {results.length === 0 ? (
              <p className="text-xs text-brand-muted py-4 text-center">No garments match &quot;{query}&quot;</p>
            ) : (
              <div className="divide-y divide-brand-border border border-brand-border">
                {results.map((prod) => (
                  <Link
                    key={prod.id}
                    href={demoRoutes.product(prod.handle)}
                    onClick={onClose}
                    className="p-3 flex items-center gap-3 hover:bg-brand-surface transition-colors"
                  >
                    {prod.thumbnail && (
                      <Image
                        src={prod.thumbnail.url}
                        alt={prod.thumbnail.altText || prod.title}
                        width={44}
                        height={55}
                        className="object-cover bg-brand-surface border border-brand-border"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-bold text-xs text-brand-primary truncate">{prod.title}</p>
                      <p className="text-[11px] text-brand-muted font-mono">{prod.minPrice.formatted}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : null
      }
    />
  )
}
