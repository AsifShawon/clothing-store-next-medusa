import React from "react"
import Link from "next/link"

export default function PrivacyPolicyPage() {
  return (
    <div className="content-container py-16 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-brand-border pb-6">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Data Transparency</span>
        <h1 className="font-display text-4xl text-brand-primary mt-2">Privacy & Data Policy</h1>
        <p className="text-xs text-grey-60 mt-1">Portfolio Demonstration Privacy Notice</p>
      </div>

      <div className="prose prose-sm text-grey-70 space-y-6 text-xs sm:text-sm leading-relaxed">
        <div className="p-4 bg-brand-card border border-brand-border space-y-1">
          <strong className="text-brand-primary block text-xs">Portfolio Demonstration Notice:</strong>
          <p className="text-xs text-grey-60">
            This website is a client-side portfolio demonstration. All interactions (orders, cart items, profile updates,
            and promo codes) are saved solely inside your local web browser using HTML5 LocalStorage. No user data is
            transmitted to external tracking servers or third-party marketing databases.
          </p>
        </div>

        <h2 className="font-heading font-bold text-base text-brand-primary">1. Local Storage Usage</h2>
        <p>
          We use browser storage exclusively to provide a responsive simulation of cart state, order creation, and
          simulated admin management. You can clear this data at any time by clicking &quot;Reset Data&quot; in the top banner
          or clearing your browser cache.
        </p>

        <h2 className="font-heading font-bold text-base text-brand-primary pt-4">2. Zero Payment Harvesting</h2>
        <p>
          This demonstration does not collect or store actual credit card numbers, CVVs, or financial credentials. All
          payments are simulated.
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
