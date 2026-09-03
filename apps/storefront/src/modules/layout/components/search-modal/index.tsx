"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useParams } from "next/navigation"
import { SearchOverlay } from "@dtc/storefront-ui"
import { HttpTypes } from "@medusajs/types"
import { toProductView } from "@adapters/medusa/catalog"
import { createMedusaRoutes } from "@adapters/medusa/routes"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type SearchModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<HttpTypes.StoreProduct[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const params = useParams()
  const countryCode = (params?.countryCode as string) || "bd"

  const routes = useMemo(() => createMedusaRoutes(countryCode), [countryCode])

  // Debounced search query fetching from Medusa backend
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      return
    }

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

        const res = await fetch(
          `${backendUrl}/store/products?q=${encodeURIComponent(query.trim())}&limit=6`,
          {
            headers: {
              "x-publishable-api-key": publishableKey,
            },
          }
        )
        if (res.ok) {
          const data = await res.json()
          setResults(data.products || [])
        }
      } catch (err) {
        console.error("Search query error:", err)
      } finally {
        setLoading(false)
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [query])

  const adaptedProducts = useMemo(() => {
    return results.map((p) => toProductView(p, "bdt"))
  }, [results])

  const handleViewAll = (q: string) => {
    onClose()
    router.push(`/${countryCode}/store?q=${encodeURIComponent(q.trim())}`)
  }

  return (
    <SearchOverlay
      isOpen={isOpen}
      onClose={onClose}
      query={query}
      onQueryChange={setQuery}
      products={adaptedProducts}
      totalCount={adaptedProducts.length}
      isSearching={loading}
      routes={routes}
      onViewAllResults={handleViewAll}
      linkComponent={LocalizedClientLink}
    />
  )
}
