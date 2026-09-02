import React from "react"
import Link from "next/link"

export default function ShippingPolicyPage() {
  return (
    <div className="content-container py-16 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-brand-border pb-6">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Delivery Standards</span>
        <h1 className="font-display text-4xl text-brand-primary mt-2">Shipping & Delivery Policy</h1>
        <p className="text-xs text-grey-60 mt-1">Last updated: September 2026 • Bangladesh Delivery Network</p>
      </div>

      <div className="prose prose-sm text-grey-70 space-y-6 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-heading font-bold text-base text-brand-primary">1. Delivery Zones & Rates</h2>
        <div className="border border-brand-border bg-brand-card p-4 space-y-3">
          <div className="flex justify-between items-center border-b border-brand-border/60 pb-2">
            <div>
              <strong className="text-brand-primary block">Inside Dhaka City</strong>
              <span className="text-xs text-grey-50">Timeline: 24 - 48 Hours</span>
            </div>
            <span className="font-bold text-brand-primary">৳60</span>
          </div>

          <div className="flex justify-between items-center border-b border-brand-border/60 pb-2">
            <div>
              <strong className="text-brand-primary block">Dhaka Suburban (Gazipur, Savar, Narayanganj)</strong>
              <span className="text-xs text-grey-50">Timeline: 2 - 3 Business Days</span>
            </div>
            <span className="font-bold text-brand-primary">৳100</span>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <strong className="text-brand-primary block">Outside Dhaka (All 64 Districts)</strong>
              <span className="text-xs text-grey-50">Timeline: 3 - 5 Business Days</span>
            </div>
            <span className="font-bold text-brand-primary">৳130</span>
          </div>
        </div>

        <h2 className="font-heading font-bold text-base text-brand-primary pt-4">2. Dispatch & Tracking</h2>
        <p>
          All orders placed before 4:00 PM BST are dispatched the same day from our Central Warehouse in Tejgaon, Dhaka.
          Customers receive tracking updates via SMS and phone confirmation prior to delivery attempt.
        </p>

        <h2 className="font-heading font-bold text-base text-brand-primary pt-4">3. Cash on Delivery Terms</h2>
        <p>
          Cash on Delivery is available across all serviceable delivery zones. Customers may inspect the outer package
          seal upon receipt before completing payment to the courier rider.
        </p>
      </div>

      <div className="pt-6 border-t border-brand-border">
        <Link href="/shop" className="contrast-btn text-xs inline-block">
          Explore Garments
        </Link>
      </div>
    </div>
  )
}
