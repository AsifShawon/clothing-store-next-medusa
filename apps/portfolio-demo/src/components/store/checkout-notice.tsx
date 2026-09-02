import React from "react"
import { ShieldCheck, InformationCircleSolid } from "@medusajs/icons"

interface CheckoutNoticeProps {
  className?: string
}

export function CheckoutNotice({ className = "" }: CheckoutNoticeProps) {
  return (
    <div
      role="region"
      aria-label="Portfolio Demo Security Disclaimer"
      className={`p-4 bg-brand-secondary border border-brand-border/80 flex items-start gap-3 text-xs text-brand-primary ${className}`}
    >
      <InformationCircleSolid className="w-5 h-5 text-brand-accent flex-shrink-0 mt-0.5" />
      <div className="space-y-1">
        <div className="flex items-center gap-2 font-bold uppercase tracking-wider text-[11px] text-brand-accent">
          <span>Simulation Environment</span>
          <span>•</span>
          <span>Zero Real Transactions</span>
        </div>
        <p className="leading-relaxed font-medium text-grey-80">
          Portfolio demo — no payment will be processed and no personal information is sent anywhere.
        </p>
      </div>
    </div>
  )
}
