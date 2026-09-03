"use client"

import React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  CatalogSortOption,
  CategoryView as CategoryModel,
  DEFAULT_MEDUSA_CAPABILITIES,
  ProductFilterView,
  ProductView,
} from "@dtc/commerce-contracts"
import { CategoryView } from "@dtc/storefront-ui"
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

interface MedusaCategoryClientProps {
  category: CategoryModel
  products: ProductView[]
  totalCount: number
  countryCode: string
  currentSortBy?: string
}

export default function MedusaCategoryClient({
  category,
  products,
  totalCount,
  countryCode,
  currentSortBy = "created_at",
}: MedusaCategoryClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const routes = createMedusaRoutes(countryCode)

  const filters: ProductFilterView = {
    sortBy: toValidSort(currentSortBy),
    category: category.id,
  }


  const handleFilterChange = (newFilters: ProductFilterView) => {
    const params = new URLSearchParams(searchParams?.toString() || "")
    if (newFilters.sortBy) {
      params.set("sortBy", newFilters.sortBy)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleResetFilters = () => {
    router.push(routes.category(category.handle))
  }

  return (
    <CategoryView
      category={category}
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
