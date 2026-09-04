import React from "react"
import { BadgeCheckIcon, ShieldCheckIcon, TruckIcon, SparklesIcon } from "../icons"

export function DeliveryGuaranteesSection() {
  const guarantees = [
    {
      icon: TruckIcon,
      title: "Dhaka Express Delivery",
      description: "Same-day dispatch from Tejgaon. 24–48h courier delivery nationwide.",
    },
    {
      icon: ShieldCheckIcon,
      title: "24h Doorstep Exchanges",
      description: "Try on at home. Flawless size swaps right at your doorstep.",
    },
    {
      icon: BadgeCheckIcon,
      title: "Cash on Delivery & Cards",
      description: "bKash, Nagad, Visa, Mastercard, or pay cash upon receipt.",
    },
    {
      icon: SparklesIcon,
      title: "Complimentary Alterations Advice",
      description: "Guidance on sleeve length, hem styling, and fit preservation.",
    },
  ]

  return (
    <section className="bg-white border-b border-brand-border/80 py-12 sm:py-16">
      <div className="editorial-container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {guarantees.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 rounded-xl bg-brand-surface border border-brand-border/60 hover:border-brand-primary/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-brand-primary text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1 min-w-0">
                  <h4 className="font-heading font-bold text-xs sm:text-sm text-brand-primary uppercase tracking-wider truncate">
                    {item.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-brand-muted leading-relaxed font-sans">
                    {item.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
