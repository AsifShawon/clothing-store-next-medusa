"use client"

import React, { useState, useMemo, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { useDemoProduct, useDemoProducts, useDemoCart, useDemoStore } from "@lib/demo-store-context"
import { ProductDetailView, ShareIcon } from "@dtc/storefront-ui"
import { DEFAULT_DEMO_CAPABILITIES, QuickAddRequest, QuickAddResult } from "@dtc/commerce-contracts"
import { toProductView } from "../../adapters/local-storage/catalog"
import { demoRoutes } from "../../adapters/local-storage/routes"

function ProductDetailContent() {
  const searchParams = useSearchParams()
  const handle = searchParams.get("handle")

  const { product } = useDemoProduct(handle)
  const { allProducts } = useDemoProducts()
  const { addItem } = useDemoCart()
  const { showToast, setIsCartDrawerOpen } = useDemoStore()

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product && product.options.length > 0) {
      const initial: Record<string, string> = {}
      product.options.forEach((opt) => {
        initial[opt.title] = opt.values[0]
      })
      setSelectedOptions(initial)
      setQuantity(1)
    }
  }, [product])

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
    setIsCartDrawerOpen(true)
  }

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

  const productView = toProductView(product)
  const relatedProductViews = allProducts
    .filter((p) => p.id !== product.id && p.categoryNames.some((c) => product.categoryNames.includes(c)))
    .slice(0, 4)
    .map(toProductView)

  const selectedVariantView = selectedVariant
    ? productView.variants.find((v) => v.id === selectedVariant.id)
    : undefined

  return (
    <ProductDetailView
      product={productView}
      relatedProducts={relatedProductViews}
      selectedOptions={selectedOptions}
      onSelectOption={handleSelectOption}
      selectedVariant={selectedVariantView}
      quantity={quantity}
      onQuantityChange={setQuantity}
      onAddToCart={handleAddToCart}
      onQuickAdd={handleQuickAdd}
      routes={demoRoutes}
      capabilities={DEFAULT_DEMO_CAPABILITIES}
      linkComponent={Link}
      shareSlot={
        <button
          type="button"
          onClick={handleCopyLink}
          className="text-xs text-brand-muted hover:text-brand-primary flex items-center gap-1.5 transition-colors pt-1"
        >
          <ShareIcon className="w-3.5 h-3.5" />
          <span>Share Garment Link</span>
        </button>
      }
    />
  )
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="content-container py-20 text-center text-xs">Loading Garment...</div>}>
      <ProductDetailContent />
    </Suspense>
  )
}
