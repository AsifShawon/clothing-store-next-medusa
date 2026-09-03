import React from "react"
import Link from "next/link"
import { StoreRoutes } from "@dtc/commerce-contracts"
import { LinkComponent } from "../../types"

export interface PolicySection {
  title: string
  content: React.ReactNode
}

export interface PolicyViewProps {
  badge?: string
  title: string
  subtitle?: string
  lastUpdated?: string
  sections: PolicySection[]
  routes: StoreRoutes
  linkComponent?: LinkComponent
}

export function PolicyView({
  badge = "Customer Care & Transparency",
  title,
  subtitle,
  lastUpdated = "October 2024",
  sections,
  routes,
  linkComponent: LinkComp = Link,
}: PolicyViewProps) {
  return (
    <div className="bg-white min-h-screen">
      {/* Header Banner */}
      <div className="bg-brand-secondary border-b border-brand-border py-12 sm:py-16">
        <div className="content-container max-w-3xl text-center space-y-3">
          {badge && (
            <span className="text-xs font-heading font-semibold uppercase tracking-widest text-brand-accent">
              {badge}
            </span>
          )}
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl text-brand-primary">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-brand-primary/70 max-w-xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          <p className="text-[11px] text-brand-muted uppercase tracking-wider font-heading">
            Last Updated: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-container max-w-3xl py-12 sm:py-16 space-y-10">
        <div className="divide-y divide-brand-border border border-brand-border bg-white">
          {sections.map((section, idx) => (
            <div key={idx} className="p-6 sm:p-8 space-y-3">
              <h2 className="font-display text-xl sm:text-2xl text-brand-primary">
                {section.title}
              </h2>
              <div className="text-xs sm:text-sm text-brand-primary/80 leading-relaxed space-y-2">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links Footer */}
        <div className="p-6 bg-brand-surface border border-brand-border flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div>
            <span className="font-heading font-bold text-brand-primary block">
              Have questions regarding this policy?
            </span>
            <p className="text-[11px] mt-0.5">
              Contact our Dhaka client advisors for immediate clarification.
            </p>
          </div>
          <LinkComp
            href={routes.contact()}
            className="px-5 py-2.5 bg-brand-primary text-white font-heading font-semibold uppercase tracking-wider text-xs hover:bg-black transition-colors flex-shrink-0"
          >
            Contact Client Care
          </LinkComp>
        </div>
      </div>
    </div>
  )
}
