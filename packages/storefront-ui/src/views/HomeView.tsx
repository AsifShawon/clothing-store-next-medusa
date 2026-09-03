"use client"

import React from "react"
import {
  CategoryView,
  ProductView,
  QuickAddRequest,
  QuickAddResult,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { HeroSection } from "../components/home/HeroSection"
import { FeaturedCategories } from "../components/home/FeaturedCategories"
import { ProductRails } from "../components/home/ProductRails"
import { CraftsmanshipSection } from "../components/home/CraftsmanshipSection"
import { SplitPromoSection } from "../components/home/SplitPromoSection"
import { BrandValuesGrid } from "../components/home/BrandValuesGrid"
import { DeliveryGuaranteesSection } from "../components/home/DeliveryGuaranteesSection"
import { NewsletterSection } from "../components/home/NewsletterSection"
import { LinkComponent } from "../types"

export interface HomeViewProps {
  heroProduct?: ProductView
  featuredProducts: ProductView[]
  categories: CategoryView[]
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
  secondaryCtaSlot?: React.ReactNode
  newsletterSlot?: React.ReactNode
  linkComponent?: LinkComponent
}

export function HomeView({
  heroProduct,
  featuredProducts,
  categories,
  routes,
  capabilities,
  onQuickAdd,
  secondaryCtaSlot,
  newsletterSlot,
  linkComponent,
}: HomeViewProps) {
  const newArrivals = featuredProducts.filter((p) => p.isNewArrival)
  const bestSellers = featuredProducts.filter((p) => p.isBestSeller)
  const displayRailProducts = newArrivals.length > 0 ? newArrivals : featuredProducts

  return (
    <div className="flex flex-col w-full">
      {/* 1. Editorial Hero */}
      <HeroSection
        routes={routes}
        featuredProduct={heroProduct || featuredProducts[0]}
        secondaryCtaSlot={secondaryCtaSlot}
        linkComponent={linkComponent}
      />

      {/* 2. Category Mosaic / Department Grid */}
      <FeaturedCategories
        categories={categories}
        routes={routes}
        linkComponent={linkComponent}
      />

      {/* 3. New Arrivals Rail */}
      <ProductRails
        title="Seasonal New Arrivals"
        subtitle="Cut from dense, pre-washed natural fibers designed for comfortable all-day wear."
        viewAllHref={routes.collection("new-arrivals")}
        viewAllLabel="Shop All New In"
        products={displayRailProducts}
        routes={routes}
        capabilities={capabilities}
        onQuickAdd={onQuickAdd}
        linkComponent={linkComponent}
      />

      {/* 4. Dhaka Craftsmanship & Fabric Story */}
      <CraftsmanshipSection routes={routes} linkComponent={linkComponent} />

      {/* 5. Best Sellers Rail */}
      {bestSellers.length > 0 && (
        <ProductRails
          title="Iconic Bestsellers"
          subtitle="Our foundational menswear essentials, refined through hundreds of prototype iterations."
          viewAllHref={routes.collection("best-sellers")}
          viewAllLabel="Shop Bestsellers"
          products={bestSellers}
          routes={routes}
          capabilities={capabilities}
          onQuickAdd={onQuickAdd}
          linkComponent={linkComponent}
        />
      )}

      {/* 6. Split Promotional / Campaign Section */}
      <SplitPromoSection routes={routes} linkComponent={linkComponent} />

      {/* 7. Brand Story / Values Grid */}
      <BrandValuesGrid />

      {/* 8. Delivery & Service Reassurance Strip */}
      <DeliveryGuaranteesSection />

      {/* 9. Newsletter / Private Members Club */}
      {newsletterSlot || <NewsletterSection />}
    </div>
  )
}
