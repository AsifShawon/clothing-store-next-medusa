"use client"

import React, { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  ProductOptionView,
  ProductVariantView,
  ProductView,
  QuickAddRequest,
  QuickAddResult,
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
  onQuickAdd?: (req: QuickAddRequest) => Promise<QuickAddResult>
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
  onQuickAdd,
  isAddingToCart = false,
  routes,
  capabilities,
  breadcrumbs,
  shareSlot,
  linkComponent: LinkComp = Link,
  children,
}: ProductDetailViewProps) {
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [showStickyMobileBar, setShowStickyMobileBar] = useState(false)
  const mainCtaRef = useRef<HTMLDivElement>(null)

  const isSoldOut = selectedVariant
    ? !selectedVariant.inStock
    : !product.inStock

  // Mobile scroll observer: show sticky bottom bar when main CTA is scrolled past
  useEffect(() => {
    const handleScroll = () => {
      if (!mainCtaRef.current) return
      const rect = mainCtaRef.current.getBoundingClientRect()
      // If bottom of main CTA is above the viewport, show the sticky bar
      if (rect.bottom < 0) {
        setShowStickyMobileBar(true)
      } else {
        setShowStickyMobileBar(false)
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const defaultBreadcrumbs = [
    { label: "Home", href: routes.home() },
    { label: "Shop", href: routes.catalog() },
    ...(product.categoryNames[0]
      ? [{ label: product.categoryNames[0], href: routes.category(product.categoryNames[0].toLowerCase().replace(/\s+/g, "-")) }]
      : []),
    { label: product.title, href: routes.product(product.handle) },
  ]

  const activeBreadcrumbs = breadcrumbs || defaultBreadcrumbs
  const primaryThumb = product.thumbnail || product.images[0]

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-brand-border/80 py-4 bg-brand-surface">
        <div className="editorial-container">
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
      <div className="editorial-container py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Media Gallery */}
          <div className="lg:col-span-7">
            <ImageGallery images={product.images} title={product.title} />
          </div>

          {/* Right Product Actions & Details (Desktop Sticky Column) */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6 self-start">
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
            <div ref={mainCtaRef} className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
                {/* Quantity input */}
                <div className="flex items-center border border-brand-border rounded-full bg-white h-12 text-xs px-1">
                  <button
                    type="button"
                    onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isSoldOut}
                    className="w-9 h-full flex items-center justify-center text-brand-primary hover:bg-brand-secondary rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-8 text-center font-heading font-semibold text-xs">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => onQuantityChange(quantity + 1)}
                    disabled={isSoldOut}
                    className="w-9 h-full flex items-center justify-center text-brand-primary hover:bg-brand-secondary rounded-full disabled:opacity-30 disabled:pointer-events-none transition-colors"
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
                  className="flex-1 h-12 rounded-full text-xs font-heading font-bold uppercase tracking-wider shadow-subtle hover:shadow-editorial"
                >
                  {isSoldOut ? "Sold Out" : `Add to Bag • ${selectedVariant?.price.formatted || product.minPrice.formatted}`}
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
          title="Complete The Look"
          subtitle="Foundational pieces engineered to pair seamlessly with your selection."
          viewAllHref={routes.catalog()}
          viewAllLabel="Explore All Pieces"
          products={relatedProducts}
          routes={routes}
          capabilities={capabilities}
          onQuickAdd={onQuickAdd}
          linkComponent={LinkComp}
        />
      )}

      {children}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productCategory={product.categoryNames[0] || product.title}
      />

      {/* Mobile Sticky Bottom Bar */}
      {showStickyMobileBar && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-brand-border p-3 shadow-2xl flex items-center justify-between gap-3 animate-mega-enter">
          <div className="flex items-center gap-2.5 min-w-0">
            {primaryThumb && (
              <div className="relative w-10 h-12 bg-brand-secondary rounded overflow-hidden flex-shrink-0">
                <Image
                  src={primaryThumb.url}
                  alt={product.title}
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
            )}
            <div className="min-w-0">
              <p className="font-heading font-bold text-xs text-brand-primary truncate">
                {product.title}
              </p>
              <p className="font-heading font-semibold text-[11px] text-brand-primary/80">
                {selectedVariant?.price.formatted || product.minPrice.formatted}
              </p>
            </div>
          </div>

          <Button
            type="button"
            onClick={onAddToCart}
            disabled={isSoldOut}
            isLoading={isAddingToCart}
            variant="primary"
            className="h-11 px-5 rounded-full text-xs font-heading font-bold uppercase tracking-wider flex-shrink-0"
          >
            {isSoldOut ? "Sold Out" : "Add to Bag"}
          </Button>
        </div>
      )}
    </div>
  )
}
