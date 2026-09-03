"use client"

import React from "react"
import { BadgeCheckIcon, CreditCardIcon, ShieldCheckIcon } from "../icons"

export interface PaymentSectionProps {
  children?: React.ReactNode
  paymentSlot?: React.ReactNode
  title?: string
  subtitle?: string
}

export function PaymentSection({
  children,
  paymentSlot,
  title = "Payment Method",
  subtitle = "Transactions are encrypted and processed securely. Cash on Delivery is verified at door.",
}: PaymentSectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2">
          <CreditCardIcon className="w-4 h-4 text-brand-primary" />
          <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-brand-primary">
            {title}
          </h4>
        </div>
        {subtitle && (
          <p className="text-[11px] text-brand-muted mt-1 leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Provider-Specific Payment Container Slot */}
      <div className="border border-brand-border bg-brand-surface p-4 sm:p-5">
        {paymentSlot || children}
      </div>

      {/* Security Guarantees */}
      <div className="flex items-center gap-4 text-[11px] text-brand-muted pt-1">
        <div className="flex items-center gap-1.5">
          <ShieldCheckIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>256-Bit SSL Encryption</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BadgeCheckIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>Verified Merchant</span>
        </div>
      </div>
    </div>
  )
}
