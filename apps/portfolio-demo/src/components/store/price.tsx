import React from "react"
import { formatBDT } from "@lib/utils"

interface PriceProps {
  amount: number
  originalAmount?: number
  className?: string
  currencyClassName?: string
}

export function Price({ amount, originalAmount, className = "text-base font-semibold", currencyClassName }: PriceProps) {
  return (
    <div className="flex items-baseline gap-2">
      <span className={`text-brand-primary ${className}`}>
        {formatBDT(amount)}
      </span>
      {originalAmount && originalAmount > amount && (
        <span className="text-xs text-grey-40 line-through">
          {formatBDT(originalAmount)}
        </span>
      )}
    </div>
  )
}
