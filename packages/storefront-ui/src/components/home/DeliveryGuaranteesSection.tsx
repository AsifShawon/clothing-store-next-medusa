import React from "react"
import { BadgeCheckIcon, ShieldCheckIcon, TruckIcon } from "../icons"

export function DeliveryGuaranteesSection() {
  return (
    <section className="bg-brand-surface border-b border-brand-border py-12 sm:py-16">
      <div className="content-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary text-white flex-shrink-0">
              <TruckIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
                24-48h Dhaka Delivery
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Dispatched directly from our Tejgaon fulfillment center. Fast nationwide delivery across Bangladesh.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary text-white flex-shrink-0">
              <ShieldCheckIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
                24-Hour Size Exchange
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Try it on at home. Need a different size? We arrange door-to-door exchange hassle-free.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-brand-primary text-white flex-shrink-0">
              <BadgeCheckIcon className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-brand-primary uppercase tracking-wider">
                Cash on Delivery &amp; Cards
              </h4>
              <p className="text-xs text-brand-muted leading-relaxed">
                Pay securely with Cash on Delivery anywhere in Bangladesh or card checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
