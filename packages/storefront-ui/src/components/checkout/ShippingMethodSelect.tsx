"use client"

import React from "react"
import clsx from "clsx"
import { ShippingMethodView } from "@dtc/commerce-contracts"
import { TruckIcon } from "../icons"

export interface ShippingMethodSelectProps {
  methods: ShippingMethodView[]
  selectedId?: string
  onSelect: (id: string) => void
  disabled?: boolean
}

export function ShippingMethodSelect({
  methods,
  selectedId,
  onSelect,
  disabled = false,
}: ShippingMethodSelectProps) {
  if (!methods || methods.length === 0) {
    return (
      <div className="p-4 bg-brand-surface border border-brand-border text-xs text-brand-muted">
        No delivery options available for this destination.
      </div>
    )
  }

  return (
    <div className="space-y-3" role="radiogroup" aria-label="Delivery Method">
      {methods.map((method) => {
        const isSelected = selectedId === method.id

        return (
          <label
            key={method.id}
            className={clsx(
              "flex items-center justify-between p-4 border cursor-pointer transition-all duration-150",
              isSelected
                ? "border-brand-primary bg-brand-surface ring-1 ring-brand-primary"
                : "border-brand-border bg-white hover:border-brand-primary/60",
              disabled && "opacity-50 pointer-events-none"
            )}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={isSelected}
                onChange={() => onSelect(method.id)}
                disabled={disabled}
                className="w-4 h-4 text-brand-primary border-brand-border focus:ring-brand-primary"
              />
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <TruckIcon className="w-4 h-4 text-brand-primary" />
                  <span className="font-heading font-semibold text-xs text-brand-primary">
                    {method.name}
                  </span>
                </div>
                {method.description && (
                  <p className="text-[11px] text-brand-muted pl-6">
                    {method.description}
                  </p>
                )}
                {method.estimatedDays && (
                  <p className="text-[10px] font-heading font-medium text-brand-accent pl-6 uppercase tracking-wider">
                    {method.estimatedDays}
                  </p>
                )}
              </div>
            </div>

            <span className="font-heading font-bold text-xs text-brand-primary">
              {method.price.formatted}
            </span>
          </label>
        )
      })}
    </div>
  )
}
