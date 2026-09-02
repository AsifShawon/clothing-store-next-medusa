"use client"

import React from "react"
import Link from "next/link"
import { useDemoProducts } from "@lib/demo-store-context"
import { HomeView, BuildingStorefrontIcon } from "@dtc/storefront-ui"
import { toCategoryView, toProductView } from "../adapters/local-storage/catalog"
import { demoRoutes } from "../adapters/local-storage/routes"
import { DEFAULT_DEMO_CAPABILITIES } from "@dtc/commerce-contracts"

export default function HomePage() {
  const { products, categories } = useDemoProducts()

  const productViews = products.map(toProductView)
  const categoryViews = categories.map(toCategoryView)

  return (
    <HomeView
      featuredProducts={productViews}
      categories={categoryViews}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      linkComponent={Link}
      secondaryCtaSlot={
        <Link
          href="/demo-admin"
          className="px-6 py-3 bg-brand-surface hover:bg-brand-secondary text-brand-primary border border-brand-border text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <BuildingStorefrontIcon className="w-4 h-4 text-emerald-700" />
          <span>Simulated Admin Demo</span>
        </Link>
      }
    />
  )
}
