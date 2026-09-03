import React from "react"
import { CategoryView, ProductView, StoreCapabilities, StoreRoutes } from "@dtc/commerce-contracts"
import { HeroSection } from "../components/home/HeroSection"
import { FeaturedCategories } from "../components/home/FeaturedCategories"
import { ProductRails } from "../components/home/ProductRails"
import { BrandStorySection } from "../components/home/BrandStorySection"
import { NewsletterSection } from "../components/home/NewsletterSection"
import { DeliveryGuaranteesSection } from "../components/home/DeliveryGuaranteesSection"
import { LinkComponent } from "../types"

export interface HomeViewProps {
  heroProduct?: ProductView
  featuredProducts: ProductView[]
  categories: CategoryView[]
  routes: StoreRoutes
  capabilities?: StoreCapabilities
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
  secondaryCtaSlot,
  newsletterSlot,
  linkComponent,
}: HomeViewProps) {
  const newArrivals = featuredProducts.filter((p) => p.isNewArrival)
  const bestSellers = featuredProducts.filter((p) => p.isBestSeller)
  const displayRailProducts = newArrivals.length > 0 ? newArrivals : featuredProducts

  return (
    <div className="flex flex-col w-full">
      {/* Editorial Hero */}
      <HeroSection
        routes={routes}
        featuredProduct={heroProduct || featuredProducts[0]}
        secondaryCtaSlot={secondaryCtaSlot}
        linkComponent={linkComponent}
      />

      {/* Featured Categories */}
      <FeaturedCategories
        categories={categories}
        routes={routes}
        linkComponent={linkComponent}
      />

      {/* Curated Product Rail */}
      <ProductRails
        title="Featured Garments"
        subtitle="Designed for longevity, structured drape, and versatile smart-casual styling."
        viewAllHref={routes.catalog()}
        products={displayRailProducts}
        routes={routes}
        capabilities={capabilities}
        linkComponent={linkComponent}
      />

      {/* Brand Heritage Story */}
      <BrandStorySection routes={routes} linkComponent={linkComponent} />

      {/* Secondary Product Rail (Best Sellers) */}
      {bestSellers.length > 0 && (
        <ProductRails
          title="Iconic Bestsellers"
          subtitle="Our most sought-after essentials, tested and perfected for daily wear."
          viewAllHref={routes.collection("best-sellers")}
          products={bestSellers}
          routes={routes}
          capabilities={capabilities}
          linkComponent={linkComponent}
        />
      )}

      {/* Delivery & Service Guarantees */}
      <DeliveryGuaranteesSection />

      {/* Newsletter */}
      {newsletterSlot || <NewsletterSection />}
    </div>
  )
}
