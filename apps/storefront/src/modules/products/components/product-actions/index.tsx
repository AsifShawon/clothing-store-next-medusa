"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"
import { useRouter } from "next/navigation"
import SizeGuideModal from "../size-guide-modal"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt) => {
    if (varopt.option_id) acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false)
  const [addedSuccess, setAddedSuccess] = useState(false)
  const countryCode = (useParams()?.countryCode as string) || "bd"

  // Preselect if only 1 variant
  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const value = isValidVariant ? selectedVariant?.id : null

    if (params.get("v_id") === value) {
      return
    }

    if (value) {
      params.set("v_id", value)
    } else {
      params.delete("v_id")
    }

    router.replace(pathname + "?" + params.toString())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedVariant, isValidVariant])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const stockQuantity = selectedVariant?.inventory_quantity || 0

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)
    setAddedSuccess(false)

    try {
      await addToCart({
        variantId: selectedVariant.id,
        quantity,
        countryCode,
      })
      setAddedSuccess(true)
      setTimeout(() => setAddedSuccess(false), 4000)
    } catch (err) {
      console.error("Failed to add to cart:", err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <>
      <div className="flex flex-col gap-y-5" ref={actionsRef}>
        {/* Variant Selectors */}
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-5">
              {(product.options || []).map((option) => {
                return (
                  <div key={option.id}>
                    <OptionSelect
                      option={option}
                      current={options[option.id]}
                      updateOption={setOptionValue}
                      title={option.title ?? ""}
                      data-testid="product-options"
                      disabled={!!disabled || isAdding}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Size Guide Trigger */}
        <div className="flex items-center justify-between pt-1">
          <button
            type="button"
            onClick={() => setIsSizeGuideOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-heading font-semibold uppercase tracking-wider text-brand-accent hover:underline"
          >
            <span>📏</span>
            <span>View London Boy Size Guide</span>
          </button>
        </div>

        {/* Price Display */}
        <div className="pt-2 border-t border-brand-border/60">
          <ProductPrice product={product} variant={selectedVariant} />
        </div>

        {/* Live Stock Level Indicator */}
        {selectedVariant && (
          <div className="p-3 bg-brand-secondary/60 border border-brand-border text-xs flex items-center justify-between">
            {inStock ? (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-accent animate-pulse" />
                <span className="font-medium text-brand-primary">
                  In Stock — {stockQuantity} units in Dhaka Warehouse (Ships in 24h)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-brand-accent-alt">
                <span className="w-2 h-2 rounded-full bg-brand-accent-alt" />
                <span className="font-medium">Currently Sold Out</span>
              </div>
            )}
          </div>
        )}

        {/* Quantity Stepper & Add to Cart */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-brand-border bg-brand-card h-12">
              <button
                type="button"
                disabled={quantity <= 1 || isAdding}
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-10 h-full flex items-center justify-center text-sm font-bold hover:bg-brand-secondary disabled:opacity-30"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-12 text-center text-xs font-bold text-brand-primary">
                {quantity}
              </span>
              <button
                type="button"
                disabled={quantity >= stockQuantity || isAdding}
                onClick={() => setQuantity((q) => q + 1)}
                className="w-10 h-full flex items-center justify-center text-sm font-bold hover:bg-brand-secondary disabled:opacity-30"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={
                !inStock ||
                !selectedVariant ||
                !!disabled ||
                isAdding ||
                !isValidVariant
              }
              className={`flex-1 h-12 px-6 flex items-center justify-center text-xs font-heading font-semibold uppercase tracking-widest transition-all duration-200 ${
                addedSuccess
                  ? "bg-brand-accent text-white"
                  : !selectedVariant
                  ? "bg-brand-primary/40 text-white cursor-not-allowed"
                  : !inStock || !isValidVariant
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-brand-primary text-white hover:bg-black shadow-md hover:shadow-lg"
              }`}
              data-testid="add-product-button"
            >
              {isAdding ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding to Bag...
                </span>
              ) : addedSuccess ? (
                "✓ Added to Bag!"
              ) : !selectedVariant ? (
                "Select Size & Color"
              ) : !inStock || !isValidVariant ? (
                "Out of Stock"
              ) : (
                `Add to Bag • ${quantity} ${quantity > 1 ? "Items" : "Item"}`
              )}
            </button>
          </div>

          {/* Guarantee Highlights */}
          <div className="pt-3 border-t border-brand-border/40 grid grid-cols-2 gap-2 text-[11px] text-brand-primary/70">
            <div className="flex items-center gap-1.5">
              <span>⚡</span>
              <span>Inside Dhaka: ৳60 (24–48h)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>🛡️</span>
              <span>24-Hour Return Policy</span>
            </div>
          </div>
        </div>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />
    </>
  )
}
