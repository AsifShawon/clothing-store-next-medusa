import React from "react"
import Link from "next/link"

export default function TermsAndConditionsPage() {
  return (
    <div className="content-container py-16 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-brand-border pb-6">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Legal Standards</span>
        <h1 className="font-display text-4xl text-brand-primary mt-2">Terms & Conditions</h1>
        <p className="text-xs text-grey-60 mt-1">London Boy Brand Terms & Simulated Commercial Agreement</p>
      </div>

      <div className="prose prose-sm text-grey-70 space-y-6 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-heading font-bold text-base text-brand-primary">1. Demonstration Scope</h2>
        <p>
          This web application is delivered as a technical and design portfolio demonstration. Orders placed on this
          instance are simulated for evaluation purposes.
        </p>

        <h2 className="font-heading font-bold text-base text-brand-primary pt-4">2. Product Descriptions & Pricing</h2>
        <p>
          All pricing is quoted in Bangladeshi Taka (BDT). Prices include standard domestic VAT where applicable. Product
          imagery and garment descriptions represent real London Boy design specifications.
        </p>

        <h2 className="font-heading font-bold text-base text-brand-primary pt-4">3. Intellectual Property</h2>
        <p>
          The London Boy brand identity, photographic assets, and bespoke garment cuts are intellectual property
          developed for this platform.
        </p>
      </div>

      <div className="pt-6 border-t border-brand-border">
        <Link href="/" className="contrast-btn text-xs inline-block">
          Return to Storefront
        </Link>
      </div>
    </div>
  )
}
