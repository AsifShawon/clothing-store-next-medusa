import LocalizedClientLink from "@modules/common/components/localized-client-link"
import React from "react"

const Help = () => {
  return (
    <div className="space-y-3 text-xs">
      <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-brand-primary">
        Need Assistance with Your Order?
      </h3>
      <p className="text-brand-primary/70 leading-relaxed">
        Our Dhaka customer care team is here to assist with size exchanges, address adjustments, or delivery tracking.
      </p>
      <div className="flex flex-wrap gap-4 pt-2">
        <LocalizedClientLink
          href="/contact"
          className="text-xs font-semibold text-brand-accent hover:underline flex items-center gap-1"
        >
          <span>✉️ Contact Customer Care</span>
        </LocalizedClientLink>
        <span className="text-brand-muted">•</span>
        <LocalizedClientLink
          href="/return-policy"
          className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
        >
          <span>🛡️ 24-Hour Return Policy</span>
        </LocalizedClientLink>
        <span className="text-brand-muted">•</span>
        <LocalizedClientLink
          href="/shipping-policy"
          className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1"
        >
          <span>🚚 Delivery Information</span>
        </LocalizedClientLink>
      </div>
    </div>
  )
}

export default Help
