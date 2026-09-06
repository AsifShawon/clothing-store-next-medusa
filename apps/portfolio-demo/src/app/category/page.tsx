"use client"

import React, { useMemo, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useDemoProducts, useDemoCart } from "@lib/demo-store-context"
import { CategoryView } from "@dtc/storefront-ui"
import {
  ProductFilterView,
  DEFAULT_DEMO_CAPABILITIES,
  QuickAddRequest,
  QuickAddResult,
} from "@dtc/commerce-contracts"
import { toCategoryView, toProductView } from "../../adapters/local-storage/catalog"
import { demoRoutes } from "../../adapters/local-storage/routes"

function CategoryContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle") || "men"

  const { allProducts, categories } = useDemoProducts()
  const { addItem } = useDemoCart()

  const currentCategory = useMemo(() => {
    return (
      categories.find((c) => c.handle === handle || c.name.toLowerCase() === handle.toLowerCase()) || {
        id: `cat_${handle}`,
        name: handle.charAt(0).toUpperCase() + handle.slice(1),
        handle,
        description: "Explore our contemporary British smart-casual clothing.",
        image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80",
      }
    )
  }, [categories, handle])

  const [filters, setFilters] = useState<ProductFilterView>({
    sortBy: "featured",
  })

  const filteredProducts = useMemo(() => {
    return allProducts.filter((p) =>
      p.status === "published" &&
      p.categoryNames.some(
        (c) =>
          c.toLowerCase() === handle.toLowerCase() ||
          c.toLowerCase().replace(/\s+/g, "-") === handle.toLowerCase()
      )
    )
  }, [allProducts, handle])

  const productViews = useMemo(() => filteredProducts.map(toProductView), [filteredProducts])

  const handleQuickAdd = async (req: QuickAddRequest): Promise<QuickAddResult> => {
    try {
      const prod = allProducts.find((p) => p.id === req.productId)
      const variant = prod?.variants.find((v) => v.id === req.variantId)
      if (!prod || !variant) {
        return { success: false, message: "Garment or size not found" }
      }
      return addItem(prod, variant, req.quantity)
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Could not add to bag",
      }
    }
  }

  return (
    <CategoryView
      category={toCategoryView(currentCategory)}
      products={productViews}
      totalCount={productViews.length}
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={() => setFilters({ sortBy: "featured" })}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      onQuickAdd={handleQuickAdd}
      linkComponent={Link}
    />
  )
}

export default function CategoryPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Department...</div>}>
      <CategoryContent />
    </Suspense>
  )
}
