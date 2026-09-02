"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useDemoProduct, useDemoProducts, useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { Price } from "@components/store/price"
import { VariantSelector } from "@components/store/variant-selector"
import { SizeGuideModal } from "@components/store/size-guide-modal"
import { ProductGrid } from "@components/store/product-grid"
import { formatBDT } from "@lib/utils"
import {
  BadgeCheck,
  ShieldCheck,
  TruckFast,
  InformationCircleSolid,
  Share,
  Sparkles,
  ShoppingBag,
} from "@medusajs/icons"

function ProductDetailContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle")

  const { product } = useDemoProduct(handle)
  const { allProducts } = useDemoProducts()
  const { addItem } = useDemoCart()
  const { showToast } = useDemoStore()

  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"details" | "care" | "shipping">("details")

  // Initialize selected options from product default variants
  useEffect(() => {
    if (product && product.options.length > 0) {
      const initial: Record<string, string> = {}
      product.options.forEach((opt) => {
        initial[opt.title] = opt.values[0]
      })
      setSelectedOptions(initial)
      setSelectedImageIdx(0)
      setQuantity(1)
    }
  }, [product])

  // Resolve matching variant
  const selectedVariant = useMemo(() => {
    if (!product || product.variants.length === 0) return null

    return (
      product.variants.find((variant) =>
        Object.entries(selectedOptions).every(
          ([optTitle, optVal]) => variant.options[optTitle] === optVal
        )
      ) || product.variants[0]
    )
  }, [product, selectedOptions])

  const handleSelectOption = (title: string, value: string) => {
    setSelectedOptions((prev) => ({ ...prev, [title]: value }))
  }

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return
    addItem(product, selectedVariant, quantity)
  }

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href)
      showToast("Link Copied", "Product link copied to clipboard", "info")
    }
  }

  if (!product) {
    return (
      <div className="content-container py-24 text-center space-y-4">
        <h2 className="font-display text-2xl text-brand-primary">Garment Not Found</h2>
        <p className="text-xs text-grey-50 max-w-sm mx-auto">
          The requested garment could not be found or has been removed from the catalog.
        </p>
        <Link
          href="/shop"
          className="inline-block px-5 py-2.5 bg-brand-primary text-white text-xs font-semibold hover:bg-brand-accent transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    )
  }

  const images = product.images.length > 0 ? product.images : [product.thumbnail]
  const currentImage = images[selectedImageIdx] || product.thumbnail

  const isOutOfStock = Boolean(
    selectedVariant &&
    selectedVariant.manageInventory &&
    selectedVariant.inventoryQuantity <= 0
  )

  const maxAvailable = selectedVariant?.manageInventory
    ? selectedVariant.inventoryQuantity
    : 99

  // Related products
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && p.categoryNames.some((c) => product.categoryNames.includes(c)))
    .slice(0, 4)

  return (
    <div className="content-container py-8 sm:py-12 space-y-16">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs text-grey-50 flex items-center gap-2">
        <Link href="/" className="hover:text-brand-primary transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-primary transition-colors">
          Clothing
        </Link>
        <span>/</span>
        <Link
          href={`/category?handle=${product.categoryNames[0]?.toLowerCase().replace(/\s+/g, "-")}`}
          className="hover:text-brand-primary transition-colors"
        >
          {product.categoryNames[0] || "Catalog"}
        </Link>
        <span>/</span>
        <span className="text-brand-primary font-medium truncate max-w-[180px] sm:max-w-none">
          {product.title}
        </span>
      </nav>

      {/* Main Product Layout: Gallery + Purchasing Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-7 flex flex-col-reverse sm:flex-row gap-4">
          {/* Vertical Thumbnails on Desktop / Horizontal on Mobile */}
          {images.length > 1 && (
            <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto max-h-[550px] pb-2 sm:pb-0 flex-shrink-0">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIdx(idx)}
                  className={`relative w-16 h-20 bg-brand-secondary border flex-shrink-0 overflow-hidden transition-all ${
                    selectedImageIdx === idx
                      ? "border-brand-primary ring-1 ring-brand-primary"
                      : "border-brand-border opacity-70 hover:opacity-100"
                  }`}
                  aria-label={`View image ${idx + 1}`}
                >
                  <Image src={img} alt={`${product.title} view ${idx + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Large Main Showcase Image */}
          <div className="relative aspect-[3/4] w-full bg-brand-secondary border border-brand-border overflow-hidden flex-1">
            <Image
              src={currentImage}
              alt={product.title}
              fill
              priority
              className="object-cover object-center transition-all duration-300"
            />
            {product.collectionHandle === "new-arrivals" && (
              <span className="absolute top-4 left-4 bg-brand-accent text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 shadow">
                New Season Drop
              </span>
            )}
          </div>
        </div>

        {/* Right Column: Purchasing Actions & Metadata */}
        <div className="lg:col-span-5 space-y-6">
          {/* Header & Title */}
          <div className="space-y-2 border-b border-brand-border pb-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-accent">
                {product.categoryNames.join(" • ")}
              </span>
              <button
                type="button"
                onClick={handleCopyLink}
                className="text-xs text-grey-50 hover:text-brand-primary flex items-center gap-1 transition-colors"
                title="Share garment"
              >
                <Share className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            <h1 className="font-display text-2xl sm:text-3xl text-brand-primary leading-tight">
              {product.title}
            </h1>

            {product.subtitle && (
              <p className="text-xs text-grey-60 font-medium">{product.subtitle}</p>
            )}

            {/* Price Display */}
            <div className="pt-2 flex items-baseline gap-3">
              <Price
                amount={selectedVariant ? selectedVariant.price : 1250}
                className="text-2xl font-bold text-brand-primary"
              />
              {selectedVariant?.usdPrice && (
                <span className="text-xs text-grey-40 font-mono">
                  (Approx. ${selectedVariant.usdPrice} USD)
                </span>
              )}
            </div>

            {selectedVariant && (
              <div className="text-[11px] font-mono text-grey-40 pt-1">
                SKU: <strong className="text-grey-70">{selectedVariant.sku}</strong>
              </div>
            )}
          </div>

          {/* Variant Selector (Colors & Sizes) */}
          <VariantSelector
            product={product}
            selectedOptions={selectedOptions}
            onSelectOption={handleSelectOption}
            selectedVariant={selectedVariant}
          />

          {/* Size Guide Trigger */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1.5"
            >
              <InformationCircleSolid className="w-4 h-4" />
              <span>View UK/BD Size & Fit Measurement Guide</span>
            </button>
          </div>

          {/* Quantity & Add to Cart Controls */}
          <div className="pt-4 border-t border-brand-border space-y-4">
            <div className="flex items-center gap-4">
              {/* Quantity Stepper */}
              <div className="flex items-center border border-brand-border bg-brand-surface rounded">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="w-10 h-11 flex items-center justify-center text-sm font-bold text-grey-60 hover:text-brand-primary hover:bg-brand-secondary disabled:opacity-40"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm font-bold font-mono text-brand-primary">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(maxAvailable, q + 1))}
                  disabled={quantity >= maxAvailable || isOutOfStock}
                  className="w-10 h-11 flex items-center justify-center text-sm font-bold text-grey-60 hover:text-brand-primary hover:bg-brand-secondary disabled:opacity-40"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {/* Add to Bag CTA */}
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 h-11 px-6 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow ${
                  isOutOfStock
                    ? "bg-grey-20 text-grey-40 cursor-not-allowed"
                    : "bg-brand-primary hover:bg-brand-accent text-white"
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? "Out of Stock" : "Add to Shopping Bag"}</span>
              </button>
            </div>
          </div>

          {/* Regional Benefits Callout */}
          <div className="p-4 bg-brand-secondary/70 border border-brand-border space-y-2.5 text-xs text-grey-70">
            <div className="flex items-center gap-2.5">
              <TruckFast className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <span>
                <strong>Inside Dhaka:</strong> 24-48 Hours (৳60) • <strong>Nationwide:</strong> 3-5 Days (৳130)
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <span>24-Hour hassle-free door-to-door size exchange within Dhaka.</span>
            </div>
            <div className="flex items-center gap-2.5">
              <BadgeCheck className="w-4 h-4 text-brand-accent flex-shrink-0" />
              <span>{product.metadata?.origin || "Designed in UK, crafted in Bangladesh"}</span>
            </div>
          </div>

          {/* Specifications Accordion / Tabbed Details */}
          <div className="pt-4 border-t border-brand-border space-y-3">
            <div className="flex border-b border-brand-border text-xs font-semibold uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`py-2 px-3 border-b-2 -mb-px transition-colors ${
                  activeTab === "details"
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-grey-50 hover:text-brand-primary"
                }`}
              >
                Details & Fit
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("care")}
                className={`py-2 px-3 border-b-2 -mb-px transition-colors ${
                  activeTab === "care"
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-grey-50 hover:text-brand-primary"
                }`}
              >
                Fabric & Care
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("shipping")}
                className={`py-2 px-3 border-b-2 -mb-px transition-colors ${
                  activeTab === "shipping"
                    ? "border-brand-primary text-brand-primary font-bold"
                    : "border-transparent text-grey-50 hover:text-brand-primary"
                }`}
              >
                Fulfillment
              </button>
            </div>

            <div className="text-xs text-grey-70 leading-relaxed pt-1">
              {activeTab === "details" && (
                <div className="space-y-2">
                  <p>{product.description}</p>
                  <p className="font-semibold text-brand-primary">Material: {product.material}</p>
                  {product.metadata?.fit && <p>Fit: {product.metadata.fit}</p>}
                </div>
              )}
              {activeTab === "care" && (
                <div className="space-y-2">
                  <p className="font-semibold text-brand-primary">Washing Instructions:</p>
                  <p>{product.metadata?.careInstructions || "Machine wash cold at 30°C. Line dry in shade. Do not tumble dry."}</p>
                </div>
              )}
              {activeTab === "shipping" && (
                <div className="space-y-2">
                  <p>
                    All items are stocked and dispatched from our <strong>Dhaka Central Warehouse</strong> (Tejgaon Industrial Area).
                  </p>
                  <p>Cash on Delivery is available across all 64 districts of Bangladesh.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Complete the Look / Related Products Rail */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-brand-border space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl text-brand-primary">Complete the Look</h3>
            <Link
              href="/shop"
              className="text-xs font-semibold text-brand-primary hover:text-brand-accent uppercase tracking-wider"
            >
              View Full Collection →
            </Link>
          </div>
          <ProductGrid products={relatedProducts} />
        </section>
      )}

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        productCategory={product.categoryNames[0]}
      />
    </div>
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Garment...</div>}>
      <ProductDetailContent />
    </Suspense>
  )
}
