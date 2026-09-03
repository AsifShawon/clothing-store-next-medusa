"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  CatalogSortOption,
  CategoryView,
  DEFAULT_MEDUSA_CAPABILITIES,
  ProductFilterView,
  ProductView,
} from "@dtc/commerce-contracts"
import { CatalogView } from "@dtc/storefront-ui"
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

interface MedusaCatalogClientProps {
  title?: string
  description?: string
  products: ProductView[]
  totalCount: number
  categories: CategoryView[]
  countryCode: string
  currentSortBy?: string
  currentQuery?: string
  selectedCategoryId?: string
}

export default function MedusaCatalogClient({
  title,
  description,
  products,
  totalCount,
  categories,
  countryCode,
  currentSortBy = "created_at",
  currentQuery,
  selectedCategoryId,
}: MedusaCatalogClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const routes = createMedusaRoutes(countryCode)

  const filters: ProductFilterView = {
    sortBy: toValidSort(currentSortBy),
    search: currentQuery,
    category: selectedCategoryId,
  }


  const handleFilterChange = (newFilters: ProductFilterView) => {
    const params = new URLSearchParams(searchParams?.toString() || "")
    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy)
    }
    if (newFilters.search) {
      params.set("q", newFilters.search)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleResetFilters = () => {
    router.push(`/${countryCode}/store`)
  }

  return (
    <CatalogView
      title={title || (currentQuery ? `Search Results for "${currentQuery}"` : "All Clothing & Essentials")}
      description={
        description ||
        (currentQuery
          ? "Showing garments matching your search query."
          : "Discover our full range of 240 GSM heavyweight tees, tailored Oxford shirts, pique knit polos, and tailored chinos.")
      }
      products={products}
      totalCount={totalCount}
      categories={categories}
      filters={filters}
      onFilterChange={handleFilterChange}
      onResetFilters={handleResetFilters}
      routes={routes}
      capabilities={DEFAULT_MEDUSA_CAPABILITIES}
      linkComponent={LocalizedClientLink}
    />
  )
}
