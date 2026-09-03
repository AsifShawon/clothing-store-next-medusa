"use client"

import React, { useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useDemoProducts } from "@lib/demo-store-context"
import { CollectionView } from "@dtc/storefront-ui"
import { ProductFilterView, DEFAULT_DEMO_CAPABILITIES } from "@dtc/commerce-contracts"
import { toCollectionView, toProductView } from "../../adapters/local-storage/catalog"
import { demoRoutes } from "../../adapters/local-storage/routes"

function CollectionContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle") || "new-arrivals"

  const { allProducts, collections } = useDemoProducts()

  const currentCollection = useMemo(() => {
    return (
      collections.find((c) => c.handle === handle) || {
        id: `col_${handle}`,
        title: handle.charAt(0).toUpperCase() + handle.slice(1).replace(/-/g, " "),
        handle,
        description: "Explore our premium British clothing essentials crafted for Bangladesh.",
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80",
      }
    )
  }, [collections, handle])

  const [filters, setFilters] = useState<ProductFilterView>({
    sortBy: "featured",
  })

  const productsInCollection = useMemo(() => {
    return allProducts.filter(
      (p) =>
        p.status === "published" &&
        (p.collectionHandle === handle || p.tags.includes(handle))
    )
  }, [allProducts, handle])

  const productViews = useMemo(() => productsInCollection.map(toProductView), [productsInCollection])

  return (
    <CollectionView
      collection={toCollectionView(currentCollection)}
      products={productViews}
      totalCount={productViews.length}
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={() => setFilters({ sortBy: "featured" })}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      linkComponent={Link}
    />
  )
}

export default function CollectionPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Collection...</div>}>
      <CollectionContent />
    </Suspense>
  )
}
