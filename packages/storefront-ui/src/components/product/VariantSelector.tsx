"use client"

import React from "react"
import clsx from "clsx"
import { ProductOptionView, ProductVariantView, StoreCapabilities } from "@dtc/commerce-contracts"
import { COLOR_SWATCHES } from "../../theme/colors"

export interface VariantSelectorProps {
  options: ProductOptionView[]
  variants?: ProductVariantView[]
  selectedOptions: Record<string, string>
  onSelectOption: (title: string, value: string) => void
  capabilities?: StoreCapabilities
  onOpenSizeGuide?: () => void
  disabled?: boolean
}

export function VariantSelector({
  options,
  variants: _variants,
  selectedOptions,
  onSelectOption,
  capabilities: _capabilities,
  onOpenSizeGuide,
  disabled = false,
}: VariantSelectorProps) {
  if (!options || options.length === 0) return null

  return (
    <div className="space-y-5 py-4 border-b border-brand-border">
      {options.map((opt) => {
        const isColor = opt.title.toLowerCase().includes("color")
        const isSize = opt.title.toLowerCase().includes("size")
        const selectedVal = selectedOptions[opt.title.toLowerCase()] || selectedOptions[opt.title] || opt.values[0]

        return (
          <div key={opt.id} className="flex flex-col gap-y-2.5">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-heading font-semibold uppercase tracking-wider text-brand-primary">
                Select {opt.title}:
              </span>
              <div className="flex items-center gap-3">
                {selectedVal && (
                  <span className="font-medium text-brand-accent">{selectedVal}</span>
                )}
                {isSize && onOpenSizeGuide && (
                  <button
                    type="button"
                    onClick={onOpenSizeGuide}
                    className="text-xs font-heading font-semibold text-brand-accent hover:underline uppercase tracking-wider"
                  >
                    Size Guide
                  </button>
                )}
              </div>
            </div>

            {/* Option Pills */}
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label={`Select ${opt.title}`}
            >
              {opt.values.map((val) => {
                const isSelected = selectedVal?.toLowerCase() === val.toLowerCase()
                const hex = isColor ? COLOR_SWATCHES[val.toLowerCase()] || "#cccccc" : undefined

                return (
                  <button
                    key={val}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    aria-label={`${opt.title} ${val}`}
                    onClick={() => onSelectOption(opt.title, val)}
                    disabled={disabled}
                    className={clsx(
                      "min-w-[44px] h-10 px-3.5 flex items-center justify-center text-xs font-semibold uppercase tracking-wider transition-all duration-150 border",
                      isSelected
                        ? "border-brand-primary bg-brand-primary text-white shadow-sm ring-1 ring-brand-primary"
                        : "border-brand-border bg-white text-brand-primary hover:border-brand-primary/60",
                      disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    {hex && (
                      <span
                        className="w-3 h-3 rounded-full mr-2 border border-black/20 flex-shrink-0"
                        style={{ backgroundColor: hex }}
                        aria-hidden="true"
                      />
                    )}
                    <span>{val}</span>
                  </button>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
