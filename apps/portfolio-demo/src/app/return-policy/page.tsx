import React from "react"
import Link from "next/link"

export default function ReturnPolicyPage() {
  return (
    <div className="content-container py-16 max-w-3xl mx-auto space-y-8">
      <div className="border-b border-brand-border pb-6">
        <span className="badge-tag bg-brand-secondary text-brand-accent">Hassle-Free Exchanges</span>
        <h1 className="font-display text-4xl text-brand-primary mt-2">Return & Exchange Policy</h1>
        <p className="text-xs text-grey-60 mt-1">24-Hour Sizing Guarantee • Dhaka Central Fulfilment</p>
      </div>

      <div className="prose prose-sm text-grey-70 space-y-6 text-xs sm:text-sm leading-relaxed">
        <h2 className="font-heading font-bold text-base text-brand-primary">1. 24-Hour Size Exchange Window</h2>
        <p>
          We want you to feel completely confident in the fit and drape of your London Boy garment. If the size you
          ordered does not match your expectations, you may request an exchange within 24 hours of parcel delivery.
        </p>

        <h2 className="font-heading font-bold text-base text-brand-primary pt-4">2. Garment Condition Criteria</h2>
        <p>
          To qualify for an exchange, items must be:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-grey-60">
          <li>Unworn, unwashed, and free from fragrance, stains, or markings.</li>
          <li>In original packaging with all brand tags intact.</li>
          <li>Accompanied by the original order invoice or packing slip.</li>
        </ul>

        <h2 className="font-heading font-bold text-base text-brand-primary pt-4">3. Exchange Process</h2>
        <p>
          To initiate an exchange, message our customer support team at <strong>+880 1712 345678</strong> with your order
          number and desired replacement size. Our rider will collect the item and deliver your replacement.
        </p>
      </div>

      <div className="pt-6 border-t border-brand-border">
        <Link href="/contact" className="contrast-btn text-xs inline-block">
          Contact Support
        </Link>
      </div>
    </div>
  )
}
