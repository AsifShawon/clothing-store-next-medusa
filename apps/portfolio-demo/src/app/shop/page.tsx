"use client"

import React, { useState, useMemo, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useDemoProducts, useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { CatalogView } from "@dtc/storefront-ui"
import {
  ProductFilterView,
  DEFAULT_DEMO_CAPABILITIES,
  QuickAddRequest,
  QuickAddResult,
} from "@dtc/commerce-contracts"
import { toCategoryView, toProductView } from "../../adapters/local-storage/catalog"
import { demoRoutes } from "../../adapters/local-storage/routes"

function ShopContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || undefined
  const initialCollection = searchParams.get("collection") || undefined
  const initialSearch = searchParams.get("q") || undefined

  const { allProducts, categories } = useDemoProducts()
  const { addItem } = useDemoCart()
  const { setIsCartDrawerOpen } = useDemoStore()

  const [filters, setFilters] = useState<ProductFilterView>({
    search: initialSearch,
    category: initialCategory,
    collection: initialCollection,
    size: undefined,
    color: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    inStockOnly: false,
    sortBy: "featured",
  })

  const handleResetFilters = () => {
    setFilters({
      search: undefined,
      category: undefined,
      collection: undefined,
      size: undefined,
      color: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      inStockOnly: false,
      sortBy: "featured",
    })
  }

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return allProducts
      .filter((product) => {
        if (product.status !== "published") return false

        // Search text
        if (filters.search && filters.search.trim()) {
          const q = filters.search.toLowerCase()
          const matchTitle = product.title.toLowerCase().includes(q)
          const matchDesc = product.description.toLowerCase().includes(q)
          const matchMat = product.material.toLowerCase().includes(q)
          const matchTags = product.tags.some((t) => t.toLowerCase().includes(q))
          if (!matchTitle && !matchDesc && !matchMat && !matchTags) return false
        }

        // Category
        if (filters.category && filters.category !== "all") {
          const match = product.categoryNames.some(
            (c) =>
              c.toLowerCase() === filters.category!.toLowerCase() ||
              c.toLowerCase().replace(/\s+/g, "-") === filters.category!.toLowerCase()
          )
          if (!match) return false
        }

        // Collection
        if (filters.collection && filters.collection !== "all") {
          if (product.collectionHandle !== filters.collection) return false
        }

        // Size
        if (filters.size && filters.size !== "all") {
          const hasSize = product.variants.some((v) => v.options["Size"] === filters.size)
          if (!hasSize) return false
        }

        // Color
        if (filters.color && filters.color !== "all") {
          const hasColor = product.variants.some(
            (v) => v.options["Color"]?.toLowerCase() === filters.color!.toLowerCase()
          )
          if (!hasColor) return false
        }

        // In-stock
        if (filters.inStockOnly) {
          const inStock = product.variants.some(
            (v) => !v.manageInventory || v.inventoryQuantity > 0
          )
          if (!inStock) return false
        }

        return true
      })
      .sort((a, b) => {
        const minA = Math.min(...a.variants.map((v) => v.price))
        const minB = Math.min(...b.variants.map((v) => v.price))

        if (filters.sortBy === "price_asc") return minA - minB
        if (filters.sortBy === "price_desc") return minB - minA
        if (filters.sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        }
        return 0
      })
  }, [allProducts, filters])

  const productViews = useMemo(() => filteredProducts.map(toProductView), [filteredProducts])
  const categoryViews = useMemo(() => categories.map(toCategoryView), [categories])

  const handleQuickAdd = async (req: QuickAddRequest): Promise<QuickAddResult> => {
    try {
      const prod = allProducts.find((p) => p.id === req.productId)
      const variant = prod?.variants.find((v) => v.id === req.variantId)
      if (!prod || !variant) {
        return { success: false, message: "Garment or size not found" }
      }
      addItem(prod, variant, req.quantity)
      setIsCartDrawerOpen(true)
      return { success: true }
    } catch (err: unknown) {
      return {
        success: false,
        message: err instanceof Error ? err.message : "Could not add to bag",
      }
    }
  }

  return (
    <CatalogView
      title="All Clothing"
      description="Explore our signature heavyweight 240 GSM tees, British Oxford shirts, mercerized polos, and stretch chinos crafted for everyday luxury."
      products={productViews}
      totalCount={productViews.length}
      categories={categoryViews}
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={handleResetFilters}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      onQuickAdd={handleQuickAdd}
      linkComponent={Link}
    />
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Catalog...</div>}>
      <ShopContent />
    </Suspense>
  )
}
