"use client"

import React from "react"
import { DemoProduct, DemoProductVariant } from "@lib/types"

interface VariantSelectorProps {
  product: DemoProduct
  selectedOptions: Record<string, string>
  onSelectOption: (title: string, value: string) => void
  selectedVariant: DemoProductVariant | null
}

const COLOR_SWATCHES: Record<string, string> = {
  black: "#111111",
  white: "#FFFFFF",
  "sky blue": "#87CEEB",
  "forest green": "#1E4937",
  "midnight navy": "#1B2A4A",
  khaki: "#C3B091",
  charcoal: "#36454F",
  olive: "#556B2F",
  sand: "#CFC4B5",
}

export function VariantSelector({
  product,
  selectedOptions,
  onSelectOption,
  selectedVariant,
}: VariantSelectorProps) {
  return (
    <div className="space-y-5">
      {product.options.map((option) => {
        const isColor = option.title.toLowerCase() === "color"
        const isSize = option.title.toLowerCase() === "size"

        return (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                {option.title}:{" "}
                <span className="font-medium text-grey-60 normal-case">
                  {selectedOptions[option.title]}
                </span>
              </span>

              {isSize && (
                <span className="text-[11px] text-grey-40">Standard UK/BD Fit</span>
              )}
            </div>

            {/* Color Option Selector */}
            {isColor && (
              <div className="flex flex-wrap gap-2.5">
                {option.values.map((val) => {
                  const isSelected = selectedOptions[option.title] === val
                  const hex = COLOR_SWATCHES[val.toLowerCase()] || "#E5E5E5"

                  // Check if any variant with this color is in stock
                  const variantsWithColor = product.variants.filter(
                    (v) => v.options[option.title] === val
                  )
                  const hasStock = variantsWithColor.some(
                    (v) => !v.manageInventory || v.inventoryQuantity > 0
                  )

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => onSelectOption(option.title, val)}
                      title={`${val} ${!hasStock ? "(Out of stock)" : ""}`}
                      className={`relative w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "ring-2 ring-brand-primary ring-offset-2 scale-105"
                          : "hover:scale-105"
                      } ${hex === "#FFFFFF" ? "border-grey-30" : "border-transparent"} ${
                        !hasStock ? "opacity-40" : ""
                      }`}
                      style={{ backgroundColor: hex }}
                      aria-label={`Select color ${val}`}
                    >
                      {!hasStock && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-full h-0.5 bg-rose-600 rotate-45" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}

            {/* Size / Standard Option Selector */}
            {!isColor && (
              <div className="flex flex-wrap gap-2">
                {option.values.map((val) => {
                  const isSelected = selectedOptions[option.title] === val

                  // Check stock for the exact combination with currently selected other options
                  const testOptions = { ...selectedOptions, [option.title]: val }
                  const matchingVariant = product.variants.find((v) =>
                    Object.entries(testOptions).every(([k, vVal]) => v.options[k] === vVal)
                  )

                  const isOutOfStock =
                    matchingVariant &&
                    matchingVariant.manageInventory &&
                    matchingVariant.inventoryQuantity <= 0

                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => onSelectOption(option.title, val)}
                      disabled={isOutOfStock}
                      className={`min-w-[44px] h-10 px-3.5 text-xs font-semibold uppercase tracking-wider border rounded transition-all flex items-center justify-center relative ${
                        isSelected
                          ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                          : isOutOfStock
                          ? "bg-grey-10 text-grey-40 border-grey-20 cursor-not-allowed line-through"
                          : "bg-white text-brand-primary border-brand-border hover:border-brand-primary"
                      }`}
                      aria-label={`Select ${option.title} ${val} ${isOutOfStock ? "(Out of stock)" : ""}`}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}

      {/* Real-time Inventory Status Indicator */}
      {selectedVariant && (
        <div className="pt-2">
          {selectedVariant.manageInventory ? (
            selectedVariant.inventoryQuantity > 0 ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                <span className="text-emerald-800 font-medium">
                  In Stock ({selectedVariant.inventoryQuantity} units at Dhaka Central Warehouse)
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span className="text-rose-800 font-semibold">
                  Out of Stock — Please select another size/color
                </span>
              </div>
            )
          ) : (
            <div className="flex items-center gap-2 text-xs text-grey-60">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>Available for dispatch</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
