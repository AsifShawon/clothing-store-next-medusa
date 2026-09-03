"use client"

import React, { useState } from "react"
import Link from "next/link"
import {
  ProductOptionView,
  ProductVariantView,
  ProductView,
  StoreCapabilities,
  StoreRoutes,
} from "@dtc/commerce-contracts"
import { ImageGallery } from "../components/product/ImageGallery"
import { ProductInfo } from "../components/product/ProductInfo"
import { VariantSelector } from "../components/product/VariantSelector"
import { SizeGuideModal } from "../components/product/SizeGuideModal"
import { ProductTabs } from "../components/product/ProductTabs"
import { ProductRails } from "../components/home/ProductRails"
import { Button } from "../components/ui/button"
import { LinkComponent } from "../types"

export interface ProductDetailViewProps {
  product: ProductView
  relatedProducts?: ProductView[]
  options?: ProductOptionView[]
  variants?: ProductVariantView[]
  selectedOptions: Record<string, string>
  onSelectOption: (title: string, value: string) => void
  selectedVariant?: ProductVariantView
  quantity: number
  onQuantityChange: (qty: number) => void
  onAddToCart: () => void | Promise<void>
  isAddingToCart?: boolean
  routes: StoreRoutes
  capabilities?: StoreCapabilities
  breadcrumbs?: Array<{ label: string; href: string }>
  shareSlot?: React.ReactNode
  linkComponent?: LinkComponent
  children?: React.ReactNode
}

export function ProductDetailView({
  product,
  relatedProducts = [],
  options = product.options,
  variants = product.variants,
  selectedOptions,
  onSelectOption,
  selectedVariant,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAddingToCart = false,
  routes,
  capabilities,
  breadcrumbs,
  shareSlot,
  linkComponent: LinkComp = Link,
  children,
}: ProductDetailViewProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)

  const isSoldOut = selectedVariant
    ? !selectedVariant.inStock
    : !product.inStock

  const defaultBreadcrumbs = [
    { label: "Home", href: routes.home() },
    { label: "Shop", href: routes.catalog() },
    ...(product.categoryNames[0]
      ? [{ label: product.categoryNames[0], href: routes.category(product.categoryNames[0].toLowerCase().replace(/\s+/g, "-")) }]
      : []),
    { label: product.title, href: routes.product(product.handle) },
  ]

  const activeBreadcrumbs = breadcrumbs || defaultBreadcrumbs

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-brand-border py-4 bg-brand-surface">
        <div className="content-container">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[11px] font-heading uppercase tracking-wider text-brand-muted">
            {activeBreadcrumbs.map((crumb, i) => (
              <React.Fragment key={crumb.href}>
                {i > 0 && <span>/</span>}
                {i === activeBreadcrumbs.length - 1 ? (
                  <span className="text-brand-primary font-bold">{crumb.label}</span>
                ) : (
                  <LinkComp href={crumb.href} className="hover:text-brand-primary transition-colors">
                    {crumb.label}
                  </LinkComp>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="content-container py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          {/* Left Media Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} title={product.title} />
          </div>

          {/* Right Product Actions & Details */}
          <div className="lg:col-span-5 space-y-6">
            {/* Header & Pricing */}
            <ProductInfo product={product} selectedVariant={selectedVariant} />

            {/* Variant Selector */}
            <VariantSelector
              options={options}
              variants={variants}
              selectedOptions={selectedOptions}
              onSelectOption={onSelectOption}
              capabilities={capabilities}
              onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
            />

            {/* Quantity Counter & Add-to-Cart */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-4">
                {/* Quantity input */}
                <div className="flex items-center border border-brand-border bg-white h-11 text-xs">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isSoldOut}
                    className="w-10 h-full flex items-center justify-center text-brand-primary hover:bg-brand-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-heading font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={isSoldOut}
                    className="w-10 h-full flex items-center justify-center text-brand-primary hover:bg-brand-secondary disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart CTA */}
                <Button
                  type="button"
                  onClick={onAddToCart}
                  disabled={isSoldOut}
                  isLoading={isAddingToCart}
                  variant="primary"
                  className="flex-1 h-11 text-xs sm:text-sm font-bold tracking-widest"
                >
                  {isSoldOut ? "Sold Out" : "Add to Bag"}
                </Button>
              </div>

              {shareSlot}
            </div>

            {/* Product Tabs (Specs, Fabric & Care, Delivery) */}
            <ProductTabs
              description={product.description}
              material={product.material}
              metadata={product.metadata}
            />
          </div>
        </div>
      </div>

      {/* Related Products Rail */}
      {relatedProducts && relatedProducts.length > 0 && (
        <ProductRails
          title="Complete The Silhouette"
          subtitle="Pieces designed to coordinate effortlessly with your selection."
          viewAllHref={routes.catalog()}
          products={relatedProducts}
          routes={routes}
          capabilities={capabilities}
          linkComponent={LinkComp}
        />
      )}

      {children}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </div>
  )
}
