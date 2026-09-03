"use client"

import React, { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useDemoProducts } from "@lib/demo-store-context"
import { SearchOverlay } from "@dtc/storefront-ui"
import { toProductView } from "../../adapters/local-storage/catalog"
import { demoRoutes } from "../../adapters/local-storage/routes"

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const router = useRouter()
  const { allProducts } = useDemoProducts()

  const productViews = useMemo(() => allProducts.map(toProductView), [allProducts])

  const results = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return []

    return productViews.filter((p) => {
      const matchTitle = p.title.toLowerCase().includes(trimmed)
      const matchDesc = (p.description || "").toLowerCase().includes(trimmed)
      const matchMat = (p.material || "").toLowerCase().includes(trimmed)
      const matchTag = (p.tags || []).some((t) => t.toLowerCase().includes(trimmed))
      return matchTitle || matchDesc || matchMat || matchTag
    })
  }, [query, productViews])

  const bestsellers = useMemo(() => {
    return productViews.filter((p) => p.isBestSeller).slice(0, 4)
  }, [productViews])

  const handleViewAllResults = (q: string) => {
    onClose()
    router.push(demoRoutes.catalog({ q }))
  }

  return (
    <SearchOverlay
      isOpen={isOpen}
      onClose={onClose}
      query={query}
      onQueryChange={setQuery}
      products={results}
      totalCount={results.length}
      bestsellerProducts={bestsellers}
      routes={demoRoutes}
      onViewAllResults={handleViewAllResults}
      linkComponent={Link}
    />
  )
}
