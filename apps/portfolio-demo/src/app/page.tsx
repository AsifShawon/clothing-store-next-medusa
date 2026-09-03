"use client"

import React from "react"
import Link from "next/link"
import { useDemoProducts, useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { HomeView, BuildingStorefrontIcon } from "@dtc/storefront-ui"
import { toCategoryView, toProductView } from "../adapters/local-storage/catalog"
import { demoRoutes } from "../adapters/local-storage/routes"
import { DEFAULT_DEMO_CAPABILITIES, QuickAddRequest, QuickAddResult } from "@dtc/commerce-contracts"

export default function HomePage() {
  const { products, categories } = useDemoProducts()
  const { addItem } = useDemoCart()
  const { setIsCartDrawerOpen } = useDemoStore()

  const productViews = products.map(toProductView)
  const categoryViews = categories.map(toCategoryView)

  const handleQuickAdd = async (req: QuickAddRequest): Promise<QuickAddResult> => {
    try {
      const prod = products.find((p) => p.id === req.productId)
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
    <HomeView
      featuredProducts={productViews}
      categories={categoryViews}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      onQuickAdd={handleQuickAdd}
      linkComponent={Link}
      secondaryCtaSlot={
        <Link
          href="/demo-admin"
          className="px-6 py-3 bg-white/10 hover:bg-white/20 backdrop-blur-xs text-white border border-white/25 rounded-full text-xs font-heading font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
        >
          <BuildingStorefrontIcon className="w-4 h-4 text-brand-sand" />
          <span>Simulated Admin</span>
        </Link>
      }
    />
  )
}
