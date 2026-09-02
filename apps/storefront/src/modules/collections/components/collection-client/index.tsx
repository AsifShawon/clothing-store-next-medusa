"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  CatalogSortOption,
  CollectionView as CollectionModel,
  DEFAULT_MEDUSA_CAPABILITIES,
  ProductFilterView,
  ProductView,
} from "@dtc/commerce-contracts"
import { CollectionView } from "@dtc/storefront-ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { createMedusaRoutes } from "../../../../adapters/medusa/routes"

const VALID_SORTS: readonly CatalogSortOption[] = [
  "featured",
  "newest",
  "price_asc",
  "price_desc",
  "created_at",
]

function toValidSort(val?: string): CatalogSortOption {
  return VALID_SORTS.includes(val as CatalogSortOption)
    ? (val as CatalogSortOption)
    : "created_at"
}

interface MedusaCollectionClientProps {
  collection: CollectionModel
  products: ProductView[]
  totalCount: number
  countryCode: string
  currentSortBy?: string
}

export default function MedusaCollectionClient({
  collection,
  products,
  totalCount,
  countryCode,
  currentSortBy = "created_at",
}: MedusaCollectionClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const routes = createMedusaRoutes(countryCode)

  const filters: ProductFilterView = {
    sortBy: toValidSort(currentSortBy),
    collection: collection.id,
  }


  const handleFilterChange = (newFilters: ProductFilterView) => {
    const params = new URLSearchParams(searchParams?.toString() || "")
    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleResetFilters = () => {
    router.push(routes.collection(collection.handle))
  }

  return (
    <CollectionView
      collection={collection}
      products={products}
      totalCount={totalCount}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilters={handleResetFilters}
      routes={routes}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      linkComponent={LocalizedClientLink}
    />
  )
}
